import Map "mo:map/Map";
// import Buffer "mo:base/Buffer";
// import { phash; ihash } "mo:map/Map";
// import { now } "mo:base/Time";
// import List "mo:base/List";
import SharedTypes "./sharedTypes";

module {

  type DigitalTaongaProposal = SharedTypes.DigitalTaongaProposal;
  type GuardianProposal = SharedTypes.GuardianProposal;
  type Member = SharedTypes.Member;
  type MemberError = SharedTypes.MemberError;
  type Proposal = SharedTypes.Proposal;
  type ProposalType = SharedTypes.ProposalType;
  type ProposalError = SharedTypes.ProposalError;
  type LikeProposal = SharedTypes.LikeProposal;
  type MemberRole = SharedTypes.MemberRole;

  public type CreateDigitalTaongaArgs = SharedTypes.CreateDigitalTaongaArgs;
  public type State = {
    members : Map.Map<Principal, Member>;
    tempFiles : Map.Map<Int, File>; // Ver si es necesario un owner para control de acceso
    proposals : Map.Map<Int, Proposal>; // El id puede ser el Timestamp en lugar del tamaño actual del Map
    // taongas: Map.Map<Nat, SharedTypes.TaongaMetadata>;
    taongas: Map.Map<Principal, SharedTypes.TaongaMetadata>;
    // callback: shared Int -> ();
    cyclesForTaongaDeploy: Nat;
  };

  public type File = { // Por ahora no es necesario mas información
    owner: Principal;
    data: [var Blob];
    size: Nat;
  };

  public func initState({cyclesForTaongaDeploy: Nat} ) : State {
    {
      members = Map.new<Principal, Member>();
      tempFiles = Map.new<Int, File>();
      proposals = Map.new<Int, Proposal>();
      taongas = Map.new<Principal, SharedTypes.TaongaMetadata>();
      // callback;
      cyclesForTaongaDeploy;
    };
  };

  public type Result = { #Ok : Member; #Err : MemberError };
  public type Result_1 = { #Ok : [Principal]; #Err : MemberError };
  public type Result_2 = { #Ok : Proposal; #Err : ProposalError };
  public type UpdateDigitalTaongaProposal = {
    #UpdateImageURL : Text;
    #UpdateDescription : Text;
  };

};
