module {

  public type InitArgs = {
    admin : Principal;
    name : Text;
    history : Text;
    description : Text;
    tempFileId: Int;
    dataSize : Nat;
    chunksQty : Nat;
    thumbnail: Blob;
  };

  // public type TaongaMetadata = {
  //   id: Nat;
  //   canisterId: Principal;
  //   remoteActorReference: Taonga; // Referencia circular
  //   name: Text;
  //   // image: ?Blob;
  // };

  public type AssetMetadata = {
    name : Text;
    description : Text;
    history : Text;
    token_uri : ?Text;
    image : ?Blob;
    symbol : Text;
  };
  

  public type GetAssetResponse = {
    #Ok : {
      chunk : Blob;
      hasNext : Bool;
    };
    #Err : Text;
  };
};
