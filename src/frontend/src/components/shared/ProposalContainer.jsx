import { CircularProgress } from "@mui/material";
import ProposalCard from "./ProposalCard";
import useProposal from "../../hooks/useProposal";

const ProposalContainer = ({ className = "" } = {}) => {
  const { proposals, loading } = useProposal();

  return (
    <section className={className}>
      <div className="flex gap-4 overflow-x-auto py-2">
        {loading ? (
          <CircularProgress />
        ) : (
          proposals.map((proposal) => <ProposalCard key={proposal.id} {...proposal} />)
        )}
      </div>
    </section>
  );
};

export default ProposalContainer;
