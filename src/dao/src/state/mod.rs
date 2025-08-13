use std::{collections::HashMap, vec};

use candid::{CandidType, Principal};
use member::{Member, MemberError, MemberResult, MemberRole};

use proposal::{ActionProposal, Proposal, ProposalError, ProposalResult, ProposalType, Vote};
use serde::Deserialize;
use shared::LikeProposal;

use crate::{
    instructions::DigitalAsset,
    state::proposal::{DigitalTaongaProposal, MintNftParams},
};

pub mod member;
pub mod proposal;
pub mod shared;

#[derive(CandidType, Clone, Default, Deserialize)]
pub struct State {
    members: HashMap<Principal, Member>,
    proposals: HashMap<u128, Proposal>,
    petitions: HashMap<u128, ()>, // TODO (fran): petitions != proposals ?
    // nfts: HashMap<Principal, HashMap<u128, LocalNft>>, // (canister_id => (token_id => nft)). hecho asi para poder controlar el ownership en caso de que sea necesario
    owners: HashMap<Principal, bool>, // TODO (fran): creo que no va
}

impl State {
    pub fn init(&mut self) {
        // TODO (fran): checkear si esto solo se hace en el primer deploy o siempre que hago deploy
        let caller = ic_cdk::caller();
        let fist_member = Member::new(Some(MemberRole::Admin));

        self.members.insert(caller, fist_member);
        self.owners.insert(caller, true);
    }

    // --- members ---
    pub fn get_member(&self, principal: Principal) -> MemberResult {
        self.members
            .get(&principal)
            .cloned()
            .ok_or(MemberError::NotFound)
    }

    pub fn get_all_members(&self) -> Vec<Member> {
        self.members.values().cloned().collect()
    }

    pub fn get_active_members(&self) -> Vec<Member> {
        self.members
            .values()
            .filter(|m| m.is_active() && m.is_approved_member())
            .cloned()
            .collect()
    }

    fn get_total_admins(&self) -> usize {
        self.members
            .values()
            .filter(|m| m.is_admin())
            .collect::<Vec<&Member>>()
            .len()
    }

    pub fn new_member(&mut self) -> Member {
        let new_member = if self.members.len() == 0 {
            Member::new(Some(MemberRole::Admin))
        } else {
            Member::new(None)
        };
        self.members.insert(ic_cdk::caller(), new_member.clone());
        new_member
    }

    pub fn edit_member(
        &mut self,
        profile_pic: Option<String>,
        cover_img: Option<String>,
        name: Option<String>,
    ) -> MemberResult {
        match self.members.get_mut(&ic_cdk::caller()) {
            Some(member) => Ok(member.edit(profile_pic, cover_img, name)),
            None => Err(MemberError::NotFound),
        }
    }

    pub fn set_last_activity_member(&mut self) {
        if let Some(m) = self.members.get_mut(&ic_cdk::caller()) {
            m.set_last_activity();
        }
    }

    pub fn accept_invitation(&mut self) -> MemberResult {
        if let Some(m) = self.members.get_mut(&ic_cdk::caller()) {
            if m.is_pending_member() {
                Ok(m.change_role(m.next_role()))
            } else {
                Err(MemberError::MemberIsNotPendingMember)
            }
        } else {
            Err(MemberError::NotFound)
        }
    }

    pub fn reject_invitation(&mut self) -> MemberResult {
        if let Some(m) = self.members.get_mut(&ic_cdk::caller()) {
            if m.is_pending_member() {
                Ok(m.change_role(MemberRole::Viewer))
            } else {
                Err(MemberError::MemberIsNotPendingMember)
            }
        } else {
            Err(MemberError::NotFound)
        }
    }

