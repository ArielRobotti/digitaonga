import Types "./types";
import SharedTypes "./sharedTypes";
import Member "./member";
import Proposal "./proposal";
import Comment "./commentsManager";
// import Error "mo:base/Error";
import Map "mo:map/Map";
import { ihash; phash } "mo:map/Map";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import { print } "mo:base/Debug";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import { now } "mo:base/Time";
import List "mo:base/List";
import Error "mo:base/Error";
import ManagerCanister "./interfaces/ic-management-interface";


persistent actor {

  let cyclesForTaongaDeploy = 1_000_000_000_000; // Cyclos necesarios para desplegar un canister class Taonga... probar cuantos se requieren en mainnet
  var limit_payload_per_call = 1024 * 1024 * 2; // Carga maxima en Bytes para llamadas query "MiB"
  
  let state: Types.State = Types.initState({cyclesForTaongaDeploy});

  // Registro de eventos y cambios DAO


  public query func time(): async Int {
    now()
  };

  var updatingProposals: Bool = false;


  ///// Admin functions /////////////

  public shared ({ caller }) func addControllerToTaongasCanisterClass(p: Principal): async [Principal]{
    assert (Member.is_admin(state, caller));
    let canistersId = Iter.toArray(Map.keys<Principal, SharedTypes.TaongaMetadata>(state.taongas));
    for (tcanisterId in canistersId.vals()) {
      await ManagerCanister.addController(tcanisterId, p)
    };
    canistersId
  };
  public shared ({ caller }) func addControllerTo(p: Principal, canister: Principal): async [Principal]{
    assert (Member.is_admin(state, caller));
    await ManagerCanister.addController(canister, p);
    [canister]
  };

  public shared func isUpdating(): async Bool {
    updatingProposals
  };

  public shared ({ caller }) func killUpdating(): async (){
    assert(Member.is_admin(state, caller));
    updatingProposals := false
  };

  ///////// Comentar luego de migración /////////
  // public shared ({ caller }) func pushMembers(members: [SharedTypes.Member]): async (){
  //   assert(Member.is_admin(state, caller));
  //   for(member in members.vals()) {
  //     ignore Map.put<Principal, SharedTypes.Member>(
  //       state.members, 
  //       phash, 
  //       member.principal, 
  //       member)
  //   }
  // };

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

  ////////////////////////// Member functions CRUD and roles managment ////////////////////////////////

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
    // TODO. Regla: los admin pueden otorgar roles solo cuando no hay la cantidad suficiente de guardians en la DAO
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
    let member = Member.get_member(state, caller);
    switch member {
      case (#Err(e)) { throw Error.reject("Member not found or invalid: " # debug_show(e)); };
      case (#Ok(member)) {
        assert(member.role == #Admin or member.role== #Guardian);
        let proposal = Proposal.new_proposal(state, member, args);
        switch (args.kind) {
          case (#DigitalTaonga(#DeleteDigitalTaonga(_id))) {
            
          };
          case _ {}
        };
        proposal
      }
    }
  };

  public shared ({ caller }) func uploadFileChunk({fileId: Int; chunk: Blob; index: Nat; retry: Bool}): async {#Ok; #Err}{
    Proposal.addChunk({
      s = state;
      caller;
      fileId;
      chunk;
      index;
      retry;
    })
  };

  type ProposalResponse = {
    #Ok: {
      proposal: SharedTypes.Proposal;
      callerVote: ?SharedTypes.Vote;
    };
    #Err: Text;
  };

  public query ({ caller}) func get_proposal(id: Int): async ProposalResponse { // En ProposalPublicData se omiten los votos y el creador
    // assert(not Principal.isAnonymous(caller));
    let proposalOpt = Proposal.get_proposal(state, id);
    switch proposalOpt {
      case null { 
        #Err("Proposal not found")
      };
      case (?proposal) {
        let callerVote = getMemberVote(proposal.votes, caller);
        #Ok({ callerVote; proposal});
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
  
  public query func get_all_proposals() : async [SharedTypes.ProposalPublicData] {
    Proposal.get_all_proposals(state);
  };
  
  public shared ({ caller }) func vote_proposal(id : Int, vote : SharedTypes.Vote) : async ?SharedTypes.ProposalPublicData {
    assert(not Principal.isAnonymous(caller));
    Proposal.vote_proposal(state, caller, id, vote)
  };

  func getMemberVote(votes: [(Principal, SharedTypes.Vote)], p: Principal): ?SharedTypes.Vote {
    for (vote in votes.vals()){
          if(vote.0 == p) {
            return ?vote.1
          }
        };
        null
  };

  public shared query ({ caller }) func get_my_vote(id: Nat): async ?SharedTypes.Vote{
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

  public shared query ({ caller }) func get_incomplete_entries(): async [SharedTypes.ProposalPublicData]{
    assert(Member.is_admin(state, caller));
    let proposalArray = Iter.toArray(Map.vals<Int, SharedTypes.Proposal>(state.proposals));
    Array.filter<SharedTypes.Proposal>(proposalArray, func p = p.status == #UploadFileRequired)
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
      print("actualizanedo proposal: " # debug_show(id));
      try {
        ignore await Proposal.refresh_proposal_status(
          state,
          id,
          callbackRemoveTempFile
        )
      } catch(_) {
        print("Error on refresh proposal: " # debug_show(id));
        updatingProposals := false;
      }
    };
    updatingProposals := false;
    
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

  public shared ({ caller }) func like_proposal(id : Nat, like : SharedTypes.LikeProposal) : async ?SharedTypes.Proposal{
    assert(not Principal.isAnonymous(caller));
    Proposal.like_proposal(state, caller, id, ?like)
  };


  ////////////////   En la proxima migracion incluir la lista de comments en cada proposal...  /////////////////////////////////////



  public type CommentList = List.List<Comment.Comment>;

  let comments = Map.new<Int, CommentList>();

  func canComment(p: Principal): Bool {
    switch (Member.get_role_member(state, p)) {
      case ( ?#Admin or ?#Guardian or ?#Observer) { return true };
      case _ false;
    }
  };

  public shared ({ caller }) func new_comment_proposal({proposalId : Int; msg : Text; path: [Int]}) : async CommentList {
    switch(Proposal.get_proposal(state, proposalId)) {
      case null { return null };
      case (?proposal) {
        if (not canComment(caller)){
          return proposal.comments;
        };
        // var currentList = switch (Map.get<Int, CommentList>(comments, ihash, proposalId)) {
        //   case null { List.nil<Comment.Comment>() };
        //   case ( ?list ) { list }
        // };
        var comments = proposal.comments;

        let newComment: Comment.Comment = {
          msg;
          creator = caller;
          created_at = now();
          likes = [];
          dislikes = [];
          subComments = List.nil<Comment.Comment>()
        };

        comments := Comment.push(comments, newComment, path);
        ignore Map.put<Int, SharedTypes.Proposal>(state.proposals, ihash, proposalId, { proposal with comments});

        // ignore Map.put<Int, CommentList>(comments, ihash, proposalId, currentList);
        comments;
      }
    } 
  };

  // public shared ({ caller }) func new_comment_proposal({proposalId : Int; msg : Text; path: [Int]}): async CommentList {
  //   switch(Proposal.get_proposal(state, proposalId)) {
  //     case null null;
  //     case ( ?proposal ){
  //       if (canComment(caller)){ 

  //       } else {
  //         return proposal.comments
  //       }
        
  //     }
  //   }
  // };

  public query func loadComments( id: Int ): async CommentList {
    switch(Map.get<Int, CommentList>(comments, ihash, id)){
      case null { null };
      case ( ?list ) { list }
    }
  };

  //////////////////////////////////////////////////////////////////

 public shared ({ caller })func callbackRemoveTempFile(tempFileId : Int) : () {
    let recoveredBytes = switch (Map.get<Int, Types.File>(state.tempFiles, ihash, tempFileId)) {
      case null {0};
      case (?file) {
        if(file.owner == caller){
          ignore Map.remove<Int, Types.File>(state.tempFiles, ihash, tempFileId);
          file.data.size() * (file.data[0].size() -1: Nat ) + file.data[file.data.size() - 1: Nat].size()
        } else {
          0
        }
        
      };
    };
    print(Nat.toText(recoveredBytes ) # " Bytes temporary file successfully deleted");
  };
  
}