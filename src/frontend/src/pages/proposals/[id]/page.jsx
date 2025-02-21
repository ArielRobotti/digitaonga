import {
  CheckIcon,
  CloseIcon,
  CommentIcon,
  DislikeIcon,
  LikeIcon,
} from "../../../components/ui/icons";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import Button from "../../../components/shared/Button";
import ProposalComment from "../../../components/proposals/ProposalComment";
import { useParams } from "react-router";
import { useState } from "react";

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
  const [vote, setVote] = useState("");
  const [open, setOpen] = useState(false);

  // const proposal = useProposal(id);

  const handleChange = (e) => setVote(e.target.value);

  const toggleOpen = () => setOpen(!open);

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

      <section className="grid place-items-center gap-4 p-6">
        <div className="bg-kokowai p-2 max-w-[302px] rounded-[5px]">
          <p className="text-white">
            10 votes required to have a quorum and 6 positive votes for passage
          </p>
        </div>

        <FormControl className="max-w-[302px] w-full !mb-12">
          <InputLabel id="vote-select-label">Your vote</InputLabel>
          <Select
            labelId="vote-select-label"
            id="vote-select"
            value={vote}
            label="Your vote"
            onChange={handleChange}
            className="material_select"
          >
            <MenuItem value={"approve"} className="material_menu-item">
              Approve
            </MenuItem>
            <MenuItem value={"disapprove"} className="material_menu-item">
              Disapprove
            </MenuItem>
            <MenuItem value={"abstain"} className="material_menu-item">
              Abstain
            </MenuItem>
          </Select>
        </FormControl>

        <Button variant="kokowai" disabled={!vote} onClick={toggleOpen}>
          Confirm my vote
        </Button>
      </section>

      <Dialog
        open={open}
        onClose={toggleOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="material_dialog"
      >
        <DialogTitle id="alert-dialog-title" className="flex justify-center items-center !pb-0">
          <CheckIcon className="mt-4" />
        </DialogTitle>

        <CloseIcon className="absolute top-2 right-2 cursor-pointer" onClick={toggleOpen} />

        <DialogContent>
          <h5 className="">Proposal voted successfully!</h5>
        </DialogContent>
        <DialogActions className="flex !justify-center">
          <Button size="small" variant="kokowai" onClick={toggleOpen}>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default ProposalDetail;
