import { AnonymousIdentity, HttpAgent } from "@dfinity/agent";

import { AssetManager } from "@dfinity/assets";

const useAssetCanister = () => {
  const agent = HttpAgent.createSync({
    host: "http://localhost:4349",
    identity: new AnonymousIdentity(),
  });

  const assetManager = new AssetManager({
    canisterId: "bkyz2-fmaaa-aaaaa-qaaaq-cai",
    agent, // Identity in agent must be authorized by the assets canister to make any changes
  });

  const getAsset = async (key) => {
    const asset = await assetManager.get(key);
    const blob = await asset.toBlob();
    const url = URL.createObjectURL(blob);
  };

  // TODO (fran): ver path (/ASSET_DIGITAL_NAME/.../.../file.name)
  const uploadFile = async (file) => {
    const uploadedFilePath = `images/${file.name}`;

    const key = await assetManager.store(file, { fileName: uploadedFilePath });

    console.log("File uploaded to: ", key);
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
