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
import { CommentSection } from "../../../components/CommentSection"
import StatusBallProposal from "../../../components/shared/StatusBallProposal";
import { useAuth } from "@nfid/identitykit/react";
import { useParams } from "react-router";
import useCanister from "../../../hooks/useCanister";
import { useState, useEffect, useRef } from "react";
import ProposalVotingStatus from "../../../components/ProposalVotingStatus";
// import { useNavigate } from "react-router";
// import ProposalComment from "../../../components/proposals/ProposalComment";
// import { Principal } from "@dfinity/principal";
// import useProposal from "../../../hooks/useProposal";
// import { p2str } from "../../../utils/functions";

const ProposalDetail = () => {
  const { id } = useParams();
  const [vote, setVote] = useState({ value: "", loading: false });
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState({ want: false, text: "" });
  const [comments, setComments] = useState([]);
  const [commentsQty, setCommentsQty] = useState(0)
  const [proposal, setProposal] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userVote, setUserVote] = useState(null)
  const loading = useRef(true)
  const { user, connect } = useAuth();
  const [dao] = useCanister()

  const countTotalComments = (list) => {
    let count = 0;
    let currentList = list;
    // Iteramos sobre el nivel actual de la lista vinculada (head, tail)
    while (currentList.length > 0) {
      // La estructura es: [[headComment, tailList]]
      const [[headComment, tailList]] = currentList;
      // 1. Contar el comentario actual (el head)
      count += 1;
      // 2. Sumar los subcomentarios recursivamente
      if (headComment.subComments && headComment.subComments.length > 0) {
        count += countTotalComments(headComment.subComments);
      }
      // 3. Mover al siguiente elemento de la lista (el tail)
      currentList = tailList;
    }
    return count;
  }

  const shortPrincipal = (p) => {
    return p.slice(0, 5) + "..." + p.slice(p.length - 5, p.length)
  }

  useEffect(() => {
    const fetchProposal = async () => {
      loading.current = true

      const response = await dao.get_proposal(BigInt(id))
      if ("Ok" in response) {
        setUserVote(response.Ok.callerVote[0])
        setProposal(response.Ok.proposal);
        setComments(response.Ok.proposal.comments)
        setLikes(response.Ok.proposal.likes.filter(item => 'Like' in item[1]).length)
        setDislikes(response.Ok.proposal.likes.filter(item => 'Dislike' in item[1]).length)
        setCommentsQty(countTotalComments(response.Ok.proposal.comments))
      }

      loading.current = false
    }
    if (dao) { fetchProposal() }
  }, [dao])


  if (!proposal) {
    return loading.current
      ? <CircularProgress className="absolute top-1/2 left-1/2 " />
      : (<main className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Proposal not found</h1>
        <p className="text-lg">Please check the proposal ID and try again.</p>
      </main>)
      ;
  }

  const handleChange = (e) => setVote({ ...vote, value: e.target.value });
  const toggleOpen = () => setOpen(!open);

  const handleVote = async () => {
    if (!("Open" in proposal.status)) return;
    if (!user) return connect();
    setVote({ ...vote, loading: true });

    const options = {
      Approve: { Approve: null },
      Abstain: { Abstain: null },
      Disapprove: { Disapprove: null },
    }

    const response = await dao.vote_proposal(BigInt(id), options[vote.value])
    console.log(response)

    setVote({ ...vote, loading: false });
  };

  const onNewComment = async (msg, path) => {
    const newComment = {
      proposalId: BigInt(id),
      msg,
      path
    };
    const response = await dao.new_comment_proposal(newComment)
    if (response) {
      setComments(response)
      setCommentsQty(countTotalComments(response))
    }
  }

  const handleLike = async (type) => {
    if (!("Open" in proposal.status)) return;
    if (!user) return connect();

    const options = {
      Like: { Like: null },
      Dislike: { Dislike: null },
    };
    const response = await dao.like_proposal(BigInt(id), options[type])
    if (response[0]) {
      console.log(response[0])
      setProposal(response[0])
      setLikes(response[0].likes.filter(item => 'Like' in item[1]).length)
      setDislikes(response[0].likes.filter(item => 'Dislike' in item[1]).length)
    }
  };

  return (
    <main
      className=""
      style={{ fontFamily: "poppins" }}
    >
      {proposal &&
        <div className="h-full flex flex-col">
          <div className="h-full flex flex-col items-center">
            <ProposalVotingStatus
              className={"center w-full md:w-[80vw] md:px-20"}
              activeMembers={proposal.active_members}
              partialResults={proposal.partialResults}
              deadline={proposal.deadline}
              // participationRequired={20}
              status={Object.keys(proposal.status)[0]}
              majorityRequired={50}
            />
          </div>

          <div className="h-full flex flex-col items-center">

            <section className="w-full md:w-[80vw] flex justify-between items-center px-4 md:px-40 overflow-hidden">
              <div className="space-y-1">
                {/* Título Principal */}
                <h3 className="uppercase text-clip text-[18px] md:text-[28px] font-bold">
                  {proposal.title}
                </h3>

                {/* Contenedor de Metadatos Alineados */}
                <div className="mt-4 space-y-1">

                  {/* Campo 1: ID */}
                  <div className="flex flex-col md:flex-row">
                    <p className="w-30 flex-shrink-0">ID:</p>
                    <span className="font-semibold  ml-2 md:ml-6">{id}</span>
                  </div>

                  {/* Campo 2: GUARDIAN ID */}
                  <div className="flex flex-col md:flex-row">
                    <span className="w-30 flex-shrink-0">GUARDIAN ID:</span>
                    <span className="font-semibold ml-2 md:ml-6">{shortPrincipal(proposal.creator.toString())}</span>
                  </div>

                  {/* Campo 3: Guardian Name */}
                  <div className="flex flex-col md:flex-row">
                    <span className="flex-shrink-0">GUARDIAN NAME:</span>
                    <span className="font-semibold  ml-2 md:ml-6">{proposal.creatorName[0] ? proposal.creatorName[0] : "No Name"}</span>
                  </div>

                </div>
              </div>


              <div className="flex flex-col items-center gap-2 md:gap-4 my-20" >
                <span className="flex items-center gap-1">
                  <StatusBallProposal status={Object.keys(proposal.status)[0]} />
                  {Object.keys(proposal.status)[0]}
                </span>
                <section
                  className="flex items-center gap-2 md:gap-4"

                >
                  <h5 className="flex items-center cursor-pointer gap-2" onClick={() => handleLike("Like")}>
                    {likes} <LikeIcon />
                  </h5>
                  <h5 className="flex items-center cursor-pointer gap-2" onClick={() => handleLike("Dislike")}>
                    {dislikes} <DislikeIcon />
                  </h5>
                  <h5
                    className="flex items-center gap-2 "
                    onClick={() => {
                      if (proposal.status !== "Open") return;

                      setNewComment({ ...newComment, want: true }) ||
                        document.getElementById("comments").scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {commentsQty} <CommentIcon />
                  </h5>
                </section>
                {userVote &&
                  <div className="flex flex-col items-center">
                    <p className="text-[14px]"> Your vote was:</p>
                    <p className="text-"> {Object.keys(userVote)[0]} </p>
                  </div>
                }

              </div>
            </section>
          </div>
          <div className="flex flex-col items-center">
            <section className="p-6 md:w-[80vw] gap-4">
              <div className="md:w-full">
                <h4 className="my-6 px-10">DESCRIPTION</h4>
                <p className="md:px-2 h-40 overflow-y-scroll custom-scrollbar">{proposal.description}</p>
              </div>

              <div className=" md:w-full">
                <h4 className="my-6 px-10">IMPACT</h4>
                <p className="h-40 overflow-y-scroll custom-scrollbar">{proposal.impact}</p>
              </div>
            </section>
          </div>

          {/* --- Comments section --- */}
          <div className="flex flex-col items-center w-full">
            <section className="mt-auto w-full">
              <CommentSection
                rawICComments={comments}
                currentPath={[]}
                canComment={user ? true : false}
                onNewComment={onNewComment}
              />
            </section>
          </div>

          {"Open" in proposal.status && user && !userVote && (
            <section className="grid place-items-center gap-4 p-6">
              <div className="bg-kokowai p-2 max-w-[302px] rounded-[5px]">
                <p className="text-white">
                  10 votes required to have a quorum and 6 positive votes for passage
                </p>
              </div>

              <FormControl className="max-w-[302px] w-full !mb-12">
                <Select
                  labelId="vote-select-label"
                  id="vote-select"
                  value={vote.value}
                  onChange={handleChange}
                  displayEmpty
                  className="material_select"
                  sx={{
                    color: "white", // texto seleccionado en blanco
                    "& .MuiSvgIcon-root": { color: "white" }, // icono dropdown en blanco
                  }}
                >
                  {/* Placeholder */}
                  <MenuItem value="" disabled>
                    <span className="text-gray-400">Select your vote</span>
                  </MenuItem>

                  {/* Opciones */}
                  <MenuItem value="Approve" sx={{ color: "white" }}>
                    Approve
                  </MenuItem>
                  <MenuItem value="Disapprove" sx={{ color: "white" }}>
                    Disapprove
                  </MenuItem>
                  <MenuItem value="Abstain" sx={{ color: "white" }}>
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
        </div>
      }
    </main>
  );
};

export default ProposalDetail;
