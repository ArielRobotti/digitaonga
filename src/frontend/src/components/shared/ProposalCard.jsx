import "../../index.css";

import { CommentIcon, DislikeIcon, LikeIcon } from "../ui/icons";

import Button from "./Button";
import { useNavigate } from "react-router";

const ProposalCard = ({
  title = "Proposal name",
  status = "Pending",
  id = 1,
  creator = "akdfa...cai",
  className = "",
} = {}) => {
  const navigate = useNavigate();

  return (
    <article
      className={`flex flex-col justify-between min-w-[251px] min-h-[246px] xl:min-h-[298px] rounded-[5px] bg-wheua shadow-digitaonga cursor-pointer ${className} shadow__digitaonga`}
      onClick={() => navigate(`/proposals/${id}`)}
    >
      <section className="py-4 px-6">
        <span className="text-kokowai font-medium">{status}</span>
        <h5 className="font-bold text-black">{title}</h5>
      </section>

      <section className="py-4 px-6 text-gray-900">
        <p>#{id}</p>
        <p>Delegate: {creator}</p>
      </section>

      <section className="flex justify-between items-center p-2.5">
        <div className="flex gap-4">
          <LikeIcon />
          <DislikeIcon />
          <CommentIcon />
        </div>

        <Button className="w-fit text-white bg-kokowai shadow-[0px_1px_3px_0px_#0000004D]">
          Vote
        </Button>
      </section>
    </article>
  );
};

export default ProposalCard;
// box-shadow: 0px 4px 8px 0px #00000040;
