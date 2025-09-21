import Button from "./Button";
import { useNavigate } from "react-router";
import { blobToImageUrl } from "../../utils/imageManager";

const NftCard = ( {asset} ) => {
  const navigate = useNavigate();
  console.log(asset)
  return (
    <article className="flex flex-col justify-between min-w-[262px] min-h-[355px] w-full h-full bg-kokowai rounded-[5px] p-6 text-white max-w-[330px]">
      <div className="overflow-hidden w-full">
        <img
          src={
            blobToImageUrl(asset.thumbnail) |
            '"/images/jpg/stars.jpg"'
          }
          // alt={id}
          className="object-cover"
          priority="true"
        />
          <p className="text-white">{asset.history}</p>
      </div>

      <h4 className="py-6">{name}</h4>

      <div className="flex justify-end">
        <Button className="w-fit" onClick={() => navigate(`/digital-taonga/${asset.canisterId.toString()}`)}>
          View details
        </Button>
      </div>
    </article>
  );
};

export default NftCard;
