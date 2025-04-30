import { p2str } from "./functions";

export const proposalsArrayParser = (proposals) => proposals.map(proposalParser);

export const proposalParser = (proposal) => ({
  ...proposal,
  id: Number(proposal.id),
  // title: String,
  // description: String,
  // kind: ProposalType,
  created_at: Number(proposal.created_at),
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
  deadline: Number(proposal.deadline),
  active_members: Number(proposal.active_members),
});
