import NftCard from "./NftCard";

const NftsContainer = () => {
  return (
    <section className="grid gap-6 place-items-center p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <NftCard />
      <NftCard />
      <NftCard />
      <NftCard />
      <NftCard />
      <NftCard />
    </section>
  );
};

export default NftsContainer;
