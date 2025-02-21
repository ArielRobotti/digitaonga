import ProposalCard from "./ProposalCard";

const ProposalContainer = ({ className = "" } = {}) => {
  return (
    <section className={className}>
      <div className="flex gap-4 overflow-x-auto py-2">
        <ProposalCard />
        <ProposalCard />
        <ProposalCard />
        <ProposalCard />
      </div>
    </section>
  );
};

export default ProposalContainer;
