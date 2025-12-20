import Button from "./Button";
import { useNavigate } from "react-router";
import { blobToImageUrl } from "../../utils/imageManager";
import useCanister from "../../hooks/useCanister";
import DownloadButton from "./DownloadButton";

const NftCard = ({ asset }) => {
  const navigate = useNavigate();
  const [, taongaRemoteActor] = useCanister("taonga", asset.canisterId);

  return (
    <article
      className="flex flex-col justify-between w-full md:h-[560px] h-[80vh] md:w-[400px] bg-kokowai rounded-[5px] 
        p-[24px] text-white transition duration-300 hover:scale-102!"

    >
      <div className="text-white w-full overflow-hidden " style={{ fontSize: "14px" }}>
        <img
          src={blobToImageUrl(asset.thumbnail)}
          className="object-cover rounded-[10px] mb-1 w-full h-[240px] cursor-pointer transition duration-300 hover:scale-101!"
          onClick={() => navigate(`/digital-taonga/${asset.canisterId.toString()}`)}
          priority="true"
        />
        <h4 className="py-[24px]  pb-[16px] truncate w-74 select-none">{asset.name}</h4>
        {/* Info */}
        <div className="hidden  md:flex flex-col gap-4 select-none">
          <div className="flex flex-row items-center">
            <p className="mr-2 text-[16px]">CID:</p>
            <a
              href={`https://dashboard.internetcomputer.org/canister/${asset.canisterId.toString()}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className=" hover:underline text-[16px]">{asset.canisterId.toString()}</p>
            </a>
          </div>
          <div className="flex flex-row items-center">
            <p className="mr-2">Date created:</p>
            <p className="">{new Date(Number(asset.date / 1000000n)).toLocaleDateString()}</p>
          </div>
          <div className="flex-grow flex flex-col overflow-hidden">
            {/* Contenedor de la descripción con scroll */}
            <div className="flex flex-row items-center">
              <p className="mr-2">Cultural description:</p>
              <p className="truncate w-38">{asset.description.split("<END-DESCRIPTION>")[0].split("<END-NAME>")[1]}</p>
              {/* <div className="text-gray-100 max-h-24 overflow-y-auto custom-scrollbar">
                {asset.description.slice(0, 25)}
              </div> */}
            </div>
          </div>
          {/* Contenedor de la historia con scroll */}
          <div className="flex flex-row items-center">
            <p className="mr-2">History:</p>
            <p className="truncate w-68">{asset.history}</p>
            {/* <div className="text-gray-100 max-h-24 overflow-y-auto custom-scrollbar">
                {asset.history}
            </div> */}

          </div>
        </div>
      </div>


      <div className="flex justify-end mt-2 md:hidden">
        <Button className="w-fit" onClick={() => navigate(`/digital-taonga/${asset.canisterId.toString()}`)}>
          View details
        </Button>
      </div>

      <div className="hidden md:flex justify-around">
        <div className="flex justify-end mt-2">
          {/* <Button
            className={`
              w-fit 
              px-8 
              border-2 
              cursor-default 
              
              ${asset.canDownload // Si SÍ puede descargar (botón activo)
                ? 'bg-transparent text-[#77cc77]! border-[#77aa77]! transition duration-300 hover:scale-105!'
                : 'bg-gray-700 text-gray-500 border-gray-500 cursor-not-allowed' // Si NO puede descargar (botón deshabilitado)
              }
            `}
            onClick={() => { console.log("Access confirmed, download not implemented") }}
            disabled={!asset.canDownload}
          >
            Download
          </Button> */}
          <DownloadButton asset={asset} taongaRemoteActor={taongaRemoteActor} />

        </div>

        <div className="flex justify-end mt-2">
          <Button className="w-fit transition duration-300 hover:scale-105!"
            onClick={() => navigate(`/proposals/create/Digital%20Taonga%20proposal?action=Create%20or%20Upload%20a%20New%20Digital%20Taonga`)}
          >
            Create Proposal
          </Button>
        </div>
      </div>

    </article>
  );
};

export default NftCard;