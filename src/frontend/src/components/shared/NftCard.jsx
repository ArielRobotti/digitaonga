import Button from "./Button";
import { useNavigate } from "react-router";

const NftCard = ({ id = 0, name = "DIGITAL TAONGA", imageUrl = "/images/jpg/stars.jpg" }) => {
  const navigate = useNavigate();

  return (
    <article className="flex flex-col justify-between min-w-[262px] min-h-[355px] w-full h-full bg-kokowai rounded-[5px] p-6 text-white">
      <div className="overflow-hidden w-full">
        <img src={imageUrl} alt={name} className="object-cover" priority="true" />
      </div>

      <h4 className="py-6">{name}</h4>

      <div className="flex justify-end">
        <Button className="w-fit" onClick={() => navigate(`/digital-taonga/${id}`)}>
          View details
        </Button>
      </div>
    </article>
  );
};

export default NftCard;
