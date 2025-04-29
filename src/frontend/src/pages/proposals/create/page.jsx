import ActionCard from "../../../components/proposals/create/ActionCard";
import Button from "../../../components/shared/Button";
import ProgressBar from "../../../components/shared/ProgressBar";
import { proposalTypes } from "../../../utils/data";
import { useNavigate } from "react-router";
import { useState } from "react";

const CreateProposal = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const navigate = useNavigate();

  // TODO (fran): validar datos de form antes de seguir

  const handleRadioChange = (e) => setSelectedValue(e.target.value);

  return (
    <main>
      <h4 className="uppercase p-6">{"Create a new Proposal"}</h4>

      <section className="grid gap-4 p-10">
        {proposalTypes.map((p) => (
          <ActionCard
            key={p.title}
            {...p}
            selectedValue={selectedValue}
            handleRadioChange={handleRadioChange}
          />
        ))}
      </section>

      <div className="absolute bottom-[72px] left-1/2 transform -translate-x-1/2 grid gap-8 z-0 place-items-center">
        <Button
          className="shadow-[0px_4px_8px_0px_#00000026,0px_1px_3px_0px_#0000004c] border-none"
          variant="kokowai"
          onClick={() => navigate(`/proposals/create/${selectedValue}`)}
          disabled={!selectedValue}
        >
          Next
        </Button>
        <ProgressBar step={0} totalSteps={4} />
      </div>
    </main>
  );
};

export default CreateProposal;
