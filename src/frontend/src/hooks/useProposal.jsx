import useCanister from "./useCanister";
import { useEffect } from "react";
import useProposalStore from "../store/useProposalStore";

const useProposal = () => {
  const [_, dao] = useCanister();
  const { setProposals, proposals } = useProposalStore();

  const getProposals = async () => {
    try {
      const res = await dao.get_proposals();
      console.log("getProposals res:", res);
      // TODO (fran): parse proposals

      setProposals(res);
    } catch (err) {
      console.error("getProposals error:", err);
    }
  };

  useEffect(() => {
    getProposals();
  }, []);

  return { proposals };
};

export default useProposal;
