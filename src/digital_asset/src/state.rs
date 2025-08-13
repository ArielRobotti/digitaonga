use std::collections::{HashMap, HashSet};

use candid::{CandidType, Principal};
use serde::Deserialize;

#[derive(Default, CandidType, Deserialize)]
pub struct State {
    pub name: String,
    pub symbol: String,
    pub description: String,
    pub image: String,
    pub history: String,
    // total_supply: u128,
    pub next_asset_id: u128,

    pub owners: HashMap<u128, Principal>,   // (asset_id, owner)
    pub balances: HashMap<Principal, u128>, // (owner, amount)
    pub approvals: HashMap<u128, HashSet<Principal>>, // (asset_id, [approved])
    pub asset_uris: HashMap<u128, String>,  // (asset_id, uri)
    pub authorities: HashSet<Principal>,    // [authority]
}

#[derive(Default, CandidType, Deserialize)]
pub struct Asset {
    pub name: String,
    pub symbol: String,
    pub description: String,
    pub image: String,
    pub history: String,
    pub uri: String,
}

impl State {
    pub fn init(
        &mut self,
        name: String,
        symbol: String,
        description: String,
        history: String,
        image: String,
        // total_supply: u128,
    ) {
        self.name = name;
        self.symbol = symbol;
        self.image = image;
        self.description = description;
        self.history = history;
        // self.total_supply = total_supply;
        self.next_asset_id = 0;
        self.authorities.insert(ic_cdk::caller());
    }

    pub fn balance_of(&self, owner: Principal) -> u128 {
        match self.balances.get(&owner) {
            Some(&balance) => balance,
            None => 0,
        }
    }

    pub fn owner_of(&self, asset_id: u128) -> Option<Principal> {
        self.owners.get(&asset_id).cloned()
    }

    pub fn get_approves(&self, asset_id: u128) -> Option<HashSet<Principal>> {
        self.approvals.get(&asset_id).cloned()
    }

    pub fn token_uri(&self, asset_id: u128) -> Option<String> {
        self.asset_uris.get(&asset_id).cloned()
    }

    pub fn current_supply(&self) -> u128 {
        self.owners.len() as u128
    }

    pub fn get_all_assets(&self) -> Vec<Asset> {
        let name = self.name.clone();
        let symbol = self.symbol.clone();
        let description = self.description.clone();
        let image = self.image.clone();
        let history = self.history.clone();

        let mut assets = Vec::with_capacity(self.next_asset_id as usize);
        for i in 0..self.next_asset_id + 1 {
            assets.push(Asset {
                name: name.clone(),
                symbol: symbol.clone(),
                description: description.clone(),
                image: image.clone(),
                history: history.clone(),
                uri: self.asset_uris.get(&i).cloned().unwrap_or_default(),
            });
        }
        assets
    }

    pub fn approve(&mut self, asset_id: u128, approved: Principal) -> bool {
        assert_eq!(
            self.owners.get(&asset_id),
            Some(&ic_cdk::caller()),
            "Only the owner can approve an asset"
        );

        let approved_list = self.approvals.entry(asset_id).or_insert(HashSet::new());
        approved_list.insert(approved)
    }

    pub fn transfer(&mut self, from: Principal, to: Principal, asset_id: u128) {
        let is_owner = self.owners.get(&asset_id) == Some(&from);
        let is_approved = self
            .approvals
            .get(&asset_id)
            .is_some_and(|approved_list| approved_list.contains(&from));

        assert!(
            is_owner || is_approved,
            "Not authorized to transfer this asset"
        );

        self.owners.insert(asset_id, to);
        self.balances
            .insert(from, self.balance_of(from).saturating_sub(1));
        self.balances.insert(to, self.balance_of(to) + 1);
    }

    pub fn mint(&mut self, to: Principal, uri: String) -> u128 {
        let asset_id = self.next_asset_id;
        self.owners.insert(asset_id, to);
        self.balances.insert(to, self.balance_of(to) + 1);
        self.asset_uris.insert(asset_id, uri);
        self.next_asset_id += 1;
        asset_id
    }

    pub fn _burn(&mut self, asset_id: u128) {
        let caller = ic_cdk::caller();

        assert_eq!(
            self.owners.get(&asset_id),
            Some(&caller),
            "Only the owner can burn an asset"
        );

        self.owners.remove(&asset_id);
        self.approvals.remove(&asset_id);
        self.asset_uris.remove(&asset_id);
        self.balances
            .insert(caller, self.balance_of(caller).saturating_sub(1));
    }

    pub fn get_authorities(&self) -> Vec<Principal> {
        self.authorities.iter().cloned().collect()
    }

    pub fn set_authority(&mut self, authority: Principal) {
        assert!(
            self.authorities.insert(authority),
            "Authority already exists"
        );
    }

    pub fn remove_authority(&mut self, authority: Principal) {
        assert!(
            self.authorities.remove(&authority),
            "Authority does not exist"
        );
    }
}
