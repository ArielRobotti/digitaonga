import Button from "../../components/shared/Button";
import NftsContainer from "../../components/shared/NftsContainer";

const Nfts = () => {
  return (
    <main>
      <section className="p-4">
        <h4 className="uppercase">Digital Taonga Archive</h4>
        <p>
          Like a whare taonga, this is the place where your digital artworks are safely housed.
          Visit them here at any time.
        </p>
      </section>

      <NftsContainer className="px-2" />

      <div className="fixed inset-x-0 bottom-4 flex justify-center z-10">
        <Button variant="kokowai" className="inline-block">
          Create
        </Button>
      </div>
    </main>
  );
};

export default Nfts;
