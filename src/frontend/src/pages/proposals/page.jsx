import Button from "../../components/shared/Button";
import ProposalContainer from "../../components/shared/ProposalContainer";

const Proposals = () => {
  return (
    <main className="p-4">
      <section className="mb-6">
        <h4 className="uppercase font-normal">Pending</h4>
        {/* TODO (fran): hacer dinamico cantidad de proposals */}
        <span className="leading-5">8 pending proposals</span>
        <ProposalContainer className="mt-4" />
      </section>
      <section className="mb-6">
        <h4 className="font-bold leading-6">Approved</h4>
        {/* TODO (fran): hacer dinamico cantidad de proposals */}
        <span className="leading-5">8 approved proposals</span>
        <ProposalContainer className="mt-4" />
      </section>
      <section className="mb-16">
        <h4 className="font-bold leading-6">Rejected</h4>
        {/* TODO (fran): hacer dinamico cantidad de proposals */}
        <span className="leading-5">8 rejected proposals</span>
        <ProposalContainer className="mt-4" />
      </section>

      <Button
        variant="kokowai"
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10"
        onClick={() => navigate("/proposals/create")}
      >
        New proposal
      </Button>
    </main>
  );
};

export default Proposals;
