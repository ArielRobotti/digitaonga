
const ICP_API_HOST =
  import.meta.env.DFX_NETWORK === "local" 
    ? "http://localhost:4943" 
    : "https://icp-api.io/"
;
const DAO_CANISTER_ID = JSON.stringify(import.meta.env.VITE_DEPLOY_DEV) == "true" ?
  import.meta.env.CANISTER_ID_MOTOKODAODEV:
  import.meta.env.CANISTER_ID_MOTOKODAO
;

const AUTHORITY_SEED = import.meta.env.AUTHORITY_SEED;

// console.log("=== ENV DEBUG ===");
// console.log({ ICP_API_HOST });
// console.log({ DAO_CANISTER_ID });
// console.log({ DFX_NETWORK: import.meta.env.DFX_NETWORK });
// console.log({ CANISTER_ID: import.meta.env.CANISTER_ID });

export const env = {
  ICP_API_HOST,
  DAO_CANISTER_ID,
  AUTHORITY_SEED,
};