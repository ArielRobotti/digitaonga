import { Checkbox } from "@mui/material";
import { CopyIcon, AvatarIcon} from "../../components/ui/icons";
import { copyToClipboard } from "../../utils/functions";
import { MoreOptionsIcon } from "../ui/icons";
import { shortP } from "../../utils/functions";
import { useState } from "react";
import { blobToImageUrl } from "../../utils/imageManager";

const MemberCommunityCard = ({
  principal,
  name,
  created_at,
  role,
  profile_pic,
  selectedMember,
  handleSelectMember,
}) => {
  const [checked, setChecked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (memberPrincipal) => {
    try {
      // 1. Copiar al portapapeles
      await navigator.clipboard.writeText(memberPrincipal); 

      // 2. Mostrar el cartelito
      setIsCopied(true);

      // 3. Programar la desaparición (ej. 1500 milisegundos = 1.5 segundos)
      setTimeout(() => {
        setIsCopied(false);
      }, 1500); 

    } catch (err) {
      console.error('Error al copiar:', err);
      // Opcional: Mostrar un mensaje de error si la copia falla.
    }
  };

  const handleChange = () => {
    handleSelectMember(principal);
    setChecked(!checked);
  };

  // Convert created_at timestamp to a legible date string
  const formattedDate = new Date(created_at / 1_000_000).toLocaleDateString();

  return (
    <article
      className="py-2.5 flex items-center gap-0 md:gap-4 cursor-pointer hover:bg-gray-200"
    >
      <Checkbox checked={checked}
        className="h-8 w-8 "
        onClick={handleChange}

      />
      <img 
        className="h-8 w-8 md:w-16 md:h-16 rounded-full object-cover"  
        src={blobToImageUrl(profile_pic[0]) || "/images/webp/avatar-anonymous.webp"} 
        alt={name} 
      />    

      <section className="w-full">
        <div className="relative group inline-block w-full">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center">
              <p className="flex flex-col text-[18px]">
                {name[0] ? name[0] : "No Name"} 
                <span className="">
                  ({role})
                </span>
              </p>
            </div>
            {/* Tooltip */}
            <span className="absolute w-max -translate-x-1/2 mt-2 -bottom-6 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1">
              {principal}
            </span>
            
              <div className="flex flex-col items-center mr-4">
                {isCopied && (
                  <div 
                  className="absolute z-10 p-2 text-sm text-white bg-gray-800 rounded shadow-lg whitespace-nowrap"
                  style={{ top: '-30%', left: '72%', transform: 'translate(-50%, 10px)' }} // Posicionamiento básico
                  >
                    ID copied successfully
                  </div>
                )}
                <span className="mr-1">Copy Id</span>
                <CopyIcon
                  className="cursor-pointer h-[14px] w-[14px] md:h-6 md:w-6"
                  onClick={() => handleCopy(principal.toString())}
                />
              </div>

            {/* <p className="flex flex-col md:flex-row text-sm text-gray-500 gap-2">
              <span>Joined at:</span>
              <span>{formattedDate}</span>
            </p> */}
          </div>

        </div>
      </section>

      {/* <section className="cursor-pointer grid place-items-center gap-1">
        <MoreOptionsIcon />
        <span className="w-20 ml-6">Edit role</span>
      </section> */}
    </article>
  );
};

export default MemberCommunityCard;
