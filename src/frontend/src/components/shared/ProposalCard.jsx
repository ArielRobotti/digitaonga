import "../../index.css";

import { CommentIcon, DislikeIcon, LikeIcon } from "../ui/icons";

import Button from "./Button";
import StatusBallProposal from "./StatusBallProposal";
import { useNavigate } from "react-router";

const ProposalCard = ({
  title = "Proposal name",
  status = "Open",
  id = 1,
  creator = "akdfa...cai",
  description = "This is a proposal description",
  className = "",
} = {}) => {
  const navigate = useNavigate();

  return (
    <article
      className={`flex flex-col justify-between min-w-[251px] w-min sm:w-fit min-h-[246px] xl:min-h-[298px] rounded-[5px] shadow-digitaonga cursor-pointer ${className} shadow__digitaonga ${
        status === "Approved"
          ? "!bg-light-green"
          : status === "Rejected"
          ? "!bg-light-red"
          : "bg-wheua"
      }`}
      onClick={() => navigate(`/proposals/${id}`)}
    >
      <section className="py-4 px-6">
        <span className="text-kokowai font-medium flex items-center gap-1">
          <StatusBallProposal status={status} />
          {status}
        </span>
        <h5 className="font-bold text-black">{title}</h5>
      </section>

      <section className="py-4 px-6 text-gray-900">
        <p>#{id}</p>
        <p>Delegate: {creator}</p>
      </section>

      <section className="hidden sm:block py-4 px-6">
        <h5>Impact</h5>
        <p>{description}</p>
      </section>

      <section className="flex justify-between items-center p-2.5">
        <div className="flex gap-4">
          <LikeIcon />
          <DislikeIcon />
          <CommentIcon />
        </div>

        {status === "Open" && (
          <Button className="w-fit text-white bg-kokowai shadow-[0px_1px_3px_0px_#0000004D]">
            Vote
          </Button>
        )}
      </section>
    </article>
  );
};

export default ProposalCard;
// box-shadow: 0px 4px 8px 0px #00000040;
