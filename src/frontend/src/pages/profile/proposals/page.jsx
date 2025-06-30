import { CircularProgress } from "@mui/material";
import ProposalCard from "../../../components/shared/ProposalCard";
import { p2str } from "../../../utils/functions";
import { useAuth } from "@nfid/identitykit/react";
import useProposal from "../../../hooks/useProposal";

const ProfileProposals = () => {
  const { user } = useAuth();
  const { getProposalsByMember, loading } = useProposal();
  const proposals = user?.principal && getProposalsByMember(p2str(user.principal));

  const array = [
    { n: 1, s: "Active proposals" },
    { n: 2, s: "Approved proposals" },
    { n: 3, s: "Rejected proposals" },
  ];

  return (
    <main>
      <section className="grid grid-cols-3 gap-4 mt-4">
        {array.map((item) => (
          <article
            key={item.n}
            className="bg-gray-200 grid place-items-center max-w-[139px] h-[101px]"
          >
            <h1>{item.n}</h1>
            <p>{item.s}</p>
          </article>
        ))}
      </section>

      <div className="flex gap-4 overflow-x-auto py-2 xl:flex-wrap">
        {loading ? (
          <CircularProgress />
        ) : (
          proposals.map((proposal) => <ProposalCard key={proposal.id} {...proposal} />)
        )}
      </div>
    </main>
  );
};

export default ProfileProposals;
