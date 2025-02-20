import { CommentIcon, DislikeIcon, LikeIcon } from "../../../components/ui/icons";

import ProposalComment from "../../../components/proposals/ProposalComment";
import React from "react";
import { useParams } from "react-router";

const proposalExample = {
  id: "1",
  title: "Proposal title",
  description:
    "Lorem ipsum dolor sit amet consectetur. Cras at elementum non nulla senectus. Curabitur aliquet egestas tortor elementum non cursus molestie. Faucibus erat ac mauris sociis egestas nibh augue tempus. Eget nec turpis sit sit elit.",
  creator: "Alice",
  status: "Open",
  likes: 10,
  dislikes: 2,
  comments: [
    {
      from: "Bob",
      text: "I like this proposal",
      created_at: 908989899,
      likes: 7,
      dislikes: 1,
      comments: [
        {
          from: "John",
          text: "Lorem ipsum dolor sit amet consectetur. Cras at elementum non nulla senectus. Curabitur aliquet egestas tortor elementum non.",
          created_at: 908989899,
        },
      ],
    },
    {
      from: "Charlie",
      text: "I don't like this proposal",
      created_at: 908989900,
      likes: 1,
      dislikes: 3,
      comments: [],
    },
  ],
};

const ProposalDetail = () => {
  const { id } = useParams();

  // const proposal = useProposal(id);

  return (
    <main>
      <section className="flex justify-between items-center p-6 overflow-hidden">
        <div>
          {/* TODO (fran): ver tema de si el nombre de la proposal es muy largo */}
          <h3 className="uppercase text-clip">{proposalExample.title}</h3>
          <h4 className="uppercase">REF {id}</h4> {/* FIXME (fran): cambiar por proposal.id */}
          <p>Delegate: {proposalExample.creator}</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <span>{proposalExample.status}</span>
          <section className="flex items-center gap-4">
            <h5 className="flex items-center">
              {proposalExample.likes} <LikeIcon />
            </h5>
            <h5 className="flex items-center">
              {proposalExample.dislikes} <DislikeIcon />
            </h5>
            <h5
              className="flex items-center"
              onClick={() =>
                document.getElementById("comments").scrollIntoView({ behavior: "smooth" })
              }
            >
              {proposalExample.comments.length} <CommentIcon />
            </h5>
          </section>
        </div>
      </section>

      <p className="px-6 py-2.5">{proposalExample.description}</p>

      <section className="p-6">
        <h4 className="pb-2.5">IMPACT</h4>
        {/* TODO (fran): ver aca que seria impact */}
        <p>{proposalExample.description}</p>
      </section>

      <section className="p-6" id="comments">
        <h4 className="pb-2.5">COMMENTS</h4>
        <div className="flex gap-4 overflow-x-auto">
          {proposalExample.comments.map((c) => (
            <ProposalComment key={c.created_at} {...c} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default ProposalDetail;
