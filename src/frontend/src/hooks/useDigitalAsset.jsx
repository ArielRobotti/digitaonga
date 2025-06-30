import useCanister from "./useCanister";

const useDigitalAsset = () => {
  const [digitalAsset] = useCanister("digital_asset");

  const getAllAssets = async () => {
    try {
      const assets = await digitalAsset.getAllAssets();
      return assets;
    } catch (err) {
      console.error("Error fetching all assets:", err);
    }
  };

  return {};
};

export default useDigitalAsset;
