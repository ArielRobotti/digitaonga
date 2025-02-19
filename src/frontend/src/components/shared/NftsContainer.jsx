import Button from "./Button";
import NftCard from "./NftCard";

const NftsContainer = () => {
  return (
    <section>
      <h4 className="uppercase p-6 pt-12">NFT gallery</h4>

      <section className="grid gap-6 place-items-center p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-16">
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
      </section>

      <Button variant="kokowai" className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        Create
      </Button>
    </section>
  );
};

export default NftsContainer;
