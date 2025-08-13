import Button from "./Button";
import { useNavigate } from "react-router";

const NftCard = ({ id = 0, name = "DIGITAL TAONGA", image }) => {
  const navigate = useNavigate();

  return (
    <article className="flex flex-col justify-between min-w-[262px] min-h-[355px] w-full h-full bg-kokowai rounded-[5px] p-6 text-white max-w-[330px]">
      <div className="overflow-hidden w-full">
        <img
          src={
            image
              ? `https://2ynh7-zyaaa-aaaal-qsr4q-cai.icp0.io${image}`
              : '"/images/jpg/stars.jpg"'
          }
          alt={name}
          className="object-cover"
          priority="true"
        />
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
