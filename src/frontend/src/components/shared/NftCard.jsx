import Button from "./Button";
import { useNavigate } from "react-router";
import { blobToImageUrl } from "../../utils/imageManager";

const NftCard = ({ asset }) => {
  const navigate = useNavigate();

  return (
    <article
      className="flex flex-col justify-between w-full md:h-[540px] h-[80vh] md:w-[330px] bg-kokowai rounded-[5px] 
        p-2 text-white"

    >
      <div className="text-white w-full overflow-hidden">
        <img
          src={blobToImageUrl(asset.thumbnail)}
          className="object-cover rounded-[10px] mb-1 w-full h-[240px]"
          priority="true"
        />
        <div className="px-2">
          <h4>{asset.name}</h4>
          <div>
            <span className="text-gray-500 mr-2">Canister ID:</span>
            {/* <span className="text-gray-500 text-[12px]">{asset.canisterId.toString()}</span> */}
            <a 
              href={`https://dashboard.internetcomputer.org/canister/${asset.canisterId.toString()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 text-[12px] hover:underline"
            >
              {asset.canisterId.toString()}
            </a>
          </div>
          <div>
            <span className="text-gray-500 mr-2">Date created:</span>
            <span className="text-gray-200 text-[14px]">{new Date(Number(asset.date / 1000000n)).toLocaleDateString()}</span>
          </div>


          <div className="flex-grow flex flex-col gap-2 overflow-hidden">
            {/* Contenedor de la descripción con scroll */}
            <div>
              <span className="text-gray-500 mr-2">Description:</span>
              <div className="text-gray-100 max-h-24 overflow-y-auto custom-scrollbar">
                {asset.description}
              </div>
            </div>

            {/* Contenedor de la historia con scroll */}
            <div>
              <span className="text-gray-500 mr-2">History:</span>
              <div className="text-gray-100 max-h-24 overflow-y-auto custom-scrollbar">
                {asset.history}
              </div>
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