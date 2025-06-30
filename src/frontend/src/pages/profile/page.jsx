import { CopyIcon, EditIcon, PencilIcon } from "../../components/ui/icons";
import { copyToClipboard, p2str, shortP } from "../../utils/functions";

import { Link } from "react-router";
import { useAuth } from "@nfid/identitykit/react";
import useMemberStore from "../../store/useMemberStore";
import useProposal from "../../hooks/useProposal";

// import { CopyIcon } from "../../components/ui/icons";

const links = [
  { title: "Account settings", href: "/profile/settings" },
  { title: "Sent proposals", href: "/profile/proposals" },
  { title: "Digital Taonga Access", href: "/profile/digital-access" },
  { title: "Help", href: "/profile/help" },
  //   { title: "Log out", href: "/profile/logout" },
];

const Profile = () => {
  const { user, disconnect } = useAuth();
  const { member } = useMemberStore();
  const { getProposalsByMember } = useProposal();

  //   const user = { name: "fran", principal: "kjhad-kajdbf-lkadfnb-cai" };

  const array = [
    { n: 1, s: "Active proposals" },
    { n: 2, s: "Approved proposals" },
    { n: 3, s: "Rejected proposals" },
  ];

  return (
    <main>
      <section className="flex items-center justify-between p-4">
        {/* profile img */}
        <div>
          <h1>{member?.name || "Username"}</h1>
          <p className="flex items-center gap-2 mt-4">
            Guardian ID: {shortP(p2str(user?.principal || "") || "abced-cai")}{" "}
            <CopyIcon
              className="cursor-pointer"
              onClick={() => copyToClipboard(p2str(user?.principal || "") || "abcde-cai")}
            />
          </p>
        </div>

        <div className="rounded-full bg-kokowai p-2 cursor-pointer">
          <Link to="/profile/settings">
            <EditIcon />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-4 mt-4">
        {array.map((item) => (
          <article
            key={item.n}
            className="bg-gray-200 grid place-items-center max-w-[139px] h-[101px] sm:max-w-[210px] sm:h-[110px]"
          >
            <h1>{item.n}</h1>
            <p className="text-center">{item.s}</p>
          </article>
        ))}
      </section>

      <section className="grid mt-12 sm:mt-16">
        {links.map((link) => (
          <Link to={link.href} key={link.title} className="p-6 border-t cursor-pointer">
            {link.title.toUpperCase()}
          </Link>
        ))}
        {user?.principal && (
          <div className="p-6 border cursor-pointer" onClick={disconnect}>
            LOG OUT
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;
