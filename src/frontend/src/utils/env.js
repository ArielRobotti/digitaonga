const ICP_API_HOST =
  process.env.DFX_NETWORK === "local" ? "http://localhost:4943" : "https://icp-api.io/";
// const DAO_CANISTER_ID = process.env.CANISTER_ID_DAO;
const DAO_CANISTER_ID = process.env.CANISTER_ID_MOTOKODAO;
const DIGITAL_ASSET_CANISTER_ID = process.env.CANISTER_ID_DIGITAL_ASSET;
const ASSETS_CANISTER_ID = process.env.CANISTER_ID_ASSETS || process.env.CANISTER_ID_DAO;
const AUTHORITY_SEED = import.meta.env.VITE_AUTHORITY_SEED;

export const env = {
  ICP_API_HOST,
  DAO_CANISTER_ID,
  DIGITAL_ASSET_CANISTER_ID,
  ASSETS_CANISTER_ID,
  AUTHORITY_SEED,
};
