import Taonga "./taonga/taonga";
import TaongaTypes "./taonga/types";
import Map "mo:map/Map";
import { phash; nhash; ihash } "mo:map/Map";
import Principal "mo:base/Principal";
import { print } "mo:base/Debug";
import { now } "mo:base/Time";
import Error "mo:base/Error";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";
import Nat8 "mo:base/Nat8";

persistent actor {

    //////////////////////// Types ////////////////////////

    type TaongaId = Nat;
    type ProposalId = Nat;
    public type TaongaMetadata = {
        id: Nat;
        canisterId: Principal;
        remoteActorReference: Taonga.Taonga;
        name: Text;
        // image: ?Blob;
    };

    //////////////////////// Config values ////////////////////////

    var cyclesForTaongaDeploy = 1_000_000_000_000; // Cyclos necesarios para desplegar un canister class Taonga... probar cuantos se requieren en mainnet


    ///////////////////////////////////////////////////////

    let taongas = Map.new<TaongaId, TaongaMetadata>();
    // let taongasProposalCreate = Map.new<ProposalId, CreateDigitalTaonga>(); // TODO Revisar dónde se guardan los proposal

    let glbTempStore = Map.new<Int, [Blob]>(); 

    var lastTaongaId = 0;


  //////////////////////// Private Functions ////////////////////////

    /// This function is designed to deploy a new Taonga canister class after its corresponding proposal has been approved. 
    /// The initialization arguments are extracted from the proposal, and the call is executed automatically upon approval, 
    /// following a check for a sufficient cycle balance to successfully complete the action.
    /// A reference to the new actor is saved in the taonga index map. This is done along with the most relevant metadata 
    /// for its preview display (such as its name, and other necessary data) and for direct access from the frontend (the Canister ID).

    func deployTaonga(init: TaongaTypes.InitArgs): async Principal{
        let data = switch ( Map.get<Int, [Blob]>(glbTempStore, ihash, init.tempFileId)) {
            case null throw Error.reject("No data found in glbTempStore for the given id");
            case (?data) { data }
        };
        print("Desplegando Canister Class Taonga...");
        let newTaonga = await (with cycles = cyclesForTaongaDeploy)  Taonga.Taonga(init, callbackLoadAssetOk); //Nuevo canister class

        print("Canister class desplegado en " # debug_show(Principal.fromActor(newTaonga)));
        print("Indexando Canister Class");

        lastTaongaId += 1;
        let id = lastTaongaId;
        let metadata:  TaongaMetadata = {
            id;
            canisterId = Principal.fromActor(newTaonga);
            remoteActorReference = newTaonga;
            name : Text = init.name;
        };
        ignore Map.put<TaongaId, TaongaMetadata>(taongas, nhash, id, metadata);
        // Esperar todos los responses juntos
        let responsesUpload = Array.init<async {#Err : Text; #Ok}>(data.size(), async #Err("not yet")); 
        
        // Pruebas en local: El canister se Taonga se despliega sin problemas y acto seguido se envian todos los chunks del archivo GLB simulado
        // sin esperar el retorno de la llamada. Todos los chunks de 1 MB son cargados exitosamente. Prueba maxima 500 Chunks de 1 MB -> Ok
        var index = 0;
        for (chunk in data.vals()){
            responsesUpload[index] := newTaonga.uploadTaonga({chunk; index }); // Probar sin esperar retorno del Taonga para ver si sube mas rapido
            index += 1;
        };
        // index := 0;
        // /// Probar si esto es necesario. Edit: Funciona sin esto en local, si anda bien en mainnet omitir el array responsesUpload tambien 
        // for (response in responsesUpload.vals()){
        //     print("Esperando acuse de recibo de chunk numero " # Nat.toText(index) # " subido al Taonga");
        //     let responseAwaited = await response; // El primer chunck deberia ser el que mas demora 
        //     switch responseAwaited {
        //         case (#Err(_)) {
        //             print("Reintentando subir chunk numero " # Nat.toText(index));
        //             let retry = await newTaonga.uploadTaonga({chunk = data[index]; index});
        //             switch ( retry ) {
        //                 case (#Err(e)) {throw Error.reject("Error uploading glb file. Taonga Canister sai: " # e)};
        //                 case ( _ ){}
        //             }
        //         };
        //         case (#Ok) { }
        //     };
        //     print("Chunk numero " # Nat.toText(index) # " subido exitosamente");
        //     index += 1;
        // };
        Principal.fromActor(newTaonga);             
    };

    public shared func callbackLoadAssetOk(tempFileId: Int): () {
        let deletedTempFile = switch (Map.remove<Int, [Blob]>(glbTempStore, ihash, tempFileId)) {
            case null [];
            case (?arr) {arr}
        };
        print(Nat.toText(deletedTempFile.size()) # "MB temporary file successfully deleted")
    };

    public shared ({ caller }) func testDeployTaonga(init: TaongaTypes.InitArgs): async {#Ok: Principal; #Err} {
        // assert isAdmin(caller);
        let tempFileId = now();
        let fakeChunkReal1MB = Blob.fromArray(Array.tabulate<Nat8>(1024 * 1024, func x = Nat8.fromNat(x % 256))); //Blob de 1 MByte
        let fakeGLBFileChunked = Array.tabulate<Blob>(init.chunksQty, func x = fakeChunkReal1MB);
        ignore Map.put<Int, [Blob]>(glbTempStore, ihash, tempFileId, fakeGLBFileChunked);
        #Ok(await deployTaonga({init with tempFileId}))

    };
}