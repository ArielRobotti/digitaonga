use std::collections::HashMap;

use candid::{CandidType, Principal};
use ic_cdk::api::call::CallResult;
use serde::Deserialize;

#[derive(CandidType, Clone, Deserialize)]
pub struct Dao(Principal);

impl Dao {
    pub fn init(canister_id: Principal) -> Self {
        Self(canister_id)
    }

    pub async fn get_member(&self, principal: Principal) -> Result<Member, std::fmt::Error> {
        let member_res: CallResult<(MemberResult,)> =
            ic_cdk::call(self.0, "get_member", (principal,)).await;

        match member_res {
            Ok(res) => match res.0 {
                Ok(m) => Ok(m),
                Err(e) => panic!("get_member error: {:?}", e),
            },
            Err(e) => panic!("get_member methdod error.\nCode: {:?}. {}", e.0, e.1),
        }
    }
}

#[derive(CandidType, Clone, Deserialize)]
pub struct Member {
    principal: Principal,
    role: MemberRole,
    created_at: u64,
    profile_pic: String,
    cover_img: String,
    // liked_proposals: Vec<u128>, // TODO (fran): ver si hay algo mejor que vec. y hacer methods
    liked_proposals: HashMap<u128, LikeProposal>,
    last_activity: u64, // TODO (fran): ver si la ultima actividad es solo login o ke
}

#[derive(CandidType, Clone, Copy, PartialEq, Deserialize)]
pub enum MemberRole {
    Viewer, // when user is created
    // PendingInvitation, // when someone invite you to be member
    PendingMember, // when the voting was accepted
    Member,
    Candidate,
    Delegate,
    Partner,
}

#[derive(CandidType, Clone, Deserialize)]
pub enum LikeProposal {
    Like,
    Dislike,
}

#[derive(CandidType, Clone, Deserialize, Debug)]
pub enum MemberError {
    NotFound,
    MemberIsNotViewer,
    MemberIsNotPendingMember,
}

pub type MemberResult = Result<Member, MemberError>;
