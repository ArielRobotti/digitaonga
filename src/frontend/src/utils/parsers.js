import { p2str } from "./functions";

export const proposalParser = (proposals) => {
  return proposals.map((p) => ({
    ...p,
    id: Number(p.id),
    // title: String,
    // description: String,
    // kind: ProposalType,
    created_at: Number(p.created_at),
    creator: p2str(p.creator),
    status: Object.keys(p.status)[0],
    // thread: Vec<ProposalComment>,
    // likes: HashMap<Principal, LikeProposal>,
    // votes: HashMap<Principal, Vote>,
    deadline: Number(p.deadline),
    active_members: Number(p.active_members),
  }));
};
