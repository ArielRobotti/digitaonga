import { proposalParser } from "../utils/parsers";
import useCanister from "./useCanister";
import { useEffect } from "react";
import useProposalStore from "../store/useProposalStore";

const useProposal = () => {
  const [_, dao] = useCanister();
  const { setProposals, proposals, loading } = useProposalStore();

  const getAllProposals = async () => {
    try {
      const res = await dao.get_all_proposals();
      console.log("getAllProposals res:", res);
      // TODO (fran): parse proposals
      const parsed = proposalParser(res);

      setProposals(parsed);
    } catch (err) {
      console.log("getAllProposals error:", err);
    }
  };

  const getProposal = (id) => proposals.find((p) => p.id === id);

  useEffect(() => {
    dao && !proposals.length && getAllProposals();
  }, [dao, proposals]);

  return { proposals, getProposal, loading };
};

export default useProposal;
