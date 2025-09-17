import { CircularProgress } from "@mui/material";
import ProposalCard from "./ProposalCard";
import useProposal from "../../hooks/useProposal";

const ProposalContainer = ({ className = "", status = "Open" } = {}) => {
  const { proposals, loading } = useProposal();

  return (
    <section className={className}>
      <div className="flex gap-4 overflow-x-auto py-2 xl:flex-wrap">
        {loading ? (
          <CircularProgress />
        ) : (
          proposals
            .filter((p) => p.status === status)
            .map((proposal) => <ProposalCard key={proposal.id} {...proposal} />)
            .reverse()
        )}
      </div>
    </section>
  );
};

export default ProposalContainer;
