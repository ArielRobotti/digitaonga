import { CircularProgress } from "@mui/material";
import ProposalCard from "./ProposalCard";
import useProposal from "../../hooks/useProposal";

const ProposalContainer = ({ 
  className = "", 
  status = "Open" 
  } = {}) => {
  const { proposals, loading } = useProposal();

  return (
    <section className={className}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 mt-4 px-4">
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
