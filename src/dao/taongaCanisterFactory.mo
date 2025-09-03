import Taonga "./taonga/taonga";
import Map "mo:map/Map";
import { phash; nhash } "mo:map/Map";
import Principal "mo:base/Principal";
import { print } "mo:base/Debug";

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

    var lastTaongaId = 0;


  //////////////////////// Private Functions ////////////////////////

    /// This function is designed to deploy a new Taonga canister class after its corresponding proposal has been approved. 
    /// The initialization arguments are extracted from the proposal, and the call is executed automatically upon approval, 
    /// following a check for a sufficient cycle balance to successfully complete the action.
    /// A reference to the new actor is saved in the taonga index map. This is done along with the most relevant metadata 
    /// for its preview display (such as its name, and other necessary data) and for direct access from the frontend (the Canister ID).

    func deployTaonga(init: Taonga.InitArgs): async Principal{

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

        Principal.fromActor(newTaonga);       
        
    }
}