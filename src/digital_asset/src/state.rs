use std::collections::{HashMap, HashSet};

use candid::{CandidType, Principal};
use serde::Deserialize;

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct CollectionMetadata {
    pub name: String,
    pub symbol: String,
    pub description: String,
    pub history: String,
    pub image: String,
}

impl Default for CollectionMetadata {
    fn default() -> Self {
        Self {
            name: String::new(),
            symbol: String::new(),
            description: String::new(),
            history: String::new(),
            image: String::new(),
        }
    }
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct AssetMetadata {
    pub name: String,
    pub symbol: String,
    pub description: String,
    pub history: String,
    pub image: String,
    // URI opcional para metadatos extendidos
    pub token_uri: Option<String>,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct AssetView {
    pub id: u128,
    pub owner: Principal,
    pub metadata: AssetMetadata,
}

#[derive(CandidType, Deserialize)]
pub struct State {
    collection: CollectionMetadata,
    // total_supply: u128,
    next_asset_id: u128,

    owners: HashMap<u128, Principal>,   // (asset_id, owner)
    balances: HashMap<Principal, u128>, // (owner, amount)
    approvals: HashMap<u128, HashSet<Principal>>, // (asset_id, [approved])
    metadata: HashMap<u128, AssetMetadata>, // (asset_id, metadata)
    authorities: HashSet<Principal>,    // [authority]
}

impl Default for State {
    fn default() -> Self {
        Self {
            collection: CollectionMetadata::default(),
            next_asset_id: 0,
            owners: HashMap::new(),
            balances: HashMap::new(),
            approvals: HashMap::new(),
            metadata: HashMap::new(),
            authorities: HashSet::new(),
        }
    }
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
        self.collection = CollectionMetadata {
            name,
            symbol,
            description,
            history,
            image,
        };
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
        self.metadata
            .get(&asset_id)
            .and_then(|m| m.token_uri.clone())
    }

    pub fn current_supply(&self) -> u128 {
        self.owners.len() as u128
    }

    pub fn approve(&mut self, asset_id: u128, approved: Principal) -> bool {
        assert_eq!(
            self.owners.get(&asset_id),
            Some(&ic_cdk::caller()),
            "Only the owner can approve an asset",
        );

        let approved_list = self.approvals.entry(asset_id).or_insert(HashSet::new());
        approved_list.insert(approved)
    }

    pub fn transfer(&mut self, from: Principal, to: Principal, asset_id: u128) {
        let caller = ic_cdk::caller();
        let owner = *self.owners.get(&asset_id).expect("Asset does not exist");

        let caller_is_owner = caller == owner;
        let caller_is_approved = self
            .approvals
            .get(&asset_id)
            .map(|set| set.contains(&caller))
            .unwrap_or(false);

        assert!(
            caller_is_owner || caller_is_approved,
            "Not authorized to transfer this asset"
        );
        assert_eq!(owner, from, "'from' is not the current owner");

        self.owners.insert(asset_id, to);
        self.balances
            .insert(from, self.balance_of(from).saturating_sub(1));
        self.balances.insert(to, self.balance_of(to) + 1);

        // Limpiar approvals específicos del token tras la transferencia
        self.approvals.remove(&asset_id);
    }

    pub fn mint(&mut self, to: Principal, metadata: AssetMetadata) -> u128 {
        let asset_id = self.next_asset_id;
        self.owners.insert(asset_id, to);
        self.balances.insert(to, self.balance_of(to) + 1);
        self.metadata.insert(asset_id, metadata);
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
        self.metadata.remove(&asset_id);
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

    pub fn get_collection(&self) -> CollectionMetadata {
        self.collection.clone()
    }

    pub fn get_asset_metadata(&self, asset_id: u128) -> Option<AssetMetadata> {
        self.metadata.get(&asset_id).cloned()
    }

    pub fn list_assets(&self) -> Vec<AssetView> {
        let mut out: Vec<AssetView> = Vec::with_capacity(self.owners.len());
        for (id, owner) in self.owners.iter() {
            if let Some(meta) = self.metadata.get(id) {
                out.push(AssetView {
                    id: *id,
                    owner: *owner,
                    metadata: meta.clone(),
                });
            }
        }
        out
    }

    pub fn get_asset(&self, asset_id: u128) -> Option<AssetView> {
        let owner = self.owners.get(&asset_id).cloned()?;
        let metadata = self.metadata.get(&asset_id).cloned()?;
        Some(AssetView {
            id: asset_id,
            owner,
            metadata,
        })
    }
}
