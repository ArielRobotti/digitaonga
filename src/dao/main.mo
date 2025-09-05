import DaoTypes "./types";
import Error "mo:base/Error";


persistent actor {

  /////////////////////// Types /////////////////////////

  let state: DaoTypes.State = DaoTypes.initState(); 

    
    ///////// Migracion de funciones existentes /////////

  public shared ({ caller }) func create_member() : async DaoTypes.Member {
    DaoTypes.create_member(state, caller)
  };

  // edit_member : shared (?Text, ?Text, ?Text) -> async Result;
  public shared ({ caller }) func edit_member(name : ?Text, email : ?Text, socialMedia : ?Text) : async () {
    // return Result{};
  };

  // accept_member_invitation : shared () -> async Result;
  public shared ({ caller }) func accept_member_invitation() : async () {
    // return Result{};
  };

  // add_owner : shared Principal -> async ();
  public shared ({ caller }) func add_owner(principal : Principal) : async () {

  };

  // batch_update_member_role : shared ([Principal], MemberRole,) -> async Result_1;
  public shared ({ caller }) func batch_update_member_role(principals : [Principal], role : DaoTypes.MemberRole) : async () {
    // return Result_1{};
  };

  // check_proposal_status : shared Nat -> async Result_2;
  public shared ({ caller }) func check_proposal_status(id : Nat) : async () {
    // return Result_2{};
  };


  // create_proposal : shared (Text, Text, ProposalType, Nat64,) -> async Proposal;
  public shared ({ caller }) func create_proposal(title : Text, description : Text, proposalType : DaoTypes.ProposalType, startDate : Nat64) : async () {
    // return Proposal{};
  };

  // edit_proposal : shared (Nat, Text, Text, ProposalType) -> async ?Proposal;
  public shared ({ caller }) func edit_proposal(id : Nat, title : Text, description : Text, proposalType : DaoTypes.ProposalType) : async () {
    // return ?Proposal{};
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

  // get_proposal : shared query Nat -> async ?Proposal;
  public query func get_proposal(id : Nat) : async () {
    // return ?Proposal{};
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

  // vote_proposal : shared (Nat, Vote) -> async Result_2;
  public shared ({ caller }) func vote_proposal(id : Nat, vote : DaoTypes.Vote) : async () {
    // return Result_2{};
  };
}