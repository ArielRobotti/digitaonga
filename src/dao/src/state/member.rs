use std::collections::HashMap;

use candid::{CandidType, Principal};
use serde::Deserialize;

use super::shared::LikeProposal;

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

impl Member {
    pub fn new(role: Option<MemberRole>) -> Self {
        let now = ic_cdk::api::time();

        Self {
            principal: ic_cdk::caller(),
            role: role.unwrap_or(MemberRole::Viewer),
            created_at: now,
            profile_pic: "".to_string(),
            cover_img: "".to_string(),
            liked_proposals: HashMap::new(),
            last_activity: now,
        }
    }

    pub fn edit(&mut self, profile_pic: Option<String>, cover_img: Option<String>) -> Self {
        self.profile_pic = profile_pic.unwrap_or(self.profile_pic.clone());
        self.cover_img = cover_img.unwrap_or(self.cover_img.clone());
        self.clone()
    }

    pub fn change_role(&mut self, role: MemberRole) -> Self {
        self.role = role;
        self.clone()
    }

    pub fn like_proposal(&mut self, id: u128, kind: LikeProposal) {
        self.liked_proposals.insert(id, kind);
    }

    pub fn invite(&mut self, role: MemberRole) {
        self.role = MemberRole::PendingMember(Box::new(role));
    }

    pub fn set_last_activity(&mut self) {
        self.last_activity = ic_cdk::api::time();
    }

    // getters

    // pub fn is_delegate(&self) -> bool {
    //     self.role == MemberRole::Delegate
    // }

    pub fn role(&self) -> MemberRole {
        self.role.clone()
    }

    pub fn is_admin(&self) -> bool {
        self.role == MemberRole::Admin
    }

    pub fn is_viewer(&self) -> bool {
        self.role == MemberRole::Viewer
    }

    // pub fn is_pending_invitation(&self) -> bool {
    //     self.role == MemberRole::PendingInvitation
    // }

    pub fn is_pending_member(&self) -> bool {
        if let MemberRole::PendingMember(_) = self.role {
            true
        } else {
            false
        }
    }

    pub fn is_approved_member(&self) -> bool {
        match self.role {
            MemberRole::Viewer | MemberRole::PendingMember(_) => false,
            _ => true,
        }
    }

    pub fn is_nft_creator(&self) -> bool {
        if let MemberRole::NFTCreator = self.role {
            true
        } else {
            false
        }
    }

    pub fn is_admin_or_nft_creator(&self) -> bool {
        match self.role {
            MemberRole::Admin | MemberRole::NFTCreator => true,
            _ => false,
        }
    }

    pub fn next_role(&self) -> MemberRole {
        if let MemberRole::PendingMember(r) = &self.role {
            r.as_ref().clone()
        } else {
            self.role.clone()
        }
    }

    pub fn is_active(&self) -> bool {
        let now = ic_cdk::api::time();
        let two_weeks = 2 * 7 * 24 * 60 * 60 * 1_000_000_000; // Two weeks in nanoseconds

        self.last_activity + two_weeks > now
    }
}

#[derive(CandidType, Clone, PartialEq, Deserialize)]
pub enum MemberRole {
    Viewer, // when user is created
    // PendingInvitation, // when someone invite you to be member
    PendingMember(Box<MemberRole>), // when the voting was accepted
    // Member,
    // Candidate,
    // Delegate,
    // Partner,
    Admin,
    Voter,
    NFTCreator,
}

#[derive(CandidType, Clone)]
pub enum MemberError {
    NotFound,
    MemberIsNotViewer,
    MemberIsNotPendingMember,
    NotOnlyOneMember,
}

pub type MemberResult = Result<Member, MemberError>;
