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
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";

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
    title : Text;
    description : Text;
    impact : Text;
    kind : SharedTypes.ProposalType;
    deadline : Int;
    extendedData : SharedTypes.Metadata;
  };

  public type ProposalEditableData = {
    title : Text;
    description : Text;
    kind : ProposalType;
  };

  public type ProposalExecutionResult = {
    #Ok : {
      #Void;
      #NewTaongaResult : {
        canisterId : Principal;
        deployDate : Int;
        readyDate : ?Int;
        name : Text;
        //TODO otros datos
      };
      #UpdatedTaonga : { /*TODO*/ };
      #Action : { /*TODO*/ };
      #Guardian : { /*TODO*/ };
      #Motion : { /*TODO*/ };
    };
    #Err : Text;
  };

  /////////////////////// Public Functions ////////////////////////////

  public func new_proposal(s : Types.State, member : SharedTypes.Member, proposal : NewProposalArgs) : Proposal {
    let id = now();
    var status : SharedTypes.ProposalStatus = #Open;

    // Si el proposal es para crear un Taonga, inicializar un archivo de volcado en el state con el mismo id
    switch (proposal.kind) {
      case (#DigitalTaonga(#CreateDigitalTaonga(args))) {
        let data = Array.init<Blob>(args.chunksQty, "");
        let newFile : Types.File = {
          owner = member.principal;
          data;
          size = args.dataSize;
        };
        ignore Map.put<Int, Types.File>(s.tempFiles, ihash, id, newFile);
        status := #UploadFileRequired;
      };
      case (#DigitalTaonga(#UpdateDigitalTaonga(#UpdateImageURL(_fileUrl)))) {
        var chunksQty = 0;
        var dataSize = 0;
        for ((key, value) in proposal.extendedData.vals()) {
          switch (key) {
            case "chunksQty" {
              switch value {
                case (#Nat(v)) { chunksQty := v };
                case _ {};
              };
            };
            case "size" {
              switch value {
                case (#Nat(v)) { dataSize := v };
                case _ {};
              };
            };
            case _ {};
          };
        };
        let data = Array.init<Blob>(chunksQty, "");
        let newFile : Types.File = {
          owner = member.principal;
          data;
          size = dataSize;
        };
        ignore Map.put<Int, Types.File>(s.tempFiles, ihash, id, newFile);
        status := #UploadFileRequired;
      };
      case _ {};
    };

    let deadline = if (proposal.deadline < id) {
      id + 3 * 24 * 60 * 60 * 1000000000;
    } else {
      proposal.deadline;
    };

    let newProposal : Proposal = {
      proposal with
      id;
      deadline;
      active_members = Array.filter<(Principal, SharedTypes.Member)>(
        Map.toArray<Principal, SharedTypes.Member>(s.members),
        func entrie = entrie.1.role == #Guardian or entrie.1.role == #Admin,
      ).size();
      comments = List.fromArray<SharedTypes.Comment>([]);
      creator = member.principal;
      creatorName = member.name;
      likes = [];
      status;
      partialResults = { approving = 0; disapproving = 0; abstentions = 0 };
      votes = [(member.principal, #Approve)] // Agregamos el voto positivo del creador
    };
    ignore Map.put<Int, Proposal>(s.proposals, ihash, id, newProposal);

    newProposal;
  };

  public func checkFileIntegrity(s : Types.State, fileId : Int) : Bool {
    switch (Map.get<Int, Types.File>(s.tempFiles, ihash, fileId)) {
      case null { false };
      case (?file) {
        var byteCounter = 0;
        for (chunk in file.data.vals()) {
          byteCounter += chunk.size();
          print(debug_show (byteCounter));
        };
        return file.size == byteCounter;
      };
    };
  };

  public func addChunk({
    s : Types.State;
    caller : Principal;
    fileId : Int;
    chunk : Blob;
    index : Nat;
    retry : Bool;
  }) : { #Ok; #Err } {
    switch (Map.get<Int, Types.File>(s.tempFiles, ihash, fileId)) {
      case null { #Err };
      case (?file) {
        if (caller == file.owner) {
          file.data[index] := chunk;

          if (retry or index + 1 == file.data.size()) {
            // Verificamos la completitud cuando se recibe el ultimo chunk o cuando se manda un chunk en un reintento
            let complet = checkUploadFile(file);
            print("checkUploadFile -> " # debug_show (complet));
            if complet {
              switch (Map.get<Int, Proposal>(s.proposals, ihash, fileId)) {
                case null {};
                case (?proposal) {
                  ignore Map.put<Int, Proposal>(s.proposals, ihash, fileId, { proposal with status = #Open });
                };
              };

              return #Ok;
            } else {
              return #Err;
            };
          };
          //------------
          #Ok;
        } else {
          #Err;
        };
      };
    };
  };

  public func get_proposal(s : Types.State, id : Int) : ?Proposal {
    switch (Map.get<Int, Proposal>(s.proposals, ihash, id)) {
      case null null;
      case (?proposal) {
        let partialResults = getPartialResults(proposal.votes);
        ?{ proposal with partialResults };
      };
    };
  };

  /// Eliminar esto e incluir creatorName directamente en ProposalPublicData en la proxima migración
  // public type ExtendedProposalPublicData = ProposalPublicData and {creatorName: Text};

  public func get_all_proposals(s : Types.State) : [ProposalPublicData] {
    Iter.toArray(Map.vals<Int, Proposal>(s.proposals));
  };

  public func edit_proposal(s : Types.State, caller : Principal, id : Int, data : ProposalEditableData) : ?Proposal {
    switch (Map.get<Principal, SharedTypes.Member>(s.members, phash, caller)) {
      case (?_) {
        //Si un proposal fue hecho por un miembro que ya no es miembro, no lo podrá editar
        switch (Map.get<Int, Proposal>(s.proposals, ihash, id)) {
          case (?proposal) {
            if (proposal.creator != caller) {
              return null;
            };
            if (not proposalUpdatable(proposal)) {
              return null;
            };
            let { title; description; kind } = data;
            let updatedProposal : Proposal = {
              proposal with title;
              description;
              kind;
            };
            ignore Map.put<Int, Proposal>(s.proposals, ihash, id, updatedProposal);
            ?updatedProposal;
          };
          case null null;
        };
      };
      case null null;
    };
  };

  public func delete_proposal(s : Types.State, caller : Principal, id : Int) : ?Proposal {
    switch (Map.remove<Int, Proposal>(s.proposals, ihash, id)) {
      case null null;
      case (?proposal) {
        if (proposal.creator == caller and proposalUpdatable(proposal)) {
          return ?proposal;
        } else {
          ignore Map.put<Int, Proposal>(s.proposals, ihash, id, proposal);
          return null;
        };
      };
    };
  };

  public func vote_proposal(s : Types.State, caller : Principal, id : Int, vote : SharedTypes.Vote) : ?ProposalPublicData {
    switch (Map.get<Int, Proposal>(s.proposals, ihash, id)) {
      case null { null };
      case (?proposal) {
        if (canVote(s, caller)) {
          for (vote in proposal.votes.vals()) {
            if (vote.0 == caller) {
              // Si ya voto retornamos el proposal sin hacer nada
              return ?proposal;
            };
          };
          let votes = Array.tabulate<(Principal, SharedTypes.Vote)>(
            proposal.votes.size() + 1,
            func i = if (i < proposal.votes.size()) { proposal.votes[i] } else ((caller, vote)),
          );
          let partialResults = getPartialResults(votes);
          ignore Map.put<Int, Proposal>(s.proposals, ihash, id, { proposal with votes; partialResults });
          ?{ proposal with partialResults };
        } else {
          null;
        };
      };
    };
  };

  public func like_proposal(s : Types.State, caller : Principal, id : Int, like : ?LikeProposal) : ?Proposal {

    // if(not can_give_like(Member.get_role_member(s, caller))) {
    //   return null
    // };

    switch (get_proposal(s, id)) {
      case null { return null };
      case (?ppsl) {
        let filteredArray = Array.filter<(Principal, LikeProposal)>(ppsl.likes, func l = l.0 != caller);
        let updateLikes = switch like {
          case null {
            // When the like is null and the member had previously given a Like, the like is removed.
            filteredArray;
          };
          case (?_like) {
            Array.tabulate<(Principal, LikeProposal)>(
              filteredArray.size() + 1,
              func i = if (i == 0) { (caller, _like) } else {
                filteredArray[i - 1];
              },
            );
          };
        };
        let updatedProposal = { ppsl with likes = updateLikes };
        ignore Map.put<Int, Proposal>(s.proposals, ihash, id, updatedProposal);
        ?updatedProposal;
      };
    };
  };

  public func refresh_proposal_status(s : Types.State, id : Int, callback : shared Int -> ()) : async ?Proposal {
    switch (Map.get<Int, Proposal>(s.proposals, ihash, id)) {
      case null { null };
      case (?proposal) {
        var status = proposal.status;
        if (proposal.status == #Open) {
          // Si se superó el plazo se evalúa la votación para ver si puede ser ejecutada.
          if (now() > proposal.deadline) {
            if (didProposalPass(proposal)) {
              let resultProposalExecution = await executeProposal(s, proposal, callback);
              status := #Approved;
              print("resultProposalExecution ----> " # debug_show (resultProposalExecution));
              ignore Map.put<Int, SharedTypes.Proposal>(s.proposals, ihash, id, { proposal with status });
            } else {
              status := #Rejected;
              ignore Map.put<Int, SharedTypes.Proposal>(s.proposals, ihash, id, { proposal with status });
            };
            ignore Map.remove<Int, Types.File>(s.tempFiles, ihash, id);
          };
        };
        ?{proposal with status};
      };
    };
  };

  public func getPartialResults(votes : [(Principal, SharedTypes.Vote)]) : {
    approving : Nat;
    disapproving : Nat;
    abstentions : Nat;
  } {
    var approving = 0;
    var disapproving = 0;
    var abstentions = 0;
    for (vote in votes.vals()) {
      switch (vote.1) {
        case (#Approve) { approving += 1 };
        case (#Disapprove) { disapproving += 1 };
        case (#Abstain) { abstentions += 1 };
      };
    };
    { approving; disapproving; abstentions };
  };

  func checkUploadFile(file : Types.File) : Bool {
    var counter = 0;
    for (ch in file.data.vals()) { counter += ch.size() };
    counter == file.size;
  };

  func proposalUpdatable(pr : Proposal) : Bool {
    // TODO establecer mas reglas para permitir edicion de proposal
    pr.status != (#Approved) and pr.status != (#Rejected) and pr.votes.size() > 0
  };

  func canVote(s : Types.State, p : Principal) : Bool {
    let role = Member.get_role_member(s, p);
    switch role {
      case (?#Admin or ?#Guardian or ?#Voter) {
        true;
      };
      case _ { false };
    };
  };

  func _can_give_like(roleMember : ?SharedTypes.MemberRole) : Bool {
    switch roleMember {
      case (?#Admin or ?#Guardian) {
        true;
      };
      case _ { false };
    };
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

  func didProposalPass(pr : Proposal) : Bool {
    var yes = 0;
    var no = 0;
    for ((_, v) in pr.votes.vals()) {
      switch v {
        case (#Approve) { yes += 1 };
        case (#Disapprove) { no += 1 };
        case _ {};
      };
    };
    let votes = pr.votes.size();
    let activeMembers = pr.active_members;
    let participation = (votes * 100) / activeMembers; //
    let quorum = participation >= 20; // TODO: Reemplazar el '20' por una variable 'minQuorumPercentage' una vez que esté disponible y pueda ser seteable.
    quorum and yes > no;
  };

  func uploadFile(chunks : [{ index : Nat; chunk : Blob }], remoteActorReference : Taonga.Taonga) : async [Nat] {
    let responsesUpload = Array.init<(Nat, async { #Err : Text; #Ok })>(chunks.size(), (0, async #Err("not yet")));
    let bufferFailleds = Buffer.fromArray<Nat>([]);
    var i = 0;
    for ({ chunk; index } in chunks.vals()) {
      responsesUpload[i] := (index, remoteActorReference.uploadTaonga({ chunk; index }));
      i += 1;
    };
    for (response in responsesUpload.vals()) {
      let resolved = await response.1;
      switch resolved {
        case (#Err(e)) {
          print(debug_show (resolved) # e);
          bufferFailleds.add(response.0);
        };
        case (_) {};
      };
    };
    Buffer.toArray<Nat>(bufferFailleds);
  };

  func deployTaonga(s : Types.State, init : TaongaTypes.InitArgs, callback : shared Int -> ()) : async Principal {
    let tempFile = switch (Map.remove<Int, Types.File>(s.tempFiles, ihash, init.tempFileId)) {
      case null throw Error.reject("No data found in tempFiles for the given id");
      case (?file) { file };
    };
    let { data; size } = tempFile;

    print("Desplegando Canister Class Taonga...");
    // TODO. Prevenir futuras actualizaciones de "cycles ammount" para deploy de canister class
    // let newTaonga = await (with cycles = s.cyclesForTaongaDeploy) Taonga.Taonga(init, callback); //Nuevo canister class
    let newTaonga = await (with cycles = 2_000_000_000_000) Taonga.Taonga(init, callback); //TODO cambiar por la linea de arriba luego de upgrade mencionado mas arriba
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
      date = now();
      authorizedDownloaders: [Principal] = [];
    };
    ignore Map.put<Principal, SharedTypes.TaongaMetadata>(s.taongas, phash, canisterId, metadata);

    var chunkIndexesToRetry = await uploadFile(
      Array.tabulate<{ index : Nat; chunk : Blob }>(data.size(), func x = { index = x; chunk = data[x] }),
      newTaonga,
    );

    while (chunkIndexesToRetry.size() > 0) {
      print("Retry upload " # debug_show (chunkIndexesToRetry.size()) # " chunks");
      chunkIndexesToRetry := await uploadFile(
        Array.tabulate<{ index : Nat; chunk : Blob }>(
          chunkIndexesToRetry.size(),
          func x = {
            index = chunkIndexesToRetry[x];
            chunk = data[chunkIndexesToRetry[x]];
          },
        ),
        newTaonga,
      );
    };

    ignore Map.put<Int, Types.File>(s.tempFiles, ihash, init.tempFileId, { owner = canisterId; data; size });
    canisterId;
  };

  func executeProposal(s : Types.State, pr : Proposal, callback : shared Int -> ()) : async ProposalExecutionResult {
    switch (pr.kind) {
      case (#DigitalTaonga(dt)) {
        switch (dt) {
          case (#CreateDigitalTaonga(argsCreateTaonga)) {
            if (not checkFileIntegrity(s, pr.id)) {

            };
            let argsDeploy = {
              argsCreateTaonga with
              admin = pr.creator;
              tempFileId = pr.id;
            };
            let canisterId = await deployTaonga(s, argsDeploy, callback);
            let taongaMetadata = {
              canisterId;
              deployDate = now();
              readyDate = null;
              name = argsCreateTaonga.name;
            };
            #Ok(#NewTaongaResult(taongaMetadata));
          };
          case (#DeleteDigitalTaonga(id)) {
            /// TODO eliminar el canister class también
            ignore Map.remove<Principal, SharedTypes.TaongaMetadata>(s.taongas, phash, id);
            #Ok(#Void)

          };
          case (#UpdateDigitalTaonga(#UpdateImageURL(taongaId))) {
            let taongaMetadata = Map.get<Principal, SharedTypes.TaongaMetadata>(s.taongas, phash, Principal.fromText(taongaId));
            switch (taongaMetadata) {
              case (?metadata) {
                var thumbnail : Blob = "";
                var chunksQty = 0;
                for ((key, value) in pr.extendedData.vals()) {
                  switch key {
                    case ("chunksQty") {
                      switch value {
                        case (#Nat(v)) { chunksQty := v };
                        case _ {};
                      };
                    };
                    case "thumbnail" {
                      switch value {
                        case (#Blob(v)) { thumbnail := v };
                        case _ {};
                      };
                    };
                    case _ {};
                  };
                };
                let taongaActor = metadata.remoteActorReference;
                let file = Map.get<Int, Types.File>(s.tempFiles, ihash, pr.id);
                switch file {
                  case (?file) {
                    var request = await taongaActor.updateFileRequest({
                      thumbnail;
                      chunksQty;
                    });
                    var retry = 0;
                    while (request != #Ok and retry < 5) {
                      print("Retry request upload file # " # debug_show (retry));
                      request := await taongaActor.updateFileRequest({
                        thumbnail;
                        chunksQty;
                      });
                      retry += 1;
                    };
                    if (request != #Ok) {
                      return #Err("Intercanister comunication failled");
                    };

                    var chunkIndexesToRetry = await uploadFile(
                      Array.tabulate<{ index : Nat; chunk : Blob }>(file.data.size(), func x = { index = x; chunk = file.data[x] }),
                      taongaActor,
                    );

                    while (chunkIndexesToRetry.size() > 0) {
                      print("Retry upload " # debug_show (chunkIndexesToRetry.size()) # " chunks");
                      chunkIndexesToRetry := await uploadFile(
                        Array.tabulate<{ index : Nat; chunk : Blob }>(
                          chunkIndexesToRetry.size(),
                          func x = {
                            index = chunkIndexesToRetry[x];
                            chunk = file.data[chunkIndexesToRetry[x]];
                          },
                        ),
                        taongaActor,
                      );
                    };
                    ignore Map.put<Principal, SharedTypes.TaongaMetadata>(
                      s.taongas,
                      phash,
                      Principal.fromText(taongaId),
                      { metadata with thumbnail },
                    );
                  };
                  case null { return #Err("Temp file not found") };
                };

              };
              case null { return #Err("Taonga not found") }

            };

            #Ok(#Void);
          };
          case (#UpdateDigitalTaonga(#UpdateDescription(taongaId))) {

            let taongaMetadata = Map.get<Principal, SharedTypes.TaongaMetadata>(s.taongas, phash, Principal.fromText(taongaId));
            switch taongaMetadata {
              case (?data) {
                let response = await data.remoteActorReference.updateDescription(pr.description);
                if (response == #Ok) {
                  ignore Map.put<Principal, SharedTypes.TaongaMetadata>(
                    s.taongas,
                    phash,
                    Principal.fromText(taongaId),
                    { data with description = pr.description },
                  );
                };
              };
              case null {};
            };

            #Ok(#Void);
          };
          case (#RequestDownloadPermision(taongaId)) {
            let taongaMetadata = Map.get<Principal, SharedTypes.TaongaMetadata>(s.taongas, phash, taongaId);
            switch taongaMetadata {
              case null { };
              case ( ?taongaMetadata ) {
                let currentAuthorizedDownloaders = taongaMetadata.authorizedDownloaders;
                let authorizedDownloaders = Array.tabulate<Principal>(
                  currentAuthorizedDownloaders.size() + 1,
                  func i = if(i == 0) {pr.creator} else {currentAuthorizedDownloaders[i + 1]}  
                );
                ignore Map.put<Principal, SharedTypes.TaongaMetadata>(
                  s.taongas, 
                  phash,
                  taongaId,
                  {taongaMetadata with authorizedDownloaders} 
                )
              }
            };
            #Ok(#Void);
          };
        };

      };
      case (#Guardian(args)) {
        switch args {
          case (#AssignRole({ member = p; role })) {
            let member = Map.get<Principal, SharedTypes.Member>(s.members, phash, p);
            switch member {
              case null {
                #Err("Member not Found");
              };
              case (?member) {
                ignore Member.set_member_role(s, p, role);
                #Ok(#Guardian({}));
              };
            };
          };
          case (#AssignAsObserver((user, _dedline))) {
            switch (Member.get_member(s, user)) {
              case (#Ok(_)) {
                ignore Member.set_member_role(s, user, #Observer);
                #Ok(#Guardian({}));
              };
              case (#Err(_e)) {
                #Err("Is Not a Member");
              };
            };
          };
          case (#RemoveFromDao((user, _deadline))) {
            ignore Map.remove<Principal, SharedTypes.Member>(s.members, phash, user);
            #Ok(#Guardian({}));
          };
        };
        // #Ok(#Void)
      };
      case _ {
        // TODO #Action; #Guardian; #Motion;
        #Ok(#Void);
      };
    };
  };

};
