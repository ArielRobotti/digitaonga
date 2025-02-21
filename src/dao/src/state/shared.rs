use candid::CandidType;
use serde::Deserialize;

#[derive(CandidType, Clone, Deserialize)]
pub enum LikeProposal {
    Like,
    Dislike,
}
