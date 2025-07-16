import Button from "../../components/shared/Button";
import ProposalContainer from "../../components/shared/ProposalContainer";
import { useNavigate } from "react-router";

const Proposals = () => {
  const navigate = useNavigate();

  return (
    <main className="p-4">
      <section className="mb-6">
        <h4 className="uppercase font-normal">Pending</h4>
        {/* TODO (fran): hacer dinamico cantidad de proposals */}
        <span className="leading-5">8 pending proposals</span>
        <ProposalContainer className="mt-4" status="Open" />
      </section>
      <section className="mb-6">
        <h4 className="font-bold leading-6">Approved</h4>
        {/* TODO (fran): hacer dinamico cantidad de proposals */}
        <span className="leading-5">8 approved proposals</span>
        <ProposalContainer className="mt-4" status="Approved" />
      </section>
      <section className="mb-16">
        <h4 className="font-bold leading-6">Rejected</h4>
        {/* TODO (fran): hacer dinamico cantidad de proposals */}
        <span className="leading-5">8 rejected proposals</span>
        <ProposalContainer className="mt-4" status="Rejected" />
      </section>

      <div className="fixed inset-x-0 bottom-4 flex justify-center">
        <Button
          variant="kokowai"
          className="inline-block"
          onClick={() => navigate("/proposals/create")}
        >
          New proposal
        </Button>
      </div>
    </main>
  );
};

export default Proposals;
