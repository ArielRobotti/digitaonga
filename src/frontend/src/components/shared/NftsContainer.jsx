import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import NftCard from "./NftCard";
import useCanister from "../../hooks/useCanister";

const NftsContainer = ({ className, filter = (asset) => true, defaultNotAssets = <p>No assets found</p> }) => {
  const [dao] = useCanister("dao");
  const [assets, setAssets] = useState({ loading: true, array: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dao.get_all_taongas();
        
        const taongasArray = result.map((entry) => ({
          canisterId: entry[0],
          name: entry[1].name,
          description: entry[1].description,
          history: entry[1].history,
          thumbnail: entry[1].thumbnail,
          date: entry[1].date,
          canDownload: entry[1].canDownload,
          authorizedDownloaders: entry[1].authorizedDownloaders
        }));
        // taongasArray.map(a => {console.log(a.canDownload)})
        setAssets({ loading: false, array: taongasArray.filter(filter) });
        
      } catch (err) {
        console.error("Error fetching assets:", err);
        // En caso de error, el estado debe reflejar que no hay datos
        setAssets({ loading: false, array: [] });
      }
    };

    if (dao) {fetchData()};
  }, [dao]); 

  return (
    <section className={`${className}`}>
      <div className="flex gap-4 py-2 flex-wrap justify-center mb-20">
        {assets.loading ? (
          <CircularProgress />
        ) : assets.array.length > 0 ? (
          <>
            {assets.array.map((asset) => (
              <NftCard key={asset.canisterId.toString()} asset={asset} />
            ))}
          </>
        ) : (
          defaultNotAssets
        )}
      </div>
    </section>
  );
};

export default NftsContainer;