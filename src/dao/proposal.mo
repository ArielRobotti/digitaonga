import Types "./types";
import SharedTypes "./sharedTypes";
import Taonga "./taonga/taonga";
import TaongaTypes "./taonga/types";
import Map "mo:map/Map";
import Member "member";
import { phash; ihash } "mo:map/Map";
import { now } "mo:base/Time";
import Array "mo:base/Array";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import { print } "mo:base/Debug";
import Error "mo:base/Error";


module {

  type LikeProposal = SharedTypes.LikeProposal;
  type GuardianProposal = SharedTypes.GuardianProposal;
  type DigitalTaongaProposal = SharedTypes.DigitalTaongaProposal;
  type CreateDigitalTaongaArgs = Types.CreateDigitalTaongaArgs;
  type ProposalType = SharedTypes.ProposalType;
  type ProposalPublicData = SharedTypes.ProposalPublicData;
  type UpdateDigitalTaongaProposal = SharedTypes.UpdateDigitalTaongaProposal;
  type Proposal = SharedTypes.Proposal;
  
  /////////////////////// Type definitions ////////////////////////////
  public type NewProposalArgs = {
    title: Text;
    description: Text;
    impact: Text;
    kind: SharedTypes.ProposalType;
    deadline: Int;
    extendedData: SharedTypes.Metadata;
  };

  public type ProposalEditableData = {
    title : Text; 
    description : Text; 
    kind : ProposalType
  };

  public type ProposalExecutionResult = {
    #Ok: {
      #Void; 
      #NewTaongaResult: {
        canisterId: Principal;
        deployDate: Int;
        readyDate: ?Int;
        name: Text;
        //TODO otros datos
      };
      #UpdatedTaonga: { /*TODO*/ };
      #Action: { /*TODO*/ };
      #Guardian: { /*TODO*/ };
      #Motion: { /*TODO*/ };
    };
    #Err: Text
  };

  /////////////////////// Public Functions ////////////////////////////

  public func new_proposal(s: Types.State, member: SharedTypes.Member, proposal: NewProposalArgs) : Proposal {
    let id = now();
    var status: SharedTypes.ProposalStatus = #Open;

    // Si el proposal es para crear un Taonga, inicializar un archivo de volcado en el state con el mismo id
    switch (proposal.kind) {
      case (#DigitalTaonga(#CreateDigitalTaonga(args))) {
        let data = Array.init<Blob>(args.chunksQty, "");
        let newFile: Types.File = {owner = member.principal; data; size = args.dataSize};
        ignore Map.put<Int, Types.File>(s.tempFiles, ihash, id, newFile);
        status := #UploadFileRequired;
      };
      case _ {}
    };

    let deadline = if(proposal.deadline < id) { // Consultar reglas relacionadas a establecer deadline en tiempo pasado
      id + 3 * 24 * 60 * 60 * 1000000000
    } else {
      proposal.deadline
    };

    let newProposal: Proposal = {
      proposal with
      id ;
      deadline ; 
      active_members = Map.size(s.members);
      comments = List.fromArray<SharedTypes.Comment>([]);
      creator = member.principal;
      creatorName = member.name;
      likes = [];
      status ;
      partialResults = {approving = 0; disapproving = 0; abstentions = 0};
      votes = [(member.principal, #Approve)] // Agregamos el voto positivo del creador
    };
    ignore Map.put<Int, Proposal>(s.proposals, ihash, id, newProposal);

    newProposal
  };

  public func addChunk({s: Types.State; caller: Principal; fileId: Int; chunk: Blob; index: Nat; retry: Bool}): {#Ok; #Err} {
    switch (Map.get<Int, Types.File>(s.tempFiles, ihash, fileId)) {
      case null { #Err };
      case ( ?file ) {
        if (caller == file.owner) {
          file.data[index] := chunk;
          
          if(retry or index + 1 == file.data.size()){ // Verificamos la completitud cuando se recibe el ultimo chunk o cuando se manda un chunk en un reintento
            let complet = checkUploadFile(file);
            print("checkUploadFile -> " # debug_show(complet));
            if complet {
              switch(Map.get<Int, Proposal>(s.proposals, ihash, fileId)) {
                case null { };
                case ( ?proposal ) {
                  ignore Map.put<Int, Proposal>(s.proposals, ihash, fileId, { proposal with status = #Open})
                }
              };

              return #Ok
            } else {
              return #Err
            }
          };
          //------------
          #Ok
        } else {
          #Err;
        }
      }
    };
  };
  
  public func get_proposal(s: Types.State, id: Int) : ?Proposal{
    switch (Map.get<Int, Proposal>(s.proposals, ihash, id)) {
      case null null;
      case ( ?proposal ){
        let partialResults = getPartialResults(proposal.votes);
        ?{ proposal with partialResults }
      }
    }
  };

  /// Eliminar esto e incluir creatorName directamente en ProposalPublicData en la proxima migración
  // public type ExtendedProposalPublicData = ProposalPublicData and {creatorName: Text};

  public func get_all_proposals(s: Types.State) : [ProposalPublicData] {
    Iter.toArray(Map.vals<Int, Proposal>(s.proposals));
  };

  public func edit_proposal(s: Types.State, caller: Principal, id: Int, data: ProposalEditableData ): ?Proposal {
    switch (Map.get<Principal, SharedTypes.Member>(s.members, phash, caller)){
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

  public func vote_proposal(s: Types.State, caller: Principal, id: Int, vote: SharedTypes.Vote): ?ProposalPublicData {
    switch (Map.get<Int, Proposal>(s.proposals, ihash, id)){
      case null { null };
      case ( ?proposal ) {
        if (canVote(s, caller)) {
          for (vote in proposal.votes.vals()){
            if(vote.0 == caller){ // Si ya voto retornamos el proposal sin hacer nada
              return ?proposal
            };
          };
          let votes = Array.tabulate<(Principal, SharedTypes.Vote)>(
            proposal.votes.size() + 1,
            func i = if (i < proposal.votes.size()){proposal.votes[i]} else ((caller, vote))
          );
          let partialResults = getPartialResults(votes); 
          ignore Map.put<Int, Proposal>(s.proposals, ihash, id, {proposal with votes; partialResults });
          ?{proposal with partialResults }
        } else {
          null
        }
      }
    }
  };
  
  public func like_proposal(s: Types.State, caller: Principal, id: Int, like: ?LikeProposal): ?Proposal {

    // if(not can_give_like(Member.get_role_member(s, caller))) { 
    //   return null 
    // };

    switch (get_proposal(s, id)){
      case null { return null };
      case (?ppsl) {
        let filteredArray = Array.filter<(Principal, LikeProposal)>(ppsl.likes, func l = l.0 != caller); 
        let updateLikes = switch like {
          case null { // When the like is null and the member had previously given a Like, the like is removed.
            filteredArray 
          };
          case ( ?_like ) {
            Array.tabulate<(Principal, LikeProposal)>(
              filteredArray.size() + 1,
              func i = if (i == 0) { (caller, _like)} else { filteredArray[i - 1]}
            )
          }
        };
        let updatedProposal = { ppsl with likes = updateLikes };
        ignore Map.put<Int, Proposal>(s.proposals, ihash, id, updatedProposal);
        ?updatedProposal
      }
    };
  };
  
  public func refresh_proposal_status(s: Types.State, id: Int, callback: shared Int -> ()): async ?Proposal {
    switch (Map.get<Int, Proposal>(s.proposals, ihash, id)){
      case null { null };
      case ( ?proposal ) {
        let _active_members = Member.get_active_members(s).size();
        let _total_admins = Member.get_total_admins(s);
        let roleOfCreatorProposal = Member.get_role_member(s, proposal.creator);
        let guardiansQty = Array.filter<(Principal, SharedTypes.Member)>(
          Map.toArray<Principal, SharedTypes.Member>(s.members), 
          func entry = entry.1.role == #Guardian
        ).size();
        if (proposal.status == #Open) { 
          print("Actulizando proposal " # debug_show(id));
          if (roleOfCreatorProposal == ?#Admin and guardiansQty < 10) {
            ignore await executeProposal(s, proposal, callback);
            ignore Map.put<Int, SharedTypes.Proposal>(s.proposals, ihash, id, { proposal with status = #Approved});
          } else {
            // Si se superó el plazo se evalúa el la votación para ver si puede ser ejecutada.
            if (now() > proposal.deadline ) {
              if (didProposalPass(proposal)) {
                let resultProposalExecution = await executeProposal(s, proposal, callback);
                print("resultProposalExecution ----> " # debug_show(resultProposalExecution));
                ignore Map.put<Int, SharedTypes.Proposal>(s.proposals, ihash, id, { proposal with status = #Approved})
              } else {
                ignore Map.put<Int, SharedTypes.Proposal>(s.proposals, ihash, id, { proposal with status = #Rejected})
              }
            }
          };
        };
        ?proposal
      }
    }
  };

  public func getPartialResults(votes: [(Principal, SharedTypes.Vote)]): {approving: Nat; disapproving: Nat; abstentions: Nat} {
    var approving = 0;
    var disapproving = 0;
    var abstentions = 0;
    for ( vote in votes.vals() ) {
      switch( vote.1 ) {
        case ( #Approve) { approving += 1 };
        case ( #Disapprove ) { disapproving +=1 };
        case ( #Abstain ) { abstentions += 1 };
      }
    };
    {approving; disapproving; abstentions}
  };
  
  func checkUploadFile(file: Types.File): Bool {
    var counter = 0;
    for(ch in file.data.vals()) { counter += ch.size() };
    counter == file.size
  };

  func proposalUpdatable(pr: Proposal): Bool {
    // TODO establecer mas reglas para permitir edicion de proposal
    pr.status != (#Approved) and
    pr.status != (#Rejected) and
    pr.votes.size() > 0
  };

  func canVote(s: Types.State, p: Principal) : Bool {
    let role = Member.get_role_member(s, p);
    switch role {
      case (?#Admin or ?#Guardian or ?#Voter) {
        true
      };
      case _ { false}
    }
  };

  func can_give_like(roleMember: ?SharedTypes.MemberRole): Bool { 
    switch roleMember {
      case ( ?#Admin or ?#Guardian ) {
        true
      };
      case _ { false }
    }
  };

  
  /*
  func can_comment_proposal(roleMember: ?SharedTypes.MemberRole): Bool {
    switch roleMember {
      case ( ?#Admin or ?#Guardian ) {
        true
      };
      case _ { false }
    }
  };

  func get_proposal_reaction(reactions: [(Principal, LikeProposal)], prop: Int, p: Principal): ?LikeProposal {
    for(r in reactions.vals()){
      if (r.0 == p) { return ?r.1 }
    };
    return null
  };

  */
  
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
    yes > no and yes > 1; // Nos aseguramos de que no se gane solo con el voto del creador. Revisar esto
  };


  func deployTaonga(s: Types.State, init : TaongaTypes.InitArgs, callback: shared Int -> ()) : async Principal {
    let tempFile = switch (Map.get<Int, Types.File>(s.tempFiles , ihash, init.tempFileId)) {
      case null throw Error.reject("No data found in tempFiles for the given id");
      case (?file) { file };
    };
    let { data; size } = tempFile;

    print("Desplegando Canister Class Taonga...");
    let newTaonga = await (with cycles = s.cyclesForTaongaDeploy) Taonga.Taonga(init, callback); //Nuevo canister class
    let canisterId = Principal.fromActor(newTaonga);

    print("Canister class desplegado en " # debug_show (Principal.fromActor(newTaonga)));
    print("Indexando Canister Class");

    let metadata : SharedTypes.TaongaMetadata = {
      canisterId;
      remoteActorReference = newTaonga;
      name : Text = init.name;
      thumbnail = init.thumbnail;
      history = init.history;
      description = init.description;
      date = now()
    };
    ignore Map.put<Principal, SharedTypes.TaongaMetadata>(s.taongas, phash, canisterId, metadata);
    // Esperar todos los responses juntos
    let responsesUpload = Array.init<async { #Err : Text; #Ok }>(data.size(), async #Err("not yet"));

    // Pruebas en local: El canister se Taonga se despliega sin problemas y acto seguido se envian todos los chunks del archivo GLB simulado
    // sin esperar el retorno de las llamadas. Todos los chunks de 2 MiB - 1 KB son cargados exitosamente. Prueba maxima 250 (aprox 500 MiB) resultado Ok
    var index = 0;
    for (chunk in data.vals()) {
      responsesUpload[index] := newTaonga.uploadTaonga({ chunk; index }); // Probar sin esperar retorno del Taonga para ver si sube mas rapido
      index += 1;
    };
    // index := 0;
    // /// Probar si esto es necesario. Edit: Funciona sin esto en local, si anda bien en mainnet omitir el array responsesUpload tambien
    // for (response in responsesUpload.vals()){
    //     print("Esperando acuse de recibo de chunk numero " # Nat.toText(index) # " subido al Taonga");
    //     let responseAwaited = await response; // El primer chunck deberia ser el que mas demora
    //     switch responseAwaited {
    //         case (#Err(_)) {
    //             print("Reintentando subir chunk numero " # Nat.toText(index));
    //             let retry = await newTaonga.uploadTaonga({chunk = data[index]; index});
    //             switch ( retry ) {
    //                 case (#Err(e)) {throw Error.reject("Error uploading glb file. Taonga Canister sai: " # e)};
    //                 case ( _ ){}
    //             }
    //         };
    //         case (#Ok) { }
    //     };
    //     print("Chunk numero " # Nat.toText(index) # " subido exitosamente");
    //     index += 1;
    // };
    ignore Map.put<Int, Types.File>(s.tempFiles, ihash, init.tempFileId, {owner = canisterId; data; size });
    canisterId;
  };

  func executeProposal(s: Types.State, pr: Proposal, callback: shared Int -> ()): async ProposalExecutionResult {
    switch (pr.kind) {
      case ( #DigitalTaonga(dt)){
        switch (dt) {
          case (#CreateDigitalTaonga(argsCreateTaonga)) {
            let argsDeploy = { 
              argsCreateTaonga with
              admin = pr.creator;
              tempFileId = pr.id;
            };
            let canisterId = await deployTaonga(s, argsDeploy, callback);
            let taongaMetadata = {
              canisterId;
              deployDate =  now();
              readyDate = null;
              name = argsCreateTaonga.name;
            };
            #Ok(#NewTaongaResult(taongaMetadata))
          };
          case (_) {
            // TODO
            #Ok( #Void )
          }
        };
        
      };
      case (#Guardian(args)) {
        switch args {
          case (#AssignRole({member = p; role })) {
            let member = Map.get<Principal, SharedTypes.Member>(s.members, phash, p);
            switch member {
              case null {
                #Err("Member not Found");
              };
              case ( ?member ) {
                ignore Member.set_member_role(s, p,role);
                #Ok(#Guardian({}));
              }
            }
          };
          case (#AssignAsObserver((user, _dedline))) {
            switch (Member.get_member(s, user)) {
              case (#Ok(_)){
                ignore Member.set_member_role(s, user, #Observer );
                #Ok(#Guardian({}));
              };
              case (#Err(e)) {
                #Err("Is Not a Member")
              }
            };       
          };
          case ( #RemoveFromDao((user, _deadline)) ) {
            ignore Map.remove<Principal, SharedTypes.Member>(s.members, phash, user );
            #Ok(#Guardian({}));
          };
          case _ {
            #Ok(#Void);
            //TODO
          }
        };
        // #Ok(#Void)
      };
      case _ {
        // TODO #Action; #Guardian; #Motion;
        #Ok( #Void )
      }
    }
  };


};
