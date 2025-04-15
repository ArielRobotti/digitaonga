use std::{cell::RefCell, str::FromStr};

use candid::Principal;
use ic_cdk::{query, update};
use state::{
    member::{Member, MemberError, MemberResult, MemberRole},
    nft::{LocalNft, Nft},
    proposal::{ActionType, MintNftParams, Proposal, ProposalResult, ProposalType, Vote},
    shared::LikeProposal,
    State,
};
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
fn edit_member(profile_pic: Option<String>, cover_img: Option<String>) -> MemberResult {
    borrow_mut(|state| state.edit_member(profile_pic, cover_img))
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
#[update(guard = "only_admin")]
fn create_proposal(
    title: String,
    description: String,
    kind: ProposalType,
    deadline: u64,
) -> Proposal {
    borrow_mut(|state| state.new_proposal(title, description, kind, deadline))
}

#[update]
fn edit_proposal(
    id: u128,
    title: String,
    description: String,
    kind: ProposalType,
) -> Option<Proposal> {
    borrow_mut(|state| state.edit_proposal(id, title, description, kind))
}

#[update(guard = "only_approved_member")]
fn new_comment_proposal(id: u128, comment: String) {
    borrow_mut(|state| state.new_comment_proposal(id, comment))
}

#[update(guard = "only_approved_member")]
fn like_proposal(id: u128, kind: LikeProposal) {
    borrow_mut(|state| state.like_proposal(id, kind))
}

#[update(guard = "only_approved_member")]
fn vote_proposal(id: u128, vote: Vote) -> ProposalResult {
    borrow_mut(|state| state.vote_proposal(id, vote))
}

#[update]
async fn check_proposal_status(id: u128) -> ProposalResult {
    let res = borrow_mut(|state| state.check_proposal_status(id));

    // check to mint new nft
    if let Ok(proposal) = &res {
        if proposal.is_approve() {
            if let ProposalType::Action(ActionType::MintNFT(MintNftParams {
                collection_id,
                to,
                name,
                description,
                image,
            })) = proposal.kind()
            {
                let nft = Nft::new(collection_id);
                let token_id = borrow(|s| s.get_collection_id(collection_id).len() as u128);
                let _mint_res = nft
                    .icrcX_mint(
                        token_id,
                        // to,
                        // FIXME (fran): aca iria el ledger canister id
                        Principal::from_str("s").unwrap(),
                        name.clone(),
                        description.clone(),
                        image.clone(),
                    )
                    .await;

                borrow_mut(|s| {
                    s.mint_local_nft(collection_id, token_id, to, name, description, image)
                });
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
fn has_voted(id: u128) -> Option<Vote> {
    borrow(|state| state.has_voted(id))
}

// ---- nft ----
#[update]
fn transfer_ownership_nft(collection_id: Principal, token_id: u128, to: Principal) -> u128 {
    borrow_mut(|s| s.transfer_ownership_nft(collection_id, token_id, to))
}

#[query]
pub fn get_all_nfts() -> Vec<(Principal, Vec<LocalNft>)> {
    borrow(|s| s.get_all_nfts())
}

#[query]
pub fn get_all_collection_ids() -> Vec<Principal> {
    borrow(|s| s.get_all_collection_ids())
}

#[query]
pub fn get_collection_id(collection_id: Principal) -> Vec<LocalNft> {
    borrow(|s| s.get_collection_id(collection_id))
}

#[query]
pub fn get_nfts_of(principal: Principal) -> Vec<(Principal, Vec<LocalNft>)> {
    borrow(|s| s.get_nfts_of(principal))
}

// FIXME (fran): borrar en produccion
// ---- TEST ----
#[update]
pub async fn test_mint_nft(
    collection_id: Principal,
    token_id: u128,
    owner: Principal,
    name: String,
    description: String,
    image: String,
) -> u128 {
    let nft = Nft::new(collection_id);

    let mint_res = nft
        .icrcX_mint(token_id, owner, name, description, image)
        .await;

    mint_res
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
