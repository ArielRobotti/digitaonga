import Taonga "./taonga/taonga";
import List "mo:base/List";

module {

  public type GuardianProposal = {
    #RemoveFromDao : (Principal, Int);
    #AssignAsObserver : (Principal, Int);
    #AssignRole: {
      member: Principal;
      role: MemberRole;
      deadline: Int;
    }
  };

  public type Member = {
    principal : Principal;
    liked_proposals : [(Nat, LikeProposal)]; // Originalmente HashMap
    name : ?Text; // Consultar por cambio a Text no opcional
    role : MemberRole;
    created_at : Int; // Originalmente Nat64
    last_activity : Int; // Originalmente Nat64
    cover_img : ?Blob; // Originalmente Text
    profile_pic : ?Blob; // Originalmente Text
  };

  public type MemberEditableData = {
    name : ?Text;
    cover_img : ?Blob;
    profile_pic : ?Blob;
  };

  public type MemberError = {
    #NotFound;
    #NotOnlyOneMember;
    #MemberIsNotViewer;
    #MemberIsNotPendingMember;
    #UnassignableRole;
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

  public type LikeProposal = { #Like; #Dislike };

  public type CreateDigitalTaongaArgs = {
    name : Text;
    description : Text;
    history : Text;
    deadline : Int;
    imageID : Nat; // Revisar
    thumbnail: Blob;
    chunksQty : Nat;
    dataSize : Nat;
  };

  public type DigitalTaongaProposal = {
    #UpdateDigitalTaonga : UpdateDigitalTaongaProposal;
    #DeleteDigitalTaonga : Nat64;
    #CreateDigitalTaonga : CreateDigitalTaongaArgs;
    #RequestDownloadPermision;
  };

  public type UpdateDigitalTaongaProposal = {
    #UpdateImageURL : Text;
    #UpdateDescription : Text;
  };

  public type ProposalPublicData = {
    id : Int; // Cambio de Nat a Int, podemos definir el ID con el Timestamp de ingreso del proposal en lugar de con la cnatidad actual de proposals
    created_at : Int; // Informacion duplicada por el cambio en el ID
    deadline : Int;
    status : ProposalStatus;
    title : Text;
    kind : ProposalType;
    description : Text;
    active_members : Nat;
    comments : List.List<ProposalComment>;
    likes: [(Principal, LikeProposal)];
    creator : Principal;
  };

  public type Proposal = ProposalPublicData and {
    votes : [(Principal, Vote)];
  };

  public type Vote = { #Approve; #Abstain; #Disapprove };


  public type ProposalComment = {
    creator : Principal;
    created_at : Nat64;
    likes : Nat64;
    comment : Text;
    thread : [ProposalComment]; //
    dislikes : Nat64;
  };

  public type ProposalError = { 
    #LastAdmin; 
    #Closed; 
    #NotFound; 
    #Unauthorized 
  };

  public type ProposalType = {
    #Action : (Text, Text, Nat64);
    #Guardian : GuardianProposal;
    #DigitalTaonga : DigitalTaongaProposal;
    #Motion : MotionProposal;
  };

  public type MotionProposal = { # }; // Consultar

  public type ProposalStatus = {
    #UploadFileRequired;
    #Open;
    #Review;
    #Approved;
    #Rejected;
    #Voting;
  };

  public type TaongaMetadata = {
    // id : Nat;
    canisterId : Principal;
    remoteActorReference : Taonga.Taonga;
    name : Text;
    thumbnail: Blob;
  };
}