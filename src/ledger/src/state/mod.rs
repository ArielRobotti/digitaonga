use std::collections::HashMap;

use candid::{CandidType, Principal};
use serde::Deserialize;

pub mod dao;

#[derive(CandidType, Clone, Deserialize, Default)]
pub struct State {
    owners: HashMap<Principal, bool>,
}

impl State {
    pub fn init(&mut self) {
        self.owners.insert(ic_cdk::caller(), true);
    }

    // TODO (fran): ver si hacer trasnfer llamando desde dao canister o hacer approve y transfer_from
    // ver si cambia algo en seguridad (creo que no)
    // --- nft ---
    pub fn approve_nft() {}

    pub fn transfer_from_nft() {}

    // --- ownership ---
    pub fn new_owner(&mut self, principal: Principal) {
        self.owners.insert(principal, true);
    }

    pub fn remove_owner(&mut self, principal: Principal) {
        self.owners.remove(&principal);
    }

    pub fn is_owner(&self, principal: Principal) -> bool {
        self.owners.get(&principal).cloned().unwrap_or(false)
    }
}
