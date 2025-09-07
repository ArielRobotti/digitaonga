import Types "./types";
import Map "mo:map/Map";
import Buffer "mo:base/Buffer";
import Member "member";
import { phash; ihash } "mo:map/Map";
import { now } "mo:base/Time";
import Array "mo:base/Array";

module {

  public type LikeProposal = { #Like; #Dislike };
  
  public type GuardianProposal = {
    #RemoveFromDao : (Principal, Nat64);
    #AssignAsObserver : (Principal, Nat64);
  };

  public type DigitalTaongaProposal = {
    #UpdateDigitalTaonga : UpdateDigitalTaongaProposal;
    #DeleteDigitalTaonga : Nat64;
    // #CreateDigitalTaonga : (Text, Text, Text, Nat64, Text); // Cambiar por argumentos de deploy + archivo GLB: [Blob] para upload
    #CreateDigitalTaonga : CreateDigitalTaongaArgs;
    #RequestDownloadPermision;
  };

  public type CreateDigitalTaongaArgs = {
    name : Text;
    description : Text;
    history : Text;
    deadline : Int;
    imageID : Nat; // Revisar
    chunksQty : Nat;
    chunksFile : [Blob]; //en el submit del proposal se envia vacio y en chunksQty llamadas iterativas se envian los chunks de 1 MiB desde el front
    dataSize : Nat;
  };

  public type UpdateDigitalTaongaProposal = {
    #UpdateImageURL : Text;
    #UpdateDescription : Text;
  };

  public type MotionProposal = { # }; // Consultar

  public type Proposal = {
    id : Int; // Cambio de Nat a Int, podemos definir el ID con el Timestamp de ingreso del proposal en lugar de con la cnatidad actual de proposals
    created_at : Int; // Informacion duplicada por el cambio en el ID
    deadline : Int;
    status : ProposalStatus;
    title : Text;
    creator : Principal;
    votes : [(Principal, Vote)];
    kind : ProposalType;
    description : Text;
    likes : [(Principal, LikeProposal)];
    active_members : Nat;
    comments : [ProposalComment];
  };
  
  public type NewProposalArgs = {
    title: Text;
    description: Text;
    kind: ProposalType;
    deadline: Int;
  };

  public type ProposalEditableData = {
    title : Text; 
    description : Text; 
    kind : ProposalType
  };

  public type ProposalComment = {
    creator : Principal;
    created_at : Nat64;
    likes : Nat64;
    comment : Text;
    thread : [ProposalComment]; //
    dislikes : Nat64;
  };
  public type ProposalError = { #LastAdmin; #Closed; #NotFound; #Unauthorized };
  public type ProposalStatus = {
    #Open;
    #Review;
    #Approved;
    #Rejected;
    #Voting;
  };
  public type ProposalType = {
    #Action : (Text, Text, Nat64);
    #Guardian : GuardianProposal;
    #DigitalTaonga : DigitalTaongaProposal;
    #Motion : MotionProposal;
  };

  public type Vote = { #Approve; #Abstain; #Disapprove };

  public type ProposalExecutionResult = {
    #Ok: {
      #Void; 
      #NewTaongaResult: {
        taongaId: Nat;
        canisterId: Principal;
        deployDate: Int;
        readyDate: ?Int;
        taongaName: Text;
        //TODO otros datos
      };
      #UpdatedTaonga: { /*TODO*/ };

      #Action: { /*TODO*/ };
      #Guardian: { /*TODO*/ };
      #Motion: { /*TODO*/ };
    };
    #Err: Text
  };

  ///////////////////////


  public func new_proposal(s: Types.State, caller: Principal, proposal: NewProposalArgs) : Proposal {
    let id = now(); // TODO Validar este cambio
    let newProposal: Proposal = {
      proposal with
      active_members : Nat = Map.size(s.members);
      comments : [ProposalComment] = [];
      created_at : Int = id;
      creator : Principal = caller;
      id ;
      likes : [(Principal, LikeProposal)] = [];
      status : ProposalStatus = #Open; // TODO 
      votes : [(Principal, Vote)] = []
    };
    ignore Map.put<Int, Proposal>(s.proposals, ihash, id, newProposal);

    // Si el proposal es para crear un Taonga, inicializar un archivo de volcado en el state con el mismo id
    switch (newProposal.kind) {
      case (#DigitalTaonga(#CreateDigitalTaonga(args))) {
        let data = Array.init<Blob>(args.chunksQty, "");
        let newFile: Types.File = {owner = caller; data};
        ignore Map.put<Int, Types.File>(s.tempFiles, ihash, id, newFile);
      };
      case _ {}
    };
    newProposal
  };

  public func addChunk({s: Types.State; caller: Principal; fileId: Int; chunk: Blob; index: Nat}): {#Ok; #Err} {
    switch (Map.get<Int, Types.File>(s.tempFiles, ihash, fileId)) {
      case null { #Err };
      case ( ?{owner; data} ) {
        if (caller == owner) {
          data[index] := chunk;
          #Ok
        } else {
          #Err;
        }
      }
    };
  };

  public func get_proposal(s: Types.State, id: Int) :?Proposal{
    Map.get<Int, Proposal>(s.proposals, ihash, id)
  };

  func proposalUpdatable(pr: Proposal): Bool {
    // TODO establecer mas reglas para permitir edicion de proposal
    pr.status != (#Approved) and
    pr.status != (#Rejected) and
    pr.votes.size() > 0
  };

  public func edit_proposal(s: Types.State, caller: Principal, id: Int, data: ProposalEditableData ): ?Proposal {
    switch (Map.get<Principal, Member.Member>(s.members, phash, caller)){
      case ( ?_ ) { //Si un proposal fue hecho por un miembro que ya no es miembro, no lo podrá editar
        switch (Map.get<Int, Proposal>(s.proposals, ihash, id)){
          case ( ?proposal ) {
            if (proposal.creator != caller) {
              return null
            };
            if (not proposalUpdatable(proposal)) {
              return null
            };
            let { title; description; kind } = data;
            let updatedProposal: Proposal = { proposal with title; description; kind };
            ignore Map.put<Int, Proposal>(s.proposals, ihash, id, updatedProposal);
            ?updatedProposal
          };
          case null null
        }
      };
      case null null
    }
  };

  public func delete_proposal(s: Types.State, caller: Principal, id: Int): ?Proposal {
    switch (Map.remove<Int, Proposal>(s.proposals, ihash, id)){
      case null null;
      case ( ?proposal ) {
        if (proposal.creator == caller and proposalUpdatable(proposal)) {
          return ?proposal
        } else {
          ignore Map.put<Int, Proposal>(s.proposals, ihash, id, proposal);
          return null
        }
      }
    };
  };

  func didProposalPass(pr: Proposal): Bool {
    var yes = 0;
    var no = 0;
    for ((_, v)  in pr.votes.vals()){
      switch v {
        case (#Approve){ yes += 1};
        case (#Disapprove) { no += 1};
        case _ {}
      }
    };
    yes > no;
  };

  func executeProposal(pr: Proposal): ProposalExecutionResult {
    switch (pr.kind) {
      case ( #DigitalTaonga(dt)){
        switch (dt) {
          case (#CreateDigitalTaonga(args)) {

            #Ok( #Void )
          };
          case (_) {
            // TODO
            #Ok( #Void )
          }
        };
        
      };
      case _ {
        // TODO #Action; #Guardian; #Motion;
        #Ok( #Void )
      }
    }
  };

  public func refresh_proposal_status(s: Types.State, id: Int): ?Proposal {
    switch (Map.get<Int, Proposal>(s.proposals, ihash, id)){
      case null { null };
      case ( ?proposal ) {
        let active_members = Member.get_active_members(s).size();
        let total_admins = Member.get_total_admins(s);
        if (now() > proposal.deadline and proposal.status == #Open){
          if(didProposalPass(proposal)) {
            //TODO Ejecutar accion asociada a la aprobacion, si es necesario agregar variante a status que indique que esta en proceso de ejecucion
            //ya que para estar en ejecucion tiene que estar aprovada se puede asociar la misma variante a un valor que indique el estado de ejecicion
          }
        };
        //TODO Actualizar estado 
        null

      }
    }
  };

};