    pub fn batch_update_member_role(
        &mut self,
        member_list: Vec<Principal>,
        new_role: MemberRole,
    ) -> Result<Vec<Principal>, MemberError> {
        if self
            .members
            .values()
            .filter(|m| m.role() != MemberRole::Viewer)
            .collect::<Vec<&Member>>()
            .len()
            > 1
        {
            Err(MemberError::NotOnlyOneMember)
        } else {
            let mut updated_members = vec![];

            for prin in member_list {
                if let Some(m) = self.members.get_mut(&prin) {
                    m.change_role(new_role.clone());
                    updated_members.push(prin);
                }
            }

            Ok(updated_members)
        }
    }
    // --- proposals ---
    // TODO (fran): quien puede crear propuestas??
    pub fn new_proposal(
        &mut self,
        title: String,
        description: String,
        kind: ProposalType,
        deadline: u64,
    ) -> Proposal {
        /*
            TODO (fran): aca checkear data de ProposalType antes de crear
            tal vez hacer un guard para esto?
                * si es transfer nft => verificar collection_id y token_id
                * UpdatePolicy => ver


        */

        let new_id = self.proposals.len() as u128;
        let new_proposal = Proposal::build(
            new_id,
            title,
            description,
            kind,
            deadline,
            self.get_active_members().len() as u128,
        );
        self.proposals.insert(new_id, new_proposal.clone());
        new_proposal
    }

    pub fn edit_proposal(
        &mut self,
        id: u128,
        title: String,
        description: String,
        kind: ProposalType,
    ) -> Option<Proposal> {
        // let _ = self.check_proposal_status(id);

        if let Some(proposal) = self.proposals.get_mut(&id) {
            if proposal.creator() == ic_cdk::caller() && proposal.is_open() {
                return Some(proposal.edit(title, description, kind));
            }
        }
        None
    }

    pub fn new_comment_proposal(&mut self, id: u128, comment: String) {
        // let _ = self.check_proposal_status(id);

        if let Some(proposal) = self.proposals.get_mut(&id) {
            proposal.new_comment(comment);
        }
    }

    pub fn like_proposal(&mut self, id: u128, kind: LikeProposal) {
        // let _ = self.check_proposal_status(id);

        if let Some(proposal) = self.proposals.get_mut(&id) {
            if let Some(member) = self.members.get_mut(&ic_cdk::caller()) {
                proposal.like(kind.clone());
                member.like_proposal(id, kind);
            }
        }
    }

    // TODO (fran): ver quien puede votar
    pub fn vote_proposal(&mut self, id: u128, vote: Vote) -> ProposalResult {
        // self.check_proposal_status(id)?;

        if let Some(proposal) = self.proposals.get_mut(&id) {
            // FIXME (fran): descomentar esto! solo por testing
            if proposal.is_open() {
                return Ok(proposal.vote(vote));
            } else {
                Err(ProposalError::Closed)
            }
        } else {
            Err(ProposalError::NotFound)
        }
    }

    pub fn check_proposal_status(&mut self, id: u128) -> ProposalResult {
        let now = ic_cdk::api::time();
        // let one_week = 7 * 24 * 60 * 60 * 1_000_000_000; // One week in nanoseconds
        let active_members = self.get_active_members().len() as u128;

        let total_admins = self.get_total_admins() as u128;

        if let Some(proposal) = self.proposals.get_mut(&id) {
            if (now > proposal.deadline()) && proposal.is_open() {
                if proposal.approved_votes() > proposal.disapproved_votes() {
                    proposal.approve();
                    proposal.set_active_members(active_members);
                } else {
                    proposal.reject();
                }
            }

            Ok(proposal.clone())
        } else {
            Err(ProposalError::NotFound)
        }
    }

    pub fn get_proposal(&self, id: u128) -> Option<Proposal> {
        self.proposals.get(&id).cloned()
    }

    pub fn get_proposal_mut(&mut self, id: u128) -> Option<&mut Proposal> {
        self.proposals.get_mut(&id)
    }

    pub fn get_all_proposals(&self) -> Vec<Proposal> {
        self.proposals.values().cloned().collect()
    }

    pub fn get_proposals_by_member(&self, principal: Principal) -> Vec<Proposal> {
        self.proposals
            .values()
            .filter(|p| p.creator() == principal)
            .cloned()
            .collect()
    }

