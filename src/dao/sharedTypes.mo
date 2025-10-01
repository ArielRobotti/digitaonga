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

  public type Metadata = [(Text, Value)] ;
  type Value = {
    #Int : Int;
    #Metadata : Metadata;
    #Nat : Nat;
    #Blob : Blob;
    #Text : Text;
    #Array : [Value];
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
    id : Int; 
    deadline : Int;
    status : ProposalStatus;
    title : Text;
    description : Text;
    impact: Text;
    kind : ProposalType;
    active_members : Nat;
    comments : List.List<Comment>;
    likes: [(Principal, LikeProposal)];
    partialResults: {approving: Nat; disapproving: Nat; abstentions: Nat};
    creator : Principal;
    creatorName: ?Text;
    extendedData: Metadata;
  };

  public type Proposal = ProposalPublicData and {
    votes : [(Principal, Vote)];
  };

  public type Vote = { #Approve; #Abstain; #Disapprove };


  public type Comment = {
    msg : Text;
    creator : Principal;
    created_at : Int; // Funciona como id
    likes : [Principal];
    dislikes : [Principal];
    subComments : List.List<Comment>;
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
    #Motion;
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
    history : Text;
    description : Text;
    thumbnail: Blob;
    date: Int;
  };
}