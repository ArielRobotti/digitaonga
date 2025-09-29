// import { idlFactory as daoIdl } from "../../../declarations/dao/dao.did.js";
// import { idlFactory as digitalAssetIdl } from "../../../declarations/digital_asset/digital_asset.did.js";
import { idlFactory as motokoDao } from "../../declarations/backend/dao/motokoDao.did.js";
import { env } from "./env.js";

export const canisters = {
  // dao: { canisterId: env.DAO_CANISTER_ID, idl: daoIdl }, // mainnet
  // digital_asset: { canisterId: env.DIGITAL_ASSET_CANISTER_ID, idl: digitalAssetIdl }, // mainnet
  dao: {canisterId: env.DAO_CANISTER_ID, idl: motokoDao}
  // ledger: { canisterId: "", idl: ledgerIdl },
  // dao: { canisterId: "bd3sg-teaaa-aaaaa-qaaba-cai", idl: daoIdl }, // local
  // ledger: { canisterId: "br5f7-7uaaa-aaaaa-qaaca-cai", idl: ledgerIdl }, // local
};
