// import Map "mo:map/Map";

module {

  public type CreateDigitalTaongaArgs = {
    name: Text;
    description: Text;
    history: Text;
    deadline: Int;
    imageID: Nat; // Revisar 
    chunksQty: Nat;
    // chunksFile: [Blob]; //en el submit del proposal se envia vacio y en chunksQty llamadas iterativas se envian los chunk de 1 MiB desde el front
    dataSize: Nat;
  };

  public type DigitalTaongaProposal = {
    #UpdateDigitalTaonga : UpdateDigitalTaongaProposal;
    #DeleteDigitalTaonga : Nat64;
    // #CreateDigitalTaonga : (Text, Text, Text, Nat64, Text); // Cambiar por argumentos de deploy + archivo GLB: [Blob] para upload
    #CreateDigitalTaonga: CreateDigitalTaongaArgs;
    #RequestDownloadPermision;
  };
  public type GuardianProposal = {
    #RemoveFromDao : (Principal, Nat64);
    #AssignAsObserver : (Principal, Nat64);
  };
  public type LikeProposal = { #Like; #Dislike };

  public type Member = {
    principal : Principal;
    liked_proposals : [(Nat, LikeProposal)]; // Originalmente TrieMap
    name : ?Text; // Consultar por cambio a Text no opcional
    role : MemberRole;
    created_at : Nat64;
    last_activity : Nat64;
    cover_img : ?Blob; // Originalmente Text
    profile_pic : ?Blob; // Originalmente Text
  };
  public type MemberError = {
    #NotFound;
    #NotOnlyOneMember;
    #MemberIsNotViewer;
    #MemberIsNotPendingMember;
  };
  public type MemberRole = {
    #Viewer;
    #PendingMember : MemberRole; // Evitar una asignacion recursiva infinita
    #Guardian;
    #Admin;
    #Voter;
    #NFTCreator;
    #Observer;
  };

  public type MotionProposal = {#}; // Consultar

  public type Proposal = {
    id : Nat;
    status : ProposalStatus;
    title : Text;
    creator : Principal;
    votes : [(Principal, Vote)];
    kind : ProposalType;
    description : Text;
    deadline : Nat64;
    created_at : Nat64;
    likes : [(Principal, LikeProposal)];
    active_members : Nat;
    comments : [ProposalComment];
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
  public type Result = { #Ok : Member; #Err : MemberError };
  public type Result_1 = { #Ok : [Principal]; #Err : MemberError };
  public type Result_2 = { #Ok : Proposal; #Err : ProposalError };
  public type UpdateDigitalTaongaProposal = {
    #UpdateImageURL : Text;
    #UpdateDescription : Text;
  };

  public type Vote = { #Approve; #Abstain; #Disapprove };

};

/* interface generada en dashboard.internetcomputer.org
  public type DigitalTaongaProposal = {
    #UpdateDigitalTaonga : UpdateDigitalTaongaProposal;
    #DeleteDigitalTaonga : Nat64;
    #CreateDigitalTaonga : (Text, Text, Text, Nat64, Text);
    #RequestDownloadPermision;
  };
  public type GuardianProposal = {
    #RemoveFromDao : (Principal, Nat64);
    #AssignAsObserver : (Principal, Nat64);
  };
  public type LikeProposal = { #Like; #Dislike };
  public type Member = {
    principal : Principal;
    liked_proposals : [(Nat, LikeProposal)];
    name : ?Text;
    role : MemberRole;
    created_at : Nat64;
    last_activity : Nat64;
    cover_img : Text;
    profile_pic : Text;
  };
  public type MemberError = {
    #NotFound;
    #NotOnlyOneMember;
    #MemberIsNotViewer;
    #MemberIsNotPendingMember;
  };
  public type MemberRole = {
    #Viewer;
    #PendingMember : MemberRole;
    #Guardian;
    #Admin;
    #Voter;
    #NFTCreator;
    #Observer;
  };
  public type MotionProposal = {#};
  public type Proposal = {
    id : Nat;
    status : ProposalStatus;
    title : Text;
    creator : Principal;
    votes : [(Principal, Vote)];
    kind : ProposalType;
    description : Text;
    deadline : Nat64;
    created_at : Nat64;
    likes : [(Principal, LikeProposal)];
    active_members : Nat;
    comments : [ProposalComment];
  };
  public type ProposalComment = {
    creator : Principal;
    created_at : Nat64;
    likes : Nat64;
    comment : Text;
    thread : Vec;
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
  public type Result = { #Ok : Member; #Err : MemberError };
  public type Result_1 = { #Ok : [Principal]; #Err : MemberError };
  public type Result_2 = { #Ok : Proposal; #Err : ProposalError };
  public type UpdateDigitalTaongaProposal = {
    #UpdateImageURL : Text;
    #UpdateDescription : Text;
  };
  public type Vec = [
    {
      creator : Principal;
      created_at : Nat64;
      likes : Nat64;
      comment : Text;
      thread : Vec;
      dislikes : Nat64;
    }
  ];
  public type Vote = { #Approve; #Abstain; #Disapprove };

  public type Self = actor {
    accept_member_invitation : shared () -> async Result;
    add_owner : shared Principal -> async ();
    batch_update_member_role : shared (
        [Principal],
        MemberRole,
      ) -> async Result_1;
    check_proposal_status : shared Nat -> async Result_2;
    create_member : shared () -> async Member;
    create_proposal : shared (
        Text,
        Text,
        ProposalType,
        Nat64,
      ) -> async Proposal;
    edit_member : shared (?Text, ?Text, ?Text) -> async Result;
    edit_proposal : shared (Nat, Text, Text, ProposalType) -> async ?Proposal;
    get_active_members : shared query () -> async [Member];
    get_all_members : shared query () -> async [Member];
    get_all_proposals : shared query () -> async [Proposal];
    get_member : shared query Principal -> async Result;
    get_proposal : shared query Nat -> async ?Proposal;
    get_proposals_by_member : shared query Principal -> async [Proposal];
    has_voted : shared query Nat -> async ?Vote;
    like_proposal : shared (Nat, LikeProposal) -> async ();
    new_comment_proposal : shared (Nat, Text) -> async ();
    reject_member_invitation : shared () -> async Result;
    remove_owner : shared Principal -> async ();
    set_last_activity_member : shared () -> async ();
    test_approve_proposal : shared Nat -> async ();
    test_mint_asset_digital : shared (
        Principal,
        Principal,
        Text,
        Text,
        Text,
        Text,
        Text,
        ?Text,
      ) -> async ();
    test_reject_proposal : shared Nat -> async Result_2;
    vote_proposal : shared (Nat, Vote) -> async Result_2;
  }
*/

