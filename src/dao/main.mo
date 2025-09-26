import Types "./types";
import SharedTypes "./sharedTypes";
import Member "./member";
import Proposal "./proposal";
// import Error "mo:base/Error";
import Map "mo:map/Map";
import { ihash; phash } "mo:map/Map";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import { print } "mo:base/Debug";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import { now } "mo:base/Time";


persistent actor {

  let cyclesForTaongaDeploy = 1_000_000_000_000; // Cyclos necesarios para desplegar un canister class Taonga... probar cuantos se requieren en mainnet
  var limit_payload_per_call = 1024 * 1024 * 2; // Carga maxima en Bytes para llamadas query "MiB"
  
  let state: Types.State = Types.initState({cyclesForTaongaDeploy});

  public query func time(): async Int {
    now()
  };

  transient var updatingProposals: Bool = false;

  //////////// Clean functions ////////////
  public shared ({ caller }) func removeFailedProposals(id: Int): async {#Ok; #Err}{
    assert(Principal.isController(caller));
    switch(Map.get<Int, SharedTypes.Proposal>(state.proposals, ihash, id)){
      case null { #Err };
      case ( ?proposal ) {
        switch (proposal.status) {
          case (#UploadFileRequired) {
            ignore Map.remove<Int, SharedTypes.Proposal>(state.proposals, ihash, id);
            #Ok
          };
          case _ { #Err }
        }
      }
    }
  };

     
  ////////////////////// Migracion de funciones existentes /////////
  //////////////////////////////// Done ////////////////////////////

  public shared ({ caller }) func create_member() : async SharedTypes.Member {
    assert(not Principal.isAnonymous(caller));
    // Revisar logica de creacion de Miembros y asignacion de roles
    // Actualmente por efecto de esta funcion el primero que se registra es admin y el resto viewer
    Member.create_member(state, caller)
    // actualizar last_activity
  };

  public shared ({ caller }) func logIn(): async ?SharedTypes.Member {
    ignore refresh_all_proposals();
    switch (await get_member(caller)){
      case (#Ok(member)){
        ?member
      };
      case _ { null }
    };
  };

  public shared ({ caller }) func set_last_activity_member(): async (){
    switch (Member.get_member(state, caller)){
      case ( #Ok(member) ){
        ignore Map.put<Principal, SharedTypes.Member>(
          state.members,
          phash,
          caller,
          {member with last_activity = now()}
        )
      };
      case _ {}
    };
    ignore refresh_all_proposals()
  };

  public shared ({ caller }) func edit_member({name; profile_pic; cover_img }: SharedTypes.MemberEditableData) : async Member.Result {
    assert(not Principal.isAnonymous(caller));
    Member.edit_member(state, caller, {name; profile_pic; cover_img})
  };

  public shared ({ caller }) func batch_update_member_role(principals : [Principal], role : SharedTypes.MemberRole) : async [(Principal, SharedTypes.MemberError)] {
    assert(Member.is_admin(state, caller));
    print(debug_show(caller));
    //TODO. Regla: los admin pueden otorgar roles solo cuando no hay la cantidad suficiente de guardians en la DAO
    // En caso de que haya la cantidad de guardians requerida, generar una proposal (Nueva variante #Guardian{#BatchUpdateRoles})
    Member.batch_update_member_role(state, principals, role);
    // TODO. Registrar Fecha, Cambio y autor del autor del cambio?
  };

  // Revisar politicas de acceso a esta informacion
  public query func get_active_members() : async [SharedTypes.Member] { // Peligro de desbordamiento de response sobre los 2 MiB
    Member.get_active_members(state)
  };
  // Quienes tienen acceso a estos datos?
  public query func get_all_members() : async [SharedTypes.Member] {  // Peligro de desbordamiento de response sobre los 2 MiB
    Member.get_all_members(state)
  };


  public query func get_member(p : Principal) : async Member.Result {
    Member.get_member(state, p)
  };

  ///////////////////////////// CRUD Proposals ///////////

  public shared ({ caller }) func create_proposal(args: Proposal.NewProposalArgs) : async SharedTypes.Proposal {
    print("Proposal request from " # debug_show(caller));
    assert(not Principal.isAnonymous(caller));
    let callerRole = Member.get_role_member(state, caller);
    assert(callerRole == ?#Admin or callerRole == ?#Guardian); //
    Proposal.new_proposal(state, caller, args)
  };

  public shared ({ caller }) func uploadFileChunk({fileId: Int; chunk: Blob; index: Nat; retry: Bool}): async {#Ok; #Err}{
    print("recibiendo chunk nro: " # debug_show(index));
    assert(not Principal.isAnonymous(caller));
    Proposal.addChunk({
      s = state;
      caller;
      fileId;
      chunk;
      index;
      retry;
    })
  };

  public query ({ caller}) func get_proposal(id: Int): async ?SharedTypes.Proposal { // En ProposalPublicData se omiten los votos y el creador
    // assert(not Principal.isAnonymous(caller));
    let proposal = Proposal.get_proposal(state, id);
    switch proposal {
      case null { null};
      case (?proposal) {
        let partialResults = Proposal.getPartialResults(proposal.votes);
        ?{ proposal with votes = []; partialResults }
      }
    }
  };

  public shared ({ caller }) func edit_proposal(id : Int, data: Proposal.ProposalEditableData) : async ?SharedTypes.ProposalPublicData {
    assert(not Principal.isAnonymous(caller));
    Proposal.edit_proposal(state, caller, id, data);
  };

  public shared ({ caller }) func delete_proposal(id: Int): async ?SharedTypes.Proposal {
    assert(not Principal.isAnonymous(caller));
    Proposal.delete_proposal(state, caller, id);
  };
  
  public query func get_all_proposals() : async [Proposal.ExtendedProposalPublicData] {
    Proposal.get_all_proposals(state);
  };
  
  public shared ({ caller }) func vote_proposal(id : Int, vote : SharedTypes.Vote) : async ?SharedTypes.ProposalPublicData {
    assert(not Principal.isAnonymous(caller));
    Proposal.vote_proposal(state, caller, id, vote)
  };

  public shared ({ caller }) func get_my_vote(id: Nat): async ?SharedTypes.Vote{
    switch (Proposal.get_proposal(state, id)){
      case null null;
      case ( ?proposal ) {
        for (vote in proposal.votes.vals()){
          if(vote.0 == caller) {
            return ?vote.1
          }
        };
        null
      }
    }
  };

  public shared query ({ caller }) func get_my_proposals(): async [SharedTypes.ProposalPublicData]{
    let all_proposals = Iter.toArray(Map.vals(state.proposals));
    Array.filter<SharedTypes.Proposal>(all_proposals, func p = p.creator == caller)
  };

  // get_proposals_by_member : shared query Principal -> async [Proposal];
  public query func get_proposals_by_member(principal : Principal) : async [SharedTypes.ProposalPublicData] {
    let all_proposals = Iter.toArray(Map.vals(state.proposals));
    Array.filter<SharedTypes.Proposal>(all_proposals, func p = p.creator == principal)
  };

  public query func get_all_taongas(): async [(Principal, SharedTypes.TaongaMetadata)]{
    Map.toArray<Principal, SharedTypes.TaongaMetadata>(state.taongas);
  };

  // check_proposal_status : shared Nat -> async Result_2;
  public query func check_proposal_status(id : Int) : async  ?SharedTypes.ProposalStatus {
    switch (Proposal.get_proposal(state, id)) {
      case null { null };
      case ( ?proposal ) {
        ?proposal.status
      }
    }
  };

  public func refresh_all_proposals(): async () {
    if updatingProposals return;
    updatingProposals := true;
    let proposalsId: [Int] = Array.map<SharedTypes.ProposalPublicData, Int>(
      Proposal.get_all_proposals(state),
      func p = p.id
    );
    for(id in proposalsId.vals()){
      ignore await Proposal.refresh_proposal_status(
        state,
        id,
        callbackRemoveTempFile
      )
    };
    updatingProposals := false
  };

  public query ({ caller })  func has_voted(id : Int) : async Bool {
    let votes = switch (Map.get<Int, SharedTypes.Proposal>(state.proposals, ihash, id)) {
      case null { [] };
      case ( ?p ) { p.votes }
    };
    for(v in votes.vals()){
      if (v.0 == caller) { return true }
    };
    return false
  };

  // like_proposal : shared (Nat, LikeProposal) -> async ();
  type ProposalPublicDataExtended = SharedTypes.ProposalPublicData and {creatorName: Text};

  public shared ({ caller }) func like_proposal(id : Nat, like : SharedTypes.LikeProposal) : async ?ProposalPublicDataExtended{
    assert(not Principal.isAnonymous(caller));
    switch (Proposal.like_proposal(state, caller, id, ?like)) {
      case null null;
      case (?proposal) {
        ?{proposal with creatorName = Member.get_member_name(state, proposal.creator)}
      }
    }
  };

  // new_comment_proposal : shared (Nat, Text) -> async ();
  // public shared ({ caller }) func new_comment_proposal(id : Nat, comment : Text) : async () {

  // };


  //////////////////////////////////////////////////////////////////

  public shared ({ caller })func callbackRemoveTempFile(tempFileId : Int) : () {
    let recoveredBytes = switch (Map.get<Int, Types.File>(state.tempFiles, ihash, tempFileId)) {
      case null {0};
      case (?file) {
        if(file.owner == caller){
          ignore Map.remove<Int, Types.File>(state.tempFiles, ihash, tempFileId);
          file.data.size() 
        } else {
          0
        }
        
      };
    };
    print(Nat.toText(recoveredBytes * limit_payload_per_call - 1024) # " Bytes temporary file successfully deleted");
  };
  
}