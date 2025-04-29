import { proposalParser, proposalsArrayParser } from "../utils/parsers";

import useCanister from "./useCanister";
import { useEffect } from "react";
import useProposalStore from "../store/useProposalStore";

const useProposal = () => {
  const [_, dao] = useCanister();
  const { addProposal, setProposals, proposals, loading, toggleCreating, creating } =
    useProposalStore();

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
      const res = await dao.create_proposal(title, description, kind, deadline);
      console.log({ res });
      addProposal(proposalParser(res));
    } catch (err) {
      console.log("createProposal error:", err);
    }
    toggleCreating();
  };

  const voteProposal = async (id, vote) => {
    try {
      const res = await dao.vote_proposal(id, vote);
      console.log({ res });

      if (res.Ok) {
      } else {
      }
    } catch (err) {
      console.log("voteProposal error:", err);
    }
  };

  useEffect(() => {
    dao && loading && getAllProposals();
  }, [dao, loading]);

  return { proposals, getProposal, loading, createProposal, creating, voteProposal };
};

export default useProposal;
