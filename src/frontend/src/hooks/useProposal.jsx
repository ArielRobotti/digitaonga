import { proposalParser, proposalsArrayParser } from "../utils/parsers";

import useCanister from "./useCanister";
import { useEffect } from "react";
import useProposalStore from "../store/useProposalStore";

const useProposal = () => {
  const [_, dao] = useCanister();
  const { addProposal, setProposals, proposals, loading } = useProposalStore();

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
    try {
      const res = await dao.create_proposal(title, description, kind, deadline);
      console.log({ res });
      addProposal(proposalParser(res));
    } catch (err) {
      console.log("createProposal error:", err);
    }
  };

  useEffect(() => {
    dao && !proposals.length && getAllProposals();
  }, [dao, proposals]);

  return { proposals, getProposal, loading, createProposal };
};

export default useProposal;
