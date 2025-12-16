import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import useCanister from "../../../hooks/useCanister";
import { useParams } from "react-router";
import { ModelViewer3D } from "../../../components/ModelViewer3D";

const NftDetail = () => {
  const { id } = useParams();
  const [, taongaRemoteActor] = useCanister("taonga", id);
  const [metadata, setMetadata] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch metadata first to get the total number of chunks.
        const requestMetadata = await taongaRemoteActor.get_asset_metadata();

        if (requestMetadata) {
          const metadata = requestMetadata;
          setMetadata(metadata);

          // Generate promises for all chunk requests concurrently.
          const chunkPromises = [];
          for (let i = 0; i < metadata.chunkQty; i++) {
            chunkPromises.push(
              taongaRemoteActor.get_asset_data({ chunkIndex: BigInt(i) })
            );
          }

          // Wait for all promises to resolve.
          const allChunkResponses = await Promise.all(chunkPromises);

          // Extract the binary chunk data from each response.
          const allChunks = allChunkResponses.map((response) => {
            if ("Ok" in response) {
              return response.Ok.chunk;
            }
            return new Uint8Array();
          });

          // Efficiently concatenate all chunks into a single Uint8Array.
          const totalLength = allChunks.reduce(
            (sum, chunk) => sum + chunk.length,
            0
          );
          const finalData = new Uint8Array(totalLength);
          let offset = 0;
          for (const chunk of allChunks) {
            finalData.set(chunk, offset);
            offset += chunk.length;
          }

          // Create a Blob from the final data and a temporary URL for it.
          const glbBlob = new Blob([finalData], {
            type: "model/gltf-binary",
          });
          const url = URL.createObjectURL(glbBlob);

          // Update the state with the model URL.
          setModelUrl(url);
        } else {
          console.error("Error fetching metadata:", requestMetadata.Err);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (taongaRemoteActor && id) {
      fetchData();
    }
  }, [id, taongaRemoteActor]); // Dependency on taongaRemoteActor is important

  // Clean up the object URL when the component unmounts
  useEffect(() => {
    return () => {
      if (modelUrl) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [modelUrl]);

  if (loading) {
    return (
      <main className="grid place-items-center h-screen ">
        <CircularProgress />
      </main>
    );
  }

  if (!metadata) {
    return <p className="text-center p-8">No asset found</p>;
  }

  return (
    <div className="mx-auto p-0 mo:p-2 md:p-1 h-screen bg-[#444455] ">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
        {/* Renderizador del modelo 3D */}
        <div className="p-1 rounded-lg shadow-lg col-span-1 md:col-span-5 h-[95vh]">
          {modelUrl ? (
            <ModelViewer3D fileUrl={modelUrl} />
          ) : (
            <p className="text-center text-gray-600">
              [ Placeholder 3D viewer]
              <br />
              GLB Model not found.
            </p>
          )}
        </div>

        {/* Detalles del Taonga */}
        <div className="w-full col-span-1 md:col-span-1 h-auto md:h-full">
          <div className="flex flex-col space-y-4 bg-white p-4 h-auto md:h-full md:overflow-y-auto rounded-lg">
            <h1 className="text-4xl font-extrabold text-gray-900">
              {metadata.name}
            </h1>
            {metadata.description.includes("<END-DESCRIPTION>") ?
              <>
              <p className="text-gray-700 leading-relaxed">
                <span className="font-bold mr-2">Description:</span>
                {metadata.description.split("<END-DESCRIPTION>")[0]}:
              </p>  
              <p className="text-gray-700 leading-relaxed">
                <span className="font-bold mr-2">Impact:</span>
                {metadata.description.split("<END-DESCRIPTION>")[1]}:
              </p>
              </>
              :
              <p className="text-gray-700 leading-relaxed">
                <span className="font-bold mr-2">Description:</span>
                {metadata.description}:
              </p>
            }
            <p className="text-gray-700 leading-relaxed">
              <span className="font-bold mr-2">History:</span> {metadata.history}
            </p>
            <p className="text-sm text-gray-500">
              Created at:{" "}
              {new Date(
                Number(metadata.creation_date) / 1_000_000
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftDetail;