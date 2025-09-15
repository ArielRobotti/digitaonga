import { p2str } from "./functions";
// import { ProposalPublicData } from "../../declarations/backend/motokoDao.did"

export const proposalsArrayParser = (proposals) => proposals.map(proposalParser);

export const proposalParser = (proposal) => ({
  ...proposal,
  // id: BigInt(proposal.id), // Ya es BigInt
  // title: String,
  // description: String,
  // kind: ProposalType,
  // created_at: BigInt(proposal.created_at), // Ya es BigInt
  creator: p2str(proposal.creator),
  status: Object.keys(proposal.status)[0],
  // thread: Vec<ProposalComment>,
  likers: proposal.likes.map((like) => ({
    principal: p2str(like[0]),
    type: Object.keys(like[1])[0],
  })),
  likes: proposal.likes.filter((like) => Object.keys(like[1])[0] === "Like").length,
  dislikes: proposal.likes.filter((like) => Object.keys(like[1])[0] === "Dislike").length,
  // votes: HashMap<Principal, Vote>,
  // deadline: Number(proposal.deadline), // Lo dejamos como BigInt
  active_members: Number(proposal.active_members), 
});

export const memberParser = (m) => ({
  ...m,
  principal: p2str(m.principal),
  role: Object.keys(m.role)[0],
  created_at: Number(m.created_at),
  liked_proposals: m.liked_proposals.map((p) => ({
    id: Number(p[0]),
    type: Object.keys(p[1])[0],
  })),
  last_activity: Number(m.last_activity),
});
