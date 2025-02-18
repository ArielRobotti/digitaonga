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

      <Button className="bg-kokowai text-white shadow=[0px_4px_8px_0px_#00000026] w-[316px] fixed bottom-4 left-1/2 transform -translate-x-1/2    ">
        New proposal
      </Button>
    </main>
  );
};

export default Proposals;
