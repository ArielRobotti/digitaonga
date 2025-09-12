import Types "./types";
import SharedTypes "./sharedTypes";
import Member "./member";
import Proposal "./proposal";
import Error "mo:base/Error";
import Map "mo:map/Map";
import { ihash } "mo:map/Map";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import { print } "mo:base/Debug";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";


persistent actor {

  let cyclesForTaongaDeploy = 1_000_000_000_000; // Cyclos necesarios para desplegar un canister class Taonga... probar cuantos se requieren en mainnet
  var limit_payload_per_call = 1024 * 1024 * 2; // Carga maxima en Bytes para llamadas query "MiB"
  
  let state: Types.State = Types.initState({cyclesForTaongaDeploy});


     
  ////////////////////// Migracion de funciones existentes /////////
  //////////////////////////////// Done ////////////////////////////

  public shared ({ caller }) func create_member() : async SharedTypes.Member {
    assert(not Principal.isAnonymous(caller));
    // Revisar logica de creacion de Miembros y asignacion de roles
    // Actualmente por efecto de esta funcion el primero que se registra es admin y el resto viewer
    Member.create_member(state, caller)
    // actualizar last_activity
  };

  public shared ({ caller }) func edit_member({name; profile_pic; cover_img }: SharedTypes.MemberEditableData) : async Member.Result {
    assert(not Principal.isAnonymous(caller));
    Member.edit_member(state, caller, {name; profile_pic; cover_img})
  };

  public shared ({ caller }) func batch_update_member_role(principals : [Principal], role : SharedTypes.MemberRole) : async [(Principal, SharedTypes.MemberError)] {
    assert(Member.is_admin(state, caller));
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

  // TODO Verificar quien puede leer estos datos.. en este momento son públicos
  /*
    principal;
    liked_proposals : [(Nat, LikeProposal)];
    name 
    role
    created_at 
    last_activity 
    cover_img 
    profile_pic
  */
  public query func get_member(p : Principal) : async Member.Result {
    Member.get_member(state, p)
  };

  ///////////////////////////// CRUD Proposals ///////////

  public shared ({ caller }) func create_proposal(args: Proposal.NewProposalArgs) : async SharedTypes.Proposal {
    assert(not Principal.isAnonymous(caller));
    let callerRole = Member.get_role_member(state, caller);
    assert(callerRole == ?#Admin or callerRole == ?#Guardian); //
    Proposal.new_proposal(state, caller, args)
  };

  public shared ({ caller }) func uploadFileChunk({fileId: Int; chunk: Blob; index: Nat; retry: Bool}): async {#Ok; #Err}{
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
  
  // get_proposal : shared query Nat -> async ?Proposal;
  public query func get_proposal(id: Int): async ?SharedTypes.ProposalPublicData { // En ProposalPublicData se omiten los votos y el creador
    Proposal.get_proposal(state, id);
  };

  // edit_proposal : shared (Nat, Text, Text, ProposalType) -> async ?Proposal; // Cambio de firma (id: Int; data: ProposalEditableData)
  public shared ({ caller }) func edit_proposal(id : Int, data: Proposal.ProposalEditableData) : async ?SharedTypes.Proposal {
    assert(not Principal.isAnonymous(caller));
    Proposal.edit_proposal(state, caller, id, data);
  };

  public shared ({ caller }) func delete_proposal(id: Int): async ?SharedTypes.Proposal {
    assert(not Principal.isAnonymous(caller));
    Proposal.delete_proposal(state, caller, id);
  };
  
  // get_all_proposals : shared query () -> async [Proposal];
  public query func get_all_proposals() : async [SharedTypes.ProposalPublicData] {
    Proposal.get_all_proposals(state);
  };
  
  // vote_proposal : shared (Nat, Vote) -> async Result_2;
  public shared ({ caller }) func vote_proposal(id : Int, vote : SharedTypes.Vote) : async ?SharedTypes.ProposalPublicData {
    assert(not Principal.isAnonymous(caller));
    Proposal.vote_proposal(state, caller, id, vote)
  };

  // get_proposals_by_member : shared query Principal -> async [Proposal];
  public query func get_proposals_by_member(principal : Principal) : async [SharedTypes.ProposalPublicData] {
    let all_proposals = Iter.toArray(Map.vals(state.proposals));
    Array.filter<SharedTypes.Proposal>(all_proposals, func p = p.creator == principal)
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

  public func refresh_all_proposals() {
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
  public shared ({ caller }) func like_proposal(id : Nat, like : SharedTypes.LikeProposal) : async ?SharedTypes.ProposalPublicData {
    assert(not Principal.isAnonymous(caller));
    Proposal.like_proposal(state, caller, id, ?like)
  };

  // new_comment_proposal : shared (Nat, Text) -> async ();
  public shared ({ caller }) func new_comment_proposal(id : Nat, comment : Text) : async () {

  };


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
  

  /////////////////////// TODO ////////////////////////////

  
  // accept_member_invitation : shared () -> async Result;
  public shared ({ caller }) func accept_member_invitation() : async () {
    // return Result{};
  };

  // add_owner : shared Principal -> async ();
  public shared ({ caller }) func add_owner(principal : Principal) : async () {

  };





  // reject_member_invitation : shared () -> async Result;
  public shared ({ caller }) func reject_member_invitation() : async () {
    // return Result{};
  };

  // remove_owner : shared Principal -> async ();
  public shared ({ caller }) func remove_owner(principal : Principal) : async () {

  };

  // set_last_activity_member : shared () -> async ();
  public shared ({ caller }) func set_last_activity_member() : async () {

  };

  // test_approve_proposal : shared Nat -> async ();
  public shared ({ caller }) func test_approve_proposal(id : Nat) : async () {

  };

  // test_mint_asset_digital : shared (Principal, Principal, Text, Text, Text, Text, Text, ?Text,) -> async ();
  // public shared ({ caller }) func test_mint_asset_digital(
  //   principal1 : Principal,
  //   principal2 : Principal,
  //   text1 : Text,
  //   text2 : Text,
  //   text3 : Text,
  //   text4 : Text,
  //   text5 : Text,
  //   text6 : ?Text,
  // ) : async () {

  // };

  // test_reject_proposal : shared Nat -> async Result_2;
  public shared ({ caller }) func test_reject_proposal(id : Nat) : async () {
    // return Result_2{};
  };

}