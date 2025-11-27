import Types "./types";
// import Map "mo:map/Map";
import Set "mo:map/Set";
import { phash } "mo:map/Map";
import Array "mo:base/Array";
import { print } "mo:base/Debug";
import Nat "mo:base/Nat";
import Cycles "mo:base/ExperimentalCycles";
import { now } "mo:base/Time";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

  shared ({ caller = DEPLOYER }) persistent actor class Taonga(initArgs : Types.InitArgs, callback: shared Int -> ()) {
    let admins = Set.fromIter<Principal>([DEPLOYER, initArgs.admin].vals(), phash); // Los administradores iniciales son el canister principal y el admin pasado como parametro

    func isAdmin(p : Principal) : Bool {
      Set.has<Principal>(admins, phash, p);
    };

    var taongaIsReady = false;
    var creation_date = now(): Int;
    var lastUpdate = now(): Int;
    var chunkQty = initArgs.chunksQty;
    var assetDataBackup = Array.init<Blob>(initArgs.chunksQty, "" : Blob);

    var assetData = Array.init<Blob>(initArgs.chunksQty, "" : Blob); // Array mut para guardar los chuncks del asset

    var assetMetadata : Types.AssetMetadata = {
      description : Text = initArgs.description;
      history : Text = initArgs.history;
      image : ?Blob = ?initArgs.thumbnail;
      name : Text = initArgs.name;
      symbol : Text = ""; 
      token_uri : ?Text = null; //
      creation_date;
      chunkQty;
    };

    public shared ({ caller }) func updateDescription(titleAnddescription: Text): async {#Ok}{
      assert (isAdmin(caller));
      let arrayDataInput = Iter.toArray(Text.split(titleAnddescription, #text("<END-NAME>"))); // enviar desde DAO "titulo<END-TITLE>descripcion" siempre
      assert(arrayDataInput.size() == 2);
      let name = arrayDataInput[0];
      let description = arrayDataInput[1];
      assetMetadata := {assetMetadata with description; name};
      lastUpdate := now();
      #Ok
    };

    public shared ({ caller }) func updateHistory(history: Text): async {#Ok}{
      assert (isAdmin(caller));
      assetMetadata := {assetMetadata with history};
      lastUpdate := now();
      #Ok
    };

    public shared ({ caller }) func updateFileRequest({thumbnail: Blob; chunksQty: Nat}): async {#Ok}{
      assert (isAdmin(caller));
      taongaIsReady := false;
      assetMetadata := {assetMetadata with image = ?thumbnail; chunkQty = chunksQty};
      assetDataBackup := assetData;
      assetData := Array.init<Blob>(chunksQty, "" : Blob);
      #Ok
    };

    public shared ({ caller }) func uploadTaonga({ chunk : Blob; index : Nat }) : async {
      #Ok;
      #Err : Text;
    } {
      //Carga del GLB en fragmentos de 1 MiB despues del deploy
      assert (isAdmin(caller));
      if (taongaIsReady) { // Quitar esta validación si existe la posibilidad de actualizar el archivo GLB
        return #Err("Error: Taonga is already initialized");
      };
      assetData[index] := chunk;
      print("From Taonga Canister Class... Chunk " # Nat.toText(index) # " recibed");
      if (index + 1 == initArgs.chunksQty) {
        // Integrity verification
        var i = 0;
        for (chunk in assetData.vals()) {
          if (chunk == "") {
            return #Err("Uploading Error: Chunk " # Nat.toText(i) # " Corrupted");
          };
          i += 1;
        };
        print("Upload file process complete");
        callback(initArgs.tempFileId)
      };
      lastUpdate := now();
      #Ok

    };

    public query func get_asset_data({ chunkIndex : Nat }) : async Types.GetAssetResponse {
      if (assetData.size() < chunkIndex) {
        return #Err("Error: chunk index out of bounds");
      };
      #Ok({
        chunk = assetData[chunkIndex];
        hasNext = (chunkIndex + 1) < assetData.size();
      });
    };

    public query func get_asset_metadata() : async Types.AssetMetadata {
      assetMetadata;
    };

    public shared query func balance(): async Nat{
      Cycles.balance()
    };

  };
