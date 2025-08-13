mod state;

use std::{cell::RefCell, collections::HashSet};

use candid::Principal;
use ic_cdk::{query, update};
use state::{AssetMetadata, CollectionMetadata, State};

thread_local! {
    static STATE: RefCell<State>  = RefCell::default();
}

#[ic_cdk::init]
fn init(
    name: String,
    symbol: String,
    description: String,
    history: String,
    image: String,
    // total_supply: u128,
) {
    borrow_mut(|s| {
        s.init(
            name,
            symbol,
            description,
            history,
            image, /* total_supply */
        )
    });
}

#[query]
fn balance_of(owner: Principal) -> u128 {
    borrow(|s| s.balance_of(owner))
}

#[query]
fn owner_of(asset_id: u128) -> Option<Principal> {
    borrow(|s| s.owner_of(asset_id))
}

#[query]
fn get_approves(asset_id: u128) -> Option<HashSet<Principal>> {
    borrow(|s| s.get_approves(asset_id))
}

#[query]
fn token_uri(asset_id: u128) -> Option<String> {
    borrow(|s| s.token_uri(asset_id))
}

#[query]
fn current_supply() -> u128 {
    borrow(|s| s.current_supply())
}

#[update]
fn approve(asset_id: u128, approved: Principal) -> bool {
    borrow_mut(|s| s.approve(asset_id, approved))
}

#[update]
fn transfer(to: Principal, asset_id: u128) {
    borrow_mut(|s| s.transfer(ic_cdk::caller(), to, asset_id));
}

#[update]
fn transfer_from(from: Principal, to: Principal, asset_id: u128) {
    borrow_mut(|s| s.transfer(from, to, asset_id));
}

#[update(guard = "only_authority")]
fn mint(
    to: Principal,
    name: String,
    symbol: String,
    description: String,
    history: String,
    image: String,
    token_uri: Option<String>,
) -> u128 {
    let metadata = AssetMetadata {
        name,
        symbol,
        description,
        history,
        image,
        token_uri,
    };
    borrow_mut(|s| s.mint(to, metadata))
}

#[update(guard = "only_authority")]
fn set_authority(new_authority: Principal) {
    borrow_mut(|s| s.set_authority(new_authority));
}

#[update(guard = "only_authority")]
fn remove_authority(authority: Principal) {
    borrow_mut(|s| s.remove_authority(authority));
}

// ---- nuevas queries de colección y assets ----
#[query]
fn get_collection() -> CollectionMetadata {
    borrow(|s| s.get_collection())
}

#[query]
fn get_asset_metadata(asset_id: u128) -> Option<state::AssetMetadata> {
    borrow(|s| s.get_asset_metadata(asset_id))
}

#[query]
fn get_asset(asset_id: u128) -> Option<state::AssetView> {
    borrow(|s| s.get_asset(asset_id))
}

#[query]
fn list_assets() -> Vec<state::AssetView> {
    borrow(|s| s.list_assets())
}

// ---- gaurds / modifiers ----
fn only_authority() -> Result<(), String> {
    borrow(|s| s.get_authorities().contains(&ic_cdk::caller()))
        .then_some(())
        .ok_or("Only authorities can call this method".to_string())
}

// ---- state methods ----
fn borrow<T>(f: impl FnOnce(&State) -> T) -> T {
    STATE.with_borrow(f)
}

fn borrow_mut<T>(f: impl FnOnce(&mut State) -> T) -> T {
    STATE.with_borrow_mut(f)
}

// ---- system methods ----
#[ic_cdk::pre_upgrade]
fn pre_upgrade() {
    borrow(|state| ic_cdk::storage::stable_save((state,)).unwrap());
}

#[ic_cdk::post_upgrade]
fn post_upgrade() {
    let (state,): (State,) = ic_cdk::storage::stable_restore().unwrap();
    borrow_mut(|s| *s = state);
}

// Enable Candid export
ic_cdk::export_candid!();