    pub fn has_voted(&self, id: u128) -> Option<Vote> {
        if let Some(proposal) = self.proposals.get(&id) {
            proposal.has_voted(ic_cdk::caller())
        } else {
            None
        }
    }

    // only for testing
    pub fn approve_proposal(&mut self, id: u128) -> ProposalResult {
        // let _ = self.check_proposal_status(id);

        if let Some(proposal) = self.proposals.get_mut(&id) {
            proposal.approve();
            Ok(proposal.clone())
        } else {
            Err(ProposalError::NotFound)
        }
    }

    // only for testing
    pub fn reject_proposal(&mut self, id: u128) -> ProposalResult {
        // let _ = self.check_proposal_status(id);
        if let Some(proposal) = self.proposals.get_mut(&id) {
            proposal.reject();
            Ok(proposal.clone())
        } else {
            Err(ProposalError::NotFound)
        }
    }

    // // --- nft ---
    // pub fn mint_local_nft(
    //     &mut self,
    //     collection_id: Principal,
    //     token_id: u128,
    //     owner: Principal,
    //     name: String,
    //     description: String,
    //     image: String,
    // ) -> u128 {
    //     let new_nft = LocalNft::new(collection_id, token_id, owner, name, description, image);

    //     match self.nfts.get_mut(&collection_id) {
    //         Some(coll) => {
    //             coll.insert(token_id, new_nft);

    //             token_id
    //         }
    //         None => {
    //             let mut new_coll = HashMap::new();
    //             new_coll.insert(token_id, new_nft);

    //             self.nfts.insert(collection_id, new_coll);
    //             token_id
    //         }
    //     }
    // }

    // pub fn transfer_ownership_nft(
    //     &mut self,
    //     collection_id: Principal,
    //     token_id: u128,
    //     to: Principal,
    // ) -> u128 {
    //     if let Some(nft_coll) = self.nfts.get_mut(&collection_id) {
    //         if let Some(nft) = nft_coll.get_mut(&token_id) {
    //             if nft.owner() == ic_cdk::caller() {
    //                 nft.transfer(to);
    //                 token_id
    //             } else {
    //                 // Err(NftError::InvalidOwner)
    //                 panic!("Invalid owner");
    //             }
    //         } else {
    //             // Err(NftError::NftNotFound)
    //             panic!("Nft not found");
    //         }
    //     } else {
    //         // Err(NftError::CollectionNotFound)
    //         panic!("Collection not found");
    //     }
    // }

    // pub fn get_nfts_of(&self, principal: Principal) -> Vec<(Principal, Vec<LocalNft>)> {
    //     self.nfts
    //         .iter()
    //         .map(|(k, v)| {
    //             let nfts = v
    //                 .iter()
    //                 .filter_map(|(_, v)| {
    //                     if v.owner() == principal {
    //                         Some(v)
    //                     } else {
    //                         None
    //                     }
    //                 })
    //                 .cloned()
    //                 .collect();
    //             (k.clone(), nfts)
    //         })
    //         .collect()
    // }

    // pub fn get_all_nfts(&self) -> Vec<(Principal, Vec<LocalNft>)> {
    //     self.nfts
    //         .iter()
    //         .map(|(k, v)| (k.clone(), v.values().cloned().collect()))
    //         .collect()
    // }

    // pub fn get_all_collection_ids(&self) -> Vec<Principal> {
    //     self.nfts.keys().cloned().collect()
    // }

    // pub fn get_collection_id(&self, collection_id: Principal) -> Vec<LocalNft> {
    //     if let Some(coll) = self.nfts.get(&collection_id) {
    //         coll.values().cloned().collect()
    //     } else {
    //         vec![]
    //     }
    // }

    // --- ownership ---
    pub fn is_owner(&self, principal: Principal) -> bool {
        self.owners.get(&principal).cloned().unwrap_or(false)
    }

    pub fn add_owner(&mut self, principal: Principal) {
        self.owners.insert(principal, true);
    }

    pub fn remove_owner(&mut self, principal: Principal) {
        self.owners.remove(&principal);
    }
}
