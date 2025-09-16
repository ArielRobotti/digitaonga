import { proposalParser, proposalsArrayParser } from "../utils/parsers";

import { p2str } from "../utils/functions";
// import { useAuth } from "@nfid/identitykit/react";
import useCanister from "./useCanister";
import { useEffect } from "react";
import useProposalStore from "../store/useProposalStore";

const useProposal = () => {
  // const [daoAuth, dao] = useCanister();
  const [ ,dao ] = useCanister();
  // const { user } = useAuth();
  const {
    addProposal,
    setProposals,
    proposals,
    loading,
    toggleCreating,
    creating,
    likeProposal: likeP,
    dislikeProposal,
  } = useProposalStore();

  const getAllProposals = async () => {
    try {
      const res = await dao.get_all_proposals();

      console.log("getAllProposals res:", res);
      // TODO (fran): parse proposals
      const parsed = proposalsArrayParser(res);

      setProposals(parsed);
    } catch (err) {
      console.log("getAllProposals error:", err);
    }
  };

  // const getProposal = (id) => proposals.find((p) => p.id === id);
  const getProposal = async (id) => {
    // console.log((await dao.logIn()).toString())
    const response =  await dao.get_proposal(BigInt(id));
    console.log({response})
    return response
  };

  // const getProposalsByMember = (principal) =>
  //   proposals.filter((p) => p.creator === p2str(principal));

  const createProposal = async ({ title, description, kind, deadline }) => {
    console.log({ title, description, kind, deadline });
    console.log(kind);

    toggleCreating();

    const res = await dao.create_proposal(title, description, kind, deadline);
    console.log({ res });
    addProposal(proposalParser(res));

    toggleCreating();
  };

  const createEditProposal = async ({ image, description }) => {
    try {
      const res = await dao.create_edit_proposal(description, image);
      console.log({ res });
    } catch (err) {
      console.warn("create edit proposal error:", err);
    }
  };

  const voteProposal = async (id, vote) => {
    try {
      const res = await dao.vote_proposal(BigInt(id), { [vote]: null });
      console.log({ res });

      if (res.Ok) {
      } else {
      }
    } catch (err) {
      console.log("voteProposal error:", err);
    }
  };

  // const likeProposal = async (id, type) => {
  //   try {
  //     if (type === "Like") {
  //       likeP(id, p2str(user.principal));
  //     } else {
  //       dislikeProposal(id, p2str(user.principal));
  //     }
  //     const res = await dao.like_proposal(id, { [type]: null });
  //     console.log({ res });
  //   } catch (err) {
  //     console.log("likeProposal error:", err);
  //   }
  // };

  const likeProposal = async (id, type) => {
    const like = type === "Like" ? {Like: null} : {Dislike: null}
    dao.like_proposal(id, like)
  }

  useEffect(() => {
    dao && loading && getAllProposals();
  }, [dao, loading]);

  return {
    proposals,
    getProposal,
    loading,
    createProposal,
    creating,
    voteProposal,
    likeProposal,
    // getProposalsByMember,
  };
};

export default useProposal;
