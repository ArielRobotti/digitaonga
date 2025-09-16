import { CopyIcon, EditIcon } from "../../components/ui/icons";
import { copyToClipboard, p2str, shortP } from "../../utils/functions";
import { useEffect } from "react";
import { useNavigate } from "react-router";

import { ChevronRight } from "@mui/icons-material";
import { Link } from "react-router";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "@nfid/identitykit/react";
import useMemberStore from "../../store/useMemberStore";
import useProposal from "../../hooks/useProposal";
import { blobToImageUrl } from "../../utils/imageManager"

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

  // console.log({member: member?.data.name})

  const navigate = useNavigate();
  useEffect(() => {
    // Redirige si el usuario no existe (por ejemplo, después de un logout)
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <main className="xl:p-8">
      <section className="xl:flex">
        <section className="flex items-center justify-between p-4 xl:justify-start xl:gap-8 xl:w-1/3">
          {/* profile img */}
          <div className="flex items-center gap-4">
              {member?.data.profile_pic[0] ?  
            <img className="rounded-full bg-gray-300 border border-black w-16 h-16 sm:w-24 sm:h-24 object-cover"
              src={blobToImageUrl(member?.data.profile_pic[0])} alt="">
            </img>
                : 
                <PersonIcon className="text-gray-500" />
              }
            {user && <div>
              <h1>{member?.data.name[0]?.length > 0 ?  member?.data.name[0]: "Name Username"}</h1>
              <p className="flex items-center gap-2 mt-4">
                Principal ID: {shortP(p2str(user.principal))}
                <CopyIcon
                  className="cursor-pointer"
                  onClick={() => copyToClipboard(p2str(user.principal))}
                />
              </p>
            </div>}
          </div>

          <div className="rounded-full bg-kokowai p-2 cursor-pointer">
            <Link to="/profile/settings">
              <EditIcon />
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-4 mt-4 xl:w-2/3 xl:self-center xl:flex xl:justify-center xl:gap-8">
          {array.map((item) => (
            <article
              key={item.n}
              className="bg-gray-200 grid place-items-center max-w-[139px] h-[101px] sm:max-w-[210px] sm:h-[110px] xl:p-4 xl:min-w-[200px]"
            >
              <h1>{item.n}</h1>
              <p className="text-center">{item.s}</p>
            </article>
          ))}
        </section>
      </section>

      <section className="grid mt-12 sm:mt-16 xl:max-w-[425px]">
        {links.map((link) => (
          <Link
            to={link.href}
            key={link.title}
            className="p-6 border-t cursor-pointer xl:border flex justify-between"
          >
            {link.title.toUpperCase()}
            <ChevronRight className="rotate-90" />
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
