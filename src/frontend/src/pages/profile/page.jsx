import { useState, useEffect } from "react";
import { CopyIcon, EditIcon } from "../../components/ui/icons";
import { copyToClipboard, p2str, shortP } from "../../utils/functions";
import { useNavigate } from "react-router";
import { ChevronRight } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "@nfid/identitykit/react";
import useMemberStore from "../../store/useMemberStore";
import { blobToImageUrl } from "../../utils/imageManager";
import useCanister from "../../hooks/useCanister"
import { proposalsArrayParser } from "../../utils/parsers";

// Paginas
import ProfileSettings from "../../pages/profile/settings/page";
import ProfileProposals from "../../pages/profile/proposals/page";
import ProfileDigitalAccess from '../../pages/profile/digital access/page';
// import ProfileHelp from "../../pages/profile/help/page";


// --- Secciones internas que podrías reemplazar luego por componentes reales ---

const pages = {
  settings: <ProfileSettings />,
  proposals: <ProfileProposals />,
  "digital-access": <ProfileDigitalAccess />,
  // help: <ProfileHelp />,
};

// --- Menú lateral ---
const links = [
  { title: "Account settings", key: "settings" },
  { title: "Sent proposals", key: "proposals" },
  { title: "Digital Taonga Access", key: "digital-access" },
  // { title: "Help", key: "help" },
];

const Profile = () => {
  const { user, disconnect } = useAuth();
  const { member } = useMemberStore();
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState(null);

  useEffect(() => {
    // Redirige si el usuario no existe (por ejemplo, después de un logout)
    if (!member) {
      navigate("/");
    }
  }, [user, navigate]);

  // contadores de proposal fijos.

  const [dao] = useCanister()
  const [approved, setApproved] = useState([])
  const [rejected, setRejected] = useState([])
  const [active, setActive] = useState([])


  useEffect(() => {
    const fetchProposals = async () => {
      if (dao) {
        const response = await dao.get_my_proposals();
        if (response) {
          // proposalsShown.current = proposalsArrayParser(response)

          setApproved(proposalsArrayParser(response.filter(p => 'Approved' in p.status)))
          setRejected(proposalsArrayParser(response.filter(p => 'Rejected' in p.status)))
          setActive(proposalsArrayParser(response.filter(p => 'Open' in p.status)))
        }
      }
    };
    fetchProposals()
  }, [dao, user])


  return (
    <main className="xl:p-8">
      {/* --------- HEADER PERFIL --------- */}
      <section className="xl:flex xl:mt-4">
        {activePage != "settings" && <section className="flex items-center justify-between p-4 xl:justify-start xl:gap-8 xl:w-2/3">
          <div className="flex items-center gap-4">
            {member.data?.profile_pic[0] ? (
              <img
                className="rounded-full bg-gray-300 border border-black w-16 h-16 sm:w-24 sm:h-24 object-cover"
                src={blobToImageUrl(member.data?.profile_pic[0])}
                alt=""
              />
            ) : (
              <PersonIcon className="text-gray-500" />
            )}
            {user && (
              <div>
                <h1>
                  {member?.data?.name[0]?.length > 0
                    ? member?.data.name[0]
                    : "Name Username"}
                </h1>
                <p className="flex items-center gap-2 mt-4">
                  Principal ID: {shortP(p2str(user.principal))}
                  <CopyIcon
                    className="cursor-pointer"
                    onClick={() =>
                      copyToClipboard(p2str(user.principal))
                    }
                  />
                </p>
              </div>
            )}
          </div>

          <div
            className="rounded-full bg-kokowai p-2 cursor-pointer"
            onClick={() => setActivePage("settings")}
          >
            <EditIcon />
          </div>
        </section>}
        <div className="flex flex-col items-center justify-between w-full">
          <div className="flex h-[133px] w-[630px] items-center justify-between px-[12px] gap-[10px]">
            <div className="flex flex-col items-center justify-center h-[133px] w-[208px] bg-[#E4E4E4]">
              <h1 className="text-center">{active.length}</h1>
              <div>Active Proposal</div>
            </div>
            <div className="flex flex-col items-center justify-center h-[133px] w-[208px] bg-[#E4E4E4]">
              <h1 className="text-center">{approved.length}</h1>
              <div>Approved Proposal</div>
            </div>
            <div className="flex flex-col items-center justify-center h-[133px] w-[208px] bg-[#E4E4E4]">
              <h1 className="text-center">{rejected.length}</h1>
              <div>Rejected Proposal</div>
            </div>
          </div>
        </div>
      </section>

      {/* --------- MENÚ LATERAL --------- */}
      <div className="xl:flex gap-6 mt-12">

        <section
          className={`grid sm:mt-16 xl:w-[425px] xl:h-[360px]
          ${activePage !== null ? "hidden sm:grid" : "mobile:hidden"}`}
        >
          {links.map((link) => (
            <div
              key={link.key}
              onClick={() => setActivePage(link.key)}
              className={`p-6 border-t cursor-pointer xl:border flex justify-between transition hover:bg-gray-100 ${activePage === link.key ? "bg-gray-200 font-semibold" : ""
                }`}
            >
              {link.title.toUpperCase()}
              <ChevronRight className="rotate-90" />
            </div>
          ))}

          {user?.principal && (
            <div
              className="p-6 border cursor-pointer hover:bg-gray-100"
              onClick={disconnect}
            >
              LOG OUT
            </div>
          )}
        </section>


        <section className="mt-12 w-full ">
          {pages[activePage]}
        </section>
      </div>
    </main>
  );
};

export default Profile;
