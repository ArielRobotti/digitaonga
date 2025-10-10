import Button from "./Button";
import { useNavigate } from "react-router";
import { blobToImageUrl } from "../../utils/imageManager";

const NftCard = ({ asset }) => {
  const navigate = useNavigate();

  return (
    <article
      className="flex flex-col justify-between w-full md:h-[560px] h-[80vh] md:w-[400px] bg-kokowai rounded-[5px] 
        p-[24px] text-white"

    >
      <div className="text-white w-full overflow-hidden">
        <img
          src={blobToImageUrl(asset.thumbnail)}
          className="object-cover rounded-[10px] mb-1 w-full h-[240px]"
          priority="true"
        />
        <div>
          <h4 className="py-[24px]">{asset.name.slice(0, 24)}</h4>
          <div>
            <span className="mr-2">Canister ID:</span>
            {/* <span className="text-gray-500 text-[12px]">{asset.canisterId.toString()}</span> */}
            <a 
              href={`https://dashboard.internetcomputer.org/canister/${asset.canisterId.toString()}`}
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:underline"
            >
              {asset.canisterId.toString()}
            </a>
          </div>
          <div>
            <span className="mr-2">Date created:</span>
            <span className="">{new Date(Number(asset.date / 1000000n)).toLocaleDateString()}</span>
          </div>


          <div className="flex-grow flex flex-col overflow-hidden">
            {/* Contenedor de la descripción con scroll */}
            <div>
              <span className="mr-2">Cultural description:</span>
              <span>{asset.description.slice(0, 30) + "..."}</span>
              {/* <div className="text-gray-100 max-h-24 overflow-y-auto custom-scrollbar">
                {asset.description.slice(0, 25)}
              </div> */}
            </div>

            {/* Contenedor de la historia con scroll */}
            <div>
              <span className="mr-2">History:</span>
              <span>{asset.history.slice(0, 40) + "..."}</span>
              {/* <div className="text-gray-100 max-h-24 overflow-y-auto custom-scrollbar">
                {asset.history}
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* El botón se mantendrá siempre en la parte inferior gracias a `flex-grow` en el div superior */}
      <div className="flex justify-end mt-2">
        <Button className="w-fit" onClick={() => navigate(`/digital-taonga/${asset.canisterId.toString()}`)}>
          View details
        </Button>
      </div>
    </article>
  );
};

export default NftCard;