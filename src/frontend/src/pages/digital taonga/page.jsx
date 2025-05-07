import Button from "../../components/shared/Button";
import NftsContainer from "../../components/shared/NftsContainer";

const Nfts = () => {
  return (
    <main>
      <h4 className="uppercase p-6 pt-12">Digital Taonga Gallery</h4>

      <NftsContainer className="px-4" />

      <Button variant="kokowai" className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        Create
      </Button>
    </main>
  );
};

export default Nfts;
