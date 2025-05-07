import NftCard from "./NftCard";

const NftsContainer = ({ className }) => {
  return (
    <section className={`${className}`}>
      <div className="flex gap-4 overflow-x-auto py-2">
        {false ? (
          <CircularProgress />
        ) : (
          <>
            <NftCard />
            <NftCard />
            <NftCard />
            <NftCard />
            <NftCard />
            <NftCard />
          </>
        )}
      </div>
    </section>
  );
};

export default NftsContainer;
