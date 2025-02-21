use std::cell::{Cell, RefCell};

use candid::Principal;
use ic_cdk::update;
use state::{dao::Dao, nft::Nft, State};

mod state;

thread_local! {
    static STATE: RefCell<State> = RefCell::default();
    static NFT: Cell<Nft> = Cell::new(Nft::init(Principal::from_text("text").unwrap()));
    static DAO: Cell<Dao> = Cell::new(Dao::init(Principal::from_text("text").unwrap()));
}

#[ic_cdk::init]
fn init() {
    borrow_mut(|s| s.init())
}

// ---- ownership methods ----
#[update(guard = "only_owner")]
fn new_owner(principal: Principal) {
    borrow_mut(|s| s.new_owner(principal))
}

#[update(guard = "only_owner")]
fn remove_owner(principal: Principal) {
    borrow_mut(|s| s.remove_owner(principal))
}

// ---- modifiers/guards ----
fn only_owner() -> Result<(), String> {
    borrow(|s| {
        s.is_owner(ic_cdk::caller())
            .then_some(())
            .ok_or("Only owners can call this method.".to_string())
    })
}

// ---- state methods ----
fn borrow<T>(f: impl FnOnce(&State) -> T) -> T {
    STATE.with_borrow(f)
}

fn borrow_mut<T>(f: impl FnOnce(&mut State) -> T) -> T {
    STATE.with_borrow_mut(f)
}

// Enable Candid export
ic_cdk::export_candid!();
