import DaoTypes "./types";
import Member "./member";
import Proposal "./proposal";
import Error "mo:base/Error";


persistent actor {


  let state: DaoTypes.State = DaoTypes.initState(); 

     
  ////////////////////// Migracion de funciones existentes /////////
  //////////////////////////////// Done ////////////////////////////

  public shared ({ caller }) func create_member() : async Member.Member {
    // Revisar logica de creacion de Miembros y asignacion de roles
    // Actualmente por efecto de esta funcion el primero que se registra es admin y el resto viewer
    Member.create_member(state, caller)
  };

  public shared ({ caller }) func edit_member({name; profile_pic; cover_img }: Member.MemberEditableData) : async Member.Result {
    Member.edit_member(state, caller, {name; profile_pic; cover_img})
  };

  public shared ({ caller }) func batch_update_member_role(principals : [Principal], role : Member.MemberRole) : async [(Principal, Member.MemberError)] {
    assert(Member.is_admin(state, caller));
    Member.batch_update_member_role(state, principals, role);
    // TODO. Registrar Fecha, Cambio y autor del autor del cambio?
  };

  ///////////////////////////// CRUD Proposals ///////////

  public shared ({ caller }) func create_proposal(args: Proposal.NewProposalArgs) : async Proposal.Proposal {
    let callerRole = Member.get_role_member(state, caller);
    assert(callerRole != null and callerRole != ?#Observer); //
    Proposal.new_proposal(state, caller, args)
  };

  public shared ({ caller }) func uploadFileChunk({fileId: Int; chunk: Blob; index: Nat}): async {#Ok; #Err}{
    Proposal.addChunk({
      s = state;
      fileId;
      chunk;
      caller;
      index
    })
  };
  
  // get_proposal : shared query Nat -> async ?Proposal;
  public query func get_proposal(id: Int): async ?Proposal.Proposal {
    Proposal.get_proposal(state, id);
  };

  // edit_proposal : shared (Nat, Text, Text, ProposalType) -> async ?Proposal; // Cambio de firma (id: Int; data: ProposalEditableData)
  public shared ({ caller }) func edit_proposal(id : Int, data: Proposal.ProposalEditableData) : async ?Proposal.Proposal {
    Proposal.edit_proposal(state, caller, id, data);
  };

  public shared ({ caller }) func delete_proposal(id: Int): async ?Proposal.Proposal {
    Proposal.delete_proposal(state, caller, id);
  };
  //////////////////////////////////////////////////////////////////
  

  /////////////////////// TODO ////////////////////////////

  // vote_proposal : shared (Nat, Vote) -> async Result_2;
  public shared ({ caller }) func vote_proposal(id : Int, vote : Proposal.Vote) : async () {
    
  };
  
  // accept_member_invitation : shared () -> async Result;
  public shared ({ caller }) func accept_member_invitation() : async () {
    // return Result{};
  };

  // add_owner : shared Principal -> async ();
  public shared ({ caller }) func add_owner(principal : Principal) : async () {

  };

  // check_proposal_status : shared Nat -> async Result_2;
  public shared ({ caller }) func check_proposal_status(id : Nat) : async () {
    // return Result_2{};
  };

  // get_active_members : shared query () -> async [Member];
  public query func get_active_members() : async () {
    // return [Member]{};
  };

  // get_all_members : shared query () -> async [Member];
  public query func get_all_members() : async () {
    // return [Member]{};
  };

  // get_all_proposals : shared query () -> async [Proposal];
  public query func get_all_proposals() : async () {
    // return [Proposal]{};
  };

  // get_member : shared query Principal -> async Result;
  public query func get_member(principal : Principal) : async () {
    // return Result{};
  };

  // get_proposals_by_member : shared query Principal -> async [Proposal];
  public query func get_proposals_by_member(principal : Principal) : async () {
    // return [Proposal]{};
  };

  // has_voted : shared query Nat -> async ?Vote;
  public query func has_voted(id : Nat) : async () {
    // return ?Vote{};
  };

  // like_proposal : shared (Nat, LikeProposal) -> async ();
  public shared ({ caller }) func like_proposal(id : Nat, like : DaoTypes.LikeProposal) : async () {

  };

  // new_comment_proposal : shared (Nat, Text) -> async ();
  public shared ({ caller }) func new_comment_proposal(id : Nat, comment : Text) : async () {

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
  public shared ({ caller }) func test_mint_asset_digital(
    principal1 : Principal,
    principal2 : Principal,
    text1 : Text,
    text2 : Text,
    text3 : Text,
    text4 : Text,
    text5 : Text,
    text6 : ?Text,
  ) : async () {

  };

  // test_reject_proposal : shared Nat -> async Result_2;
  public shared ({ caller }) func test_reject_proposal(id : Nat) : async () {
    // return Result_2{};
  };

}