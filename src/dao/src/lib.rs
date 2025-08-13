use std::cell::RefCell;

use candid::Principal;
use ic_cdk::{query, update};

use instructions::DigitalAsset;
use state::{
    member::{Member, MemberError, MemberResult, MemberRole},
    proposal::{Proposal, ProposalResult, ProposalType, Vote},
    shared::LikeProposal,
    State,
};

use crate::state::proposal::{ActionProposal, DigitalTaongaProposal};

mod instructions;
mod state;

thread_local! {
    static STATE: RefCell<State> = RefCell::default();
}

#[ic_cdk::init]
fn init() {
    borrow_mut(|state| state.init());
}

// ---- members ----
#[update]
fn create_member() -> Member {
    borrow_mut(|state| {
        state
            .get_member(ic_cdk::caller())
            .map_or_else(|_| state.new_member(), |member| member)
    })
}

#[update]
fn edit_member(
    profile_pic: Option<String>,
    cover_img: Option<String>,
    name: Option<String>,
) -> MemberResult {
    borrow_mut(|state| state.edit_member(profile_pic, cover_img, name))
}

#[update]
fn set_last_activity_member() {
    borrow_mut(|state| state.set_last_activity_member())
}

#[update]
fn accept_member_invitation() -> MemberResult {
    borrow_mut(|state| state.accept_invitation())
}

#[update]
fn reject_member_invitation() -> MemberResult {
    borrow_mut(|state| state.reject_invitation())
}

#[update]
fn batch_update_member_role(
    member_list: Vec<Principal>,
    new_role: MemberRole,
) -> Result<Vec<Principal>, MemberError> {
    borrow_mut(|s| s.batch_update_member_role(member_list, new_role))
}

#[query]
fn get_member(principal: Principal) -> MemberResult {
    borrow(|state| state.get_member(principal))
}

#[query]
fn get_all_members() -> Vec<Member> {
    borrow(|state| state.get_all_members())
}

#[query]
fn get_active_members() -> Vec<Member> {
    borrow(|s| s.get_active_members())
}

// ---- proposals ----
#[update(/* guard = "only_admin" */)] // TODO (fran): descomentar esto!! testing
fn create_proposal(
    title: String,
    description: String,
    kind: ProposalType,
    deadline: u64,
) -> Proposal {
    borrow_mut(|state| state.new_proposal(title, description, kind, deadline))
}

#[update]
async fn edit_proposal(
    id: u128,
    title: String,
    description: String,
    kind: ProposalType,
) -> Option<Proposal> {
    let _ = check_proposal_status(id).await;
    borrow_mut(|state| state.edit_proposal(id, title, description, kind))
}

#[update/* (guard = "only_approved_member") */] // FIXME (fram): remover esto! solo testing
async fn new_comment_proposal(id: u128, comment: String) {
    let _ = check_proposal_status(id).await;
    borrow_mut(|state| state.new_comment_proposal(id, comment))
}

#[update/* (guard = "only_approved_member") */] // FIXME (fram): remover esto! solo testing
async fn like_proposal(id: u128, kind: LikeProposal) {
    let _ = check_proposal_status(id).await;
    borrow_mut(|state| state.like_proposal(id, kind))
}

#[update/* (guard = "only_approved_member") */] // FIXME (fram): remover esto! solo testing
async fn vote_proposal(id: u128, vote: Vote) -> ProposalResult {
    check_proposal_status(id).await?;
    borrow_mut(|state| state.vote_proposal(id, vote))
}

#[update]
async fn check_proposal_status(id: u128) -> ProposalResult {
    let res = borrow_mut(|state| state.check_proposal_status(id));

    // check to mint new nft
    if let Ok(proposal) = &res {
        if proposal.is_approve() {
            match proposal.kind() {
                ProposalType::Action(ActionProposal(_, _, _)) => {
                    // TODO (fran): ver esto
                }
                ProposalType::Motion(_) => {
                    // TODO (fran): - Motion Proposals are non-binding and typically require minimal data
                }
                ProposalType::DigitalTaonga(DigitalTaongaProposal::CreateDigitalTaonga(
                    name,
                    description,
                    history,
                    deadline,
                    image,
                )) => {
                    // TODO (fran): completar kind
                    let digital_asset = DigitalAsset::new(
                        Principal::from_text("3og7u-miaaa-aaaal-qsrzq-cai").unwrap(), // mainnet
                                                                                      // Principal::from_text("u6s2n-gx777-77774-qaaba-cai").unwrap(), // local
                    );

                    digital_asset
                        .mint(
                            ic_cdk::id(),
                            name.clone(),
                            name,
                            description,
                            history,
                            image,
                            None,
                        )
                        .await;
                }
                _ => {}
            }
        }
    }

    res
}

#[query]
fn get_proposal(id: u128) -> Option<Proposal> {
    borrow(|state| state.get_proposal(id))
}

#[query]
fn get_all_proposals() -> Vec<Proposal> {
    borrow(|state| state.get_all_proposals())
}

#[query]
fn get_proposals_by_member(principal: Principal) -> Vec<Proposal> {
    borrow(|state| state.get_proposals_by_member(principal))
}

#[query]
fn has_voted(id: u128) -> Option<Vote> {
    borrow(|state| state.has_voted(id))
}

// ---- nft ----
// #[update]
// fn transfer_ownership_nft(collection_id: Principal, token_id: u128, to: Principal) -> u128 {
//     borrow_mut(|s| s.transfer_ownership_nft(collection_id, token_id, to))
// }

// #[query]
// pub fn get_all_nfts() -> Vec<(Principal, Vec<LocalNft>)> {
//     borrow(|s| s.get_all_nfts())
// }

// #[query]
// pub fn get_all_collection_ids() -> Vec<Principal> {
//     borrow(|s| s.get_all_collection_ids())
// }

// #[query]
// pub fn get_collection_id(collection_id: Principal) -> Vec<LocalNft> {
//     borrow(|s| s.get_collection_id(collection_id))
// }

// #[query]
// pub fn get_nfts_of(principal: Principal) -> Vec<(Principal, Vec<LocalNft>)> {
//     borrow(|s| s.get_nfts_of(principal))
// }

// FIXME (fran): borrar en produccion
// ---- TEST ----
#[update]
pub async fn test_mint_asset_digital(
    collection_id: Principal,
    to: Principal,
    name: String,
    symbol: String,
    description: String,
    history: String,
    image: String,
    token_uri: Option<String>,
) {
    let asset = DigitalAsset::new(collection_id);
    asset
        .mint(to, name, symbol, description, history, image, token_uri)
        .await;
}
// ---- end TEST ----

// ---- only owner methods ----
#[update(guard = "only_owner")]
fn add_owner(principal: Principal) {
    borrow_mut(|state| state.add_owner(principal))
}

#[update(guard = "only_owner")]
fn remove_owner(principal: Principal) {
    borrow_mut(|state| state.remove_owner(principal))
}

// ---- modifiers / guard ----
fn only_owner() -> Result<(), String> {
    borrow(|state| {
        state
            .is_owner(ic_cdk::caller())
            .then_some(())
            .ok_or("Only owner can call this method".to_string())
    })
}

fn only_admin() -> Result<(), String> {
    borrow(|state| {
        state.get_member(ic_cdk::caller()).map_or_else(
            |_| Err("Only delegate can call this method".to_string()),
            |member| {
                member
                    .is_admin()
                    .then_some(())
                    .ok_or("Only delegate can call this method".to_string())
            },
        )
    })
}

fn only_approved_member() -> Result<(), String> {
    borrow(|state| {
        state.get_member(ic_cdk::caller()).map_or_else(
            |_| Err("Only approved members can call this method".to_string()),
            |m| {
                if m.is_approved_member() {
                    Ok(())
                } else {
                    Err("Only approved members can call this method".to_string())
                }
            },
        )
    })
}

// fn only_admin_or_nft_creator() -> Result<(), String> {
//     borrow(|s| {
//         s.get_member(ic_cdk::caller()).map_or_else(
//             |_| Err("Only delegate can call this method".to_string()),
//             |m| {
//                 m.is_admin_or_nft_creator()
//                     .then_some(())
//                     .ok_or("Only delegate can call this method".to_string())
//             },
//         )
//     })
// }

// --- ONLY TEST ---
// FIXME: REMOVE in production

#[update]
async fn test_approve_proposal(id: u128) -> () {
    let _ = borrow_mut(|state| state.approve_proposal(id));

    let _ = check_proposal_status(id).await;
}

#[update]
fn test_reject_proposal(id: u128) -> ProposalResult {
    borrow_mut(|state| state.reject_proposal(id))
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
    STATE.with(|state| ic_cdk::storage::stable_save((state,)).unwrap());
}

#[ic_cdk::post_upgrade]
fn post_upgrade() {
    let (state,): (State,) = ic_cdk::storage::stable_restore().unwrap();
    borrow_mut(|s| *s = state);
}
// Enable Candid export
ic_cdk::export_candid!();
