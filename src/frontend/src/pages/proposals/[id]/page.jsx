import {
  CheckIcon,
  CloseIcon,
  CommentIcon,
  DislikeIcon,
  LikeIcon,
} from "../../../components/ui/icons";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import Button from "../../../components/shared/Button";
import ProposalComment from "../../../components/proposals/ProposalComment";
import StatusBallProposal from "../../../components/shared/StatusBallProposal";
import { p2str } from "../../../utils/functions";
import { useAuth } from "@nfid/identitykit/react";
import { useParams } from "react-router";
import useProposal from "../../../hooks/useProposal";
import { useState } from "react";

const ProposalDetail = () => {
  const { id } = useParams();
  const [vote, setVote] = useState({ value: "", loading: false });
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState({ want: false, text: "" });
  const { user, connect } = useAuth();

  const { getProposal, loading, voteProposal, likeProposal } = useProposal();

  const proposal = getProposal(id);

  if (loading) return <CircularProgress className="absolute top-1/2 left-1/2 " />;

  if (!proposal) {
    return (
      <main className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Proposal not found</h1>
        <p className="text-lg">Please check the proposal ID and try again.</p>
      </main>
    );
  }

  const handleChange = (e) => setVote({ ...vote, value: e.target.value });
  const toggleOpen = () => setOpen(!open);
  const handleComment = (e) =>
    proposal.status === "Open" && setNewComment({ ...newComment, text: e.target.value });

  const handleVote = async () => {
    if (proposal.status !== "Open") return;
    if (!user) return connect();
    setVote({ ...vote, loading: true });

    try {
      const res = await voteProposal(id, vote.value);
      console.log({ res });
      toggleOpen();
    } catch (err) {
      console.log("voteProposal error:", err);
    }

    setVote({ ...vote, loading: false });
  };

  const handleLike = async (type) => {
    if (proposal.status !== "Open") return;
    if (!user) return connect();
    console.log({ type });
    if (proposal.likers.find((l) => l.principal === p2str(user.principal) && l.type === type))
      return;
    await likeProposal(parseInt(id), type);
  };

  return (
    <main>
      <section className="flex justify-between items-center p-6 overflow-hidden">
        <div>
          {/* TODO (fran): ver tema de si el nombre de la proposal es muy largo */}
          <h3 className="uppercase text-clip">{proposal.title}</h3>
          <h4 className="uppercase">REF {id}</h4> {/* FIXME (fran): cambiar por proposal.id */}
          <p>Delegate: {proposal.creator}</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <span className="flex items-center gap-1">
            <StatusBallProposal status={proposal.status} />
            {proposal.status}
          </span>
          <section className="flex items-center gap-4">
            <h5 className="flex items-center cursor-pointer" onClick={() => handleLike("Like")}>
              {proposal.likes} <LikeIcon />
            </h5>
            <h5 className="flex items-center cursor-pointer" onClick={() => handleLike("Dislike")}>
              {proposal.dislikes} <DislikeIcon />
            </h5>
            <h5
              className="flex items-center"
              onClick={() => {
                if (proposal.status !== "Open") return;

                setNewComment({ ...newComment, want: true }) ||
                  document.getElementById("comments").scrollIntoView({ behavior: "smooth" });
              }}
            >
              {proposal.comments.length} <CommentIcon />
            </h5>
          </section>
        </div>
      </section>
      <p className="px-6 py-2.5">{proposal.description}</p>
      <section className="p-6">
        <h4 className="pb-2.5">IMPACT</h4>
        {/* TODO (fran): ver aca que seria impact */}
        <p>{proposal.description}</p>
      </section>
      <section className="p-6" id="comments">
        <h4 className="pb-2.5">COMMENTS</h4>
        <div className="flex gap-4 overflow-x-auto">
          {proposal.comments.map((c) => (
            <ProposalComment key={c.created_at} {...c} />
          ))}
        </div>

        {newComment.want && (
          <>
            <TextField
              placeholder="Comment..."
              multiline
              onChange={handleComment}
              value={newComment.text}
            />

            {newComment.text?.trim()?.length > 0 && (
              <div className="flex justify-end mt-2">
                <Button
                  size="small"
                  variant="kokowai"
                  onClick={() => (user ? console.log("comment") : connect())}
                >
                  {user ? "Comment" : "Log in"}
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {proposal.status === "Open" && (
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
              value={vote.value}
              label="Your vote"
              onChange={handleChange}
              className="material_select"
            >
              <MenuItem value={"Approve"} className="material_menu-item">
                Approve
              </MenuItem>
              <MenuItem value={"Disapprove"} className="material_menu-item">
                Disapprove
              </MenuItem>
              <MenuItem value={"Abstain"} className="material_menu-item">
                Abstain
              </MenuItem>
            </Select>
          </FormControl>

          <Button variant="kokowai" disabled={!vote.value || vote.loading} onClick={handleVote}>
            {!user ? "Log in" : vote.loading ? "Voting..." : "Confirm my vote"}
          </Button>
        </section>
      )}
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
