import Button from "../../components/shared/Button";
import NftsContainer from "../../components/shared/NftsContainer";

const Nfts = () => {
  return (
    <main>
      <h4 className="uppercase p-6 pt-12">Digital Taonga Gallery</h4>

      <NftsContainer className="px-4" />

      <div className="fixed inset-x-0 bottom-4 flex justify-center z-10">
        <Button variant="kokowai" className="inline-block">
          Create
        </Button>
      </div>
    </main>
  );
};

export default Nfts;
