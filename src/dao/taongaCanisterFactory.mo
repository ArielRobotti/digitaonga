import Taonga "./taonga/taonga";
import Map "mo:map/Map";
import { phash; nhash; ihash } "mo:map/Map";
import Principal "mo:base/Principal";
import { print } "mo:base/Debug";
import Error "mo:base/Error";
import Array "mo:base/Array";

persistent actor {

    //////////////////////// Types ////////////////////////

    type TaongaId = Nat;
    type TaongaMetadata = Taonga.TaongaMetadata;
    type ProposalId = Nat;

    //////////////////////// Config values ////////////////////////

    var cyclesForTaongaDeploy = 900_000_000_000; // Cyclos necesarios para desplegar un canister class Taonga... probar 


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

    func deployTaonga(init: Taonga.InitArgs, gldTempStoreId: Int): async Principal{
        let data = switch ( Map.get<Int, [Blob]>(glbTempStore, ihash, gldTempStoreId)) {
            case null throw Error.reject("No data found in glbTempStore for the given id");
            case (?data) { data }
        };
        print("Desplegando Canister Class Taonga...");
        let newTaonga = await (with cycles = cyclesForTaongaDeploy)  Taonga.Taonga(init); //Nuevo canister class

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
        // TODO traer desde el proposal arpobado correspondiente los fragmentos del archivo GLB y pasarlos al nuevo canister
        let responsesUpload = Array.init<async {#Err : Text; #Ok}>(data.size(), async #Err("not yet")); // Esperar todos los responses juntos
        var index = 0;
        for (chunk in data.vals()){
            responsesUpload[index] := newTaonga.uploadTaonga({chunk; index }); // Probar sin esperar retorno del Taonga para ver si sube mas rapido
            index += 1;
        };
        index := 0;
        /// Probar si esto es necesario
        for (response in responsesUpload.vals()){
            let responseAwaited = await response;
            switch responseAwaited {
                case (#Err(_)) {
                    let retry = await newTaonga.uploadTaonga({chunk = data[index]; index});
                    switch ( retry ) {
                        case (#Err(_)) {throw Error.reject("Error uploading glb file")};
                        case _ {}
                    }
                };
                case (#Ok) { }
            };
            index += 1;
        };


        Principal.fromActor(newTaonga);       
        
    }
}