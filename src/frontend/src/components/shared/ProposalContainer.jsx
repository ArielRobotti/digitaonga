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
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] ml-35 md:grid-cols-[repeat(auto-fill,minmax(530px,1fr))] gap-y-8 gap-x-4  mt-4 px-4">
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
