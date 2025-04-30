import { proposalParser, proposalsArrayParser } from "../utils/parsers";

import { p2str } from "../utils/functions";
import { useAuth } from "@nfid/identitykit/react";
import useCanister from "./useCanister";
import { useEffect } from "react";
import useProposalStore from "../store/useProposalStore";

const useProposal = () => {
  const [daoAuth, dao] = useCanister();
  const { user } = useAuth();
  const {
    addProposal,
    setProposals,
    proposals,
    loading,
    toggleCreating,
    creating,
    likeProposal: likeP,
    dislikeProposal,
  } = useProposalStore();

  const getAllProposals = async () => {
    try {
      const res = await dao.get_all_proposals();
      console.log("getAllProposals res:", res);
      // TODO (fran): parse proposals
      const parsed = proposalsArrayParser(res);

      setProposals(parsed);
    } catch (err) {
      console.log("getAllProposals error:", err);
    }
  };

  const getProposal = (id) => proposals.find((p) => p.id === id);

  const createProposal = async ({ title, description, kind, deadline }) => {
    toggleCreating();
    try {
      const res = await daoAuth.create_proposal(title, description, kind, deadline);
      console.log({ res });
      addProposal(proposalParser(res));
    } catch (err) {
      console.log("createProposal error:", err);
    }
    toggleCreating();
  };

  const voteProposal = async (id, vote) => {
    try {
      const res = await daoAuth.vote_proposal(id, { [vote]: null });
      console.log({ res });

      if (res.Ok) {
      } else {
      }
    } catch (err) {
      console.log("voteProposal error:", err);
    }
  };

  const likeProposal = async (id, type) => {
    try {
      if (type === "Like") {
        likeP(id, p2str(user.principal));
      } else {
        dislikeProposal(id, p2str(user.principal));
      }
      const res = await daoAuth.like_proposal(id, { [type]: null });
      console.log({ res });
    } catch (err) {
      console.log("likeProposal error:", err);
    }
  };

  useEffect(() => {
    dao && loading && getAllProposals();
  }, [dao, loading]);

  return { proposals, getProposal, loading, createProposal, creating, voteProposal, likeProposal };
};

export default useProposal;
