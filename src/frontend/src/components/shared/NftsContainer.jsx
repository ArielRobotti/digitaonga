import { useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";
import NftCard from "./NftCard";
import useCanister from "../../hooks/useCanister";

const NftsContainer = ({ className }) => {
  const [, digital] = useCanister("digital_asset");
  const [assets, setAssets] = useState({ loading: true, data: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log({ digital });
        const result = await digital.get_all_assets();
        setAssets({ loading: false, data: result.filter((asset) => asset?.uri) });
      } catch (err) {
        console.error("Error fetching assets:", err);
        setAssets({ loading: false, data: [] });
      }
    };

    fetchData();
  }, []);

  return (
    <section className={`${className}`}>
      <div className="flex gap-4 overflow-x-auto py-2">
        {assets.loading ? (
          <CircularProgress />
        ) : assets.data.length > 0 ? (
          <>
            {assets.data.map((asset, i) => (
              <NftCard key={i} {...asset} />
            ))}
          </>
        ) : (
          <p>No assets found</p>
        )}
      </div>
    </section>
  );
};

export default NftsContainer;
