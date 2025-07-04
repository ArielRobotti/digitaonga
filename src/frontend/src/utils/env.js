const ICP_API_HOST =
  process.env.DFX_NETWORK === "local" ? "http://localhost:4943" : "https://icp-api.io/";
const DAO_CANISTER_ID = process.env.CANISTER_ID_DAO;
const DIGITAL_ASSET_CANISTER_ID = process.env.CANISTER_ID_DIGITAL_ASSET;

export const env = {
  ICP_API_HOST,
  DAO_CANISTER_ID,
  DIGITAL_ASSET_CANISTER_ID,
};
