import Button from "./Button";

const NftCard = ({
  name = "NFT NAME",
  tokenId = "1",
  label = "idk",
  dateCreated = "12/02/25",
  imageUrl = "/images/jpg/stars.jpg",
}) => {
  return (
    <article className="max-w-[343px] max-h-[506px] w-full h-full bg-kokowai rounded-[5px] p-4 text-white">
      <div className="overflow-hidden w-[315px] h-[288px]">
        <img src={imageUrl} alt={name} className="object-cover" priority="true" />
      </div>

      <section>
        <h2>{name}</h2>

        <div>
          <p>Token ID: {tokenId}</p>
          <p>Label: {label}</p>
          <p>Date created {dateCreated}</p>
        </div>
      </section>

      <div className="flex justify-end mt-4">
        <Button>Manage</Button>
      </div>
    </article>
  );
};

export default NftCard;
