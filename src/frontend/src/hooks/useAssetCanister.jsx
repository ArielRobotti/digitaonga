import { AssetManager } from "@dfinity/assets";
import { HttpAgent } from "@dfinity/agent";
import { env } from "../utils/env";
import { identityFromSeed } from "../utils/functions";

const useAssetCanister = () => {
  console.log({ env });
  const isLocal = env.ICP_API_HOST.includes("localhost");

  const identity = identityFromSeed();
  console.log("Identity from seed:", identity.getPrincipal().toText());

  const agent = HttpAgent.createSync({
    host: env.ICP_API_HOST,
    identity,
    shouldFetchRootKey: isLocal,
  });

  const assetManager = new AssetManager({
    canisterId: env.ASSETS_CANISTER_ID,
    agent, // Identity in agent must be authorized by the assets canister to make any changes
  });

  const getAsset = async (key) => {
    const asset = await assetManager.get(key);
    const blob = await asset.toBlob();
    const url = URL.createObjectURL(blob);
    return url;
  };

  // TODO (fran): ver path (/ASSET_DIGITAL_NAME/.../.../file.name)
  const uploadFile = async (file) => {
    const uploadedFilePath = `images/${file.name}`;

    const key = await assetManager.store(file, { fileName: uploadedFilePath });

    console.log("File uploaded to: ", key);
    return key;
  };

  // TODO (fran): ver path (/ASSET_DIGITAL_NAME/.../.../file.name)
  const batchUpload = async (files) => {
    const batch = assetManager.batch();

    files.forEach(async (file) => {
      const uploadedFilePath = `images/${file.name}`;
      const key = await batch.store(file, { fileName: uploadedFilePath });
      console.log("File uploaded to: ", key);
    });

    await batch.commit({ onProgress: (progress) => console.log("Progress: ", progress) });
  };

  return {
    uploadFile,
    batchUpload,
    getAsset,
  };
};

export default useAssetCanister;
