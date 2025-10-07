import { useState, useEffect } from "react";
import { CopyIcon, EditIcon } from "../../components/ui/icons";
import { copyToClipboard, p2str, shortP } from "../../utils/functions";
import { useNavigate } from "react-router";
import { ChevronRight } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "@nfid/identitykit/react";
import useMemberStore from "../../store/useMemberStore";
import { blobToImageUrl } from "../../utils/imageManager";

// Paginas
import ProfileSettings from "../../pages/profile/settings/page";
import ProfileProposals from "../../pages/profile/proposals/page";
import ProfileDigitalAccess from '../../pages/profile/digital access/page';
import ProfileHelp from "../../pages/profile/help/page";


// --- Secciones internas que podrías reemplazar luego por componentes reales ---

const pages = {
  settings: <ProfileSettings />,
  proposals: <ProfileProposals />,
  "digital-access": <ProfileDigitalAccess />,
  help: <ProfileHelp />,
};

// --- Menú lateral ---
const links = [
  { title: "Account settings", key: "settings" },
  { title: "Sent proposals", key: "proposals" },
  { title: "Digital Taonga Access", key: "digital-access" },
  { title: "Help", key: "help" },
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

  return (
    <main className="xl:p-8">
      {/* --------- HEADER PERFIL --------- */}
      <section className="xl:flex">
        <section className="flex items-center justify-between p-4 xl:justify-start xl:gap-8 xl:w-1/3">
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
        </section>
      </section>

      {/* --------- MENÚ LATERAL --------- */}
      <div className="xl:flex gap-6 mt-12">

        <section
          className={`grid sm:mt-16 xl:max-w-[425px] xl:min-w-[320px] h-[370px]
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
