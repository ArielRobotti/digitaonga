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
    // standardMetadata: Metadata //Compatibilidad con standars icrc7
  };

  public type AssetMetadata = {
    name : Text;
    description : Text;
    history : Text;
    token_uri : ?Text;
    image : ?Blob;
    chunkQty: Nat;
    symbol : Text;
    creation_date: Int;
    // standardMetadata: Metadata;  //Compatibilidad con standars icrc7
  };

  type Value = {
    #Int : Int;
    #Metadata : Metadata;
    #Nat : Nat;
    #Blob : Blob;
    #Text : Text;
    #Array : [Value];
  };

  public type Metadata = [(Text, Value)] ;
  

  public type GetAssetResponse = {
    #Ok : {
      chunk : Blob;
      hasNext : Bool;
    };
    #Err : Text;
  };

  
};
