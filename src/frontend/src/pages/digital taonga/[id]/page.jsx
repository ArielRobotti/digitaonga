import { useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";
import { p2str } from "../../../utils/functions";
import useCanister from "../../../hooks/useCanister";
import { useParams } from "react-router";

const NftDetail = () => {
  const [, digital] = useCanister("digital_asset");
  const [asset, setAsset] = useState({ loading: true, data: null });
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const result = await digital.get_asset(parseInt(id));

      console.log("Fetched asset result:", result);

      if (!result.length) return setAsset({ loading: false, data: null });

      const data = {
        id: Number(result[0].id),
        owner: p2str(result[0].owner),
        name: result[0].metadata.name,
        description: result[0].metadata.description,
        image: result[0].metadata.image,
        history: result[0].metadata.history,
        symbol: result[0].metadata.symbol,
      };

      console.log("Fetched asset data:", data);
      setAsset({ loading: false, data });
    } catch (error) {
      console.error("Error fetching asset:", error);
      setAsset({ loading: false, data: null });
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <main>
      <h4 className="p-6">DIGITAL TAONGA</h4>

      {asset.loading ? (
        <CircularProgress />
      ) : asset.data ? (
        <>
          <div className="grid place-items-center p-3">
            <img
              src={`https://2ynh7-zyaaa-aaaal-qsr4q-cai.icp0.io${asset.data?.image}`}
              alt="digital taonga"
              className="w-[288px] h-[288px]"
            />
          </div>

          <section className="p-6 flex flex-col gap-2">
            <p>Token ID: {id}</p>
            <p>Label: {asset.data?.name}</p>
            <p>Owner: {asset.data?.owner}</p>
            <p>Cultural description: {asset.data?.description}</p>
            <p>History: {asset.data?.history}</p>
          </section>
        </>
      ) : (
        <p>No asset found</p>
      )}
    </main>
  );
};

export default NftDetail;
