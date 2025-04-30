use std::collections::HashMap;

use candid::{CandidType, Principal};
use serde::Deserialize;

use super::{member::MemberRole, shared::LikeProposal};

#[derive(CandidType, Clone, Deserialize)]
pub struct Proposal {
    id: u128,
    title: String,
    description: String,
    kind: ProposalType,
    created_at: u64,
    creator: Principal,
    status: ProposalStatus,
    comments: Vec<ProposalComment>,
    likes: HashMap<Principal, LikeProposal>,
    votes: HashMap<Principal, Vote>,
    deadline: u64,
    active_members: u128, // TODO (fran): para calcular cuantos votaron (quorum and threshold calculations) => en check_proposal_status editar esto si la proposal se cierra
}

impl Proposal {
    // setters
    pub fn build(
        id: u128,
        title: String,
        description: String,
        kind: ProposalType,
        deadline: u64,
        active_members: u128,
    ) -> Self {
        Self {
            id,
            title,
            description,
            kind,
            created_at: ic_cdk::api::time(),
            creator: ic_cdk::caller(),
            status: ProposalStatus::Review,
            comments: Vec::new(),
            likes: HashMap::new(),
            votes: HashMap::new(),
            deadline,
            active_members,
        }
    }

    pub fn edit(&mut self, title: String, description: String, kind: ProposalType) -> Self {
        self.title = title;
        self.description = description;
        self.kind = kind;
        self.clone()
    }

    pub fn new_comment(&mut self, comment: String) {
        self.comments.push(ProposalComment::new(comment));
    }

    pub fn like(&mut self, kind: LikeProposal) {
        self.likes.insert(ic_cdk::caller(), kind);
    }

    pub fn vote(&mut self, vote: Vote) -> Self {
        self.votes.insert(ic_cdk::caller(), vote);
        self.clone()
    }

    // pub fn close(&mut self) {
    //     self.status = ProposalStatus::Closed
    // }

    pub fn approve(&mut self) {
        self.status = ProposalStatus::Approved
    }

    pub fn reject(&mut self) {
        self.status = ProposalStatus::Rejected
    }

    pub fn set_active_members(&mut self, active_members: u128) {
        self.active_members = active_members
    }

    // getters
    pub fn creator(&self) -> Principal {
        self.creator
    }

    pub fn created_at(&self) -> u64 {
        self.created_at
    }

    pub fn kind(&self) -> ProposalType {
        self.kind.clone()
    }

    pub fn deadline(&self) -> u64 {
        self.deadline
    }

    pub fn is_open(&self) -> bool {
        self.status == ProposalStatus::Open
    }

    pub fn is_approve(&self) -> bool {
        self.status == ProposalStatus::Approved
    }

    pub fn approved_votes(&self) -> usize {
        self.votes.values().filter(|v| **v == Vote::Approve).count()
    }

    pub fn disapproved_votes(&self) -> usize {
        self.votes
            .values()
            .filter(|v| **v == Vote::Disapprove)
            .count()
    }

    pub fn abstained_votes(&self) -> usize {
        self.votes.values().filter(|v| **v == Vote::Abstain).count()
    }

    pub fn has_voted(&self, principal: Principal) -> Option<Vote> {
        self.votes.get(&principal).cloned()
    }
}

#[derive(CandidType, Clone, PartialEq, Deserialize)]
pub enum ProposalStatus {
    Review, // TODO (fran): checkear Review status
    Open,
    Voting,
    // Closed,
    Approved,
    Rejected,
}

#[derive(CandidType, Clone, PartialEq, Deserialize)]
pub enum Vote {
    Approve,
    Disapprove,
    Abstain,
}

#[derive(CandidType, Clone, Deserialize, PartialEq)]
pub enum ProposalType {
    DigitalTaonga(DigitalTaongaProposal),
    Action(ActionProposal),
    Guardian(GuardianProposal),
    Motion(MotionProposal),
}

#[derive(CandidType, Clone, Deserialize, PartialEq)]
pub enum DigitalTaongaProposal {
    CreateDigitalTaonga(String, String, String, u64, String), // name, description, history, deadline, image id
    UpdateDigitalTaonga(UpdateDigitalTaongaProposal),
    DeleteDigitalTaonga(u64), // [?] CHECK si es u64 o u128 // id
    RequestDownloadPermision, // TODO (fran): preguntar por este tipo de proposal
}

#[derive(CandidType, Clone, Deserialize, PartialEq)]
pub struct ActionProposal(pub String, pub String, pub u64); // title, description, deadline

#[derive(CandidType, Clone, Copy, Deserialize, PartialEq)]
pub enum MotionProposal {}

#[derive(CandidType, Clone, Deserialize, PartialEq)]
pub enum GuardianProposal {
    AssignAsObserver(Principal, u64), // principal, deadline
    RemoveFromDao(Principal, u64),    // principal, deadline
                                      // UpdateGuardianRole(Principal, MemberRole),
}

#[derive(CandidType, Clone, Deserialize, PartialEq)]
pub enum UpdateDigitalTaongaProposal {
    UpdateDescription(String),
    UpdateImageURL(String),
}

#[derive(CandidType, Clone, Deserialize, PartialEq)]
pub struct MintNftParams {
    pub collection_id: Principal,
    pub to: Principal,
    pub name: String,
    pub description: String,
    pub image: String,
}

#[derive(CandidType, Clone, Deserialize)]
pub enum ProposalError {
    NotFound,
    Unauthorized,
    LastAdmin,
    Closed,
}

pub type ProposalResult = Result<Proposal, ProposalError>;

#[derive(CandidType, Clone, Deserialize)]
pub struct ProposalComment {
    creator: Principal,
    created_at: u64,
    comment: String,
    thread: Vec<ProposalComment>,
    likes: u64,
    dislikes: u64,
}

impl ProposalComment {
    pub fn new(comment: String) -> Self {
        Self {
            creator: ic_cdk::caller(),
            created_at: ic_cdk::api::time(),
            comment,
            thread: vec![],
            likes: 0,
            dislikes: 0,
        }
    }

    // TODO (fran): agregar a lib.rs este y los de abajo
    pub fn comment_in_thread(&mut self, comment: String) {
        self.thread.push(ProposalComment {
            creator: ic_cdk::caller(),
            created_at: ic_cdk::api::time(),
            comment,
            thread: vec![],
            likes: 0,
            dislikes: 0,
        });
    }

    pub fn like(&mut self) {
        self.likes += 1;
    }

    pub fn dislikes(&mut self) {
        self.dislikes += 1;
    }
}
