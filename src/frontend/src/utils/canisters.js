import { idlFactory as daoIdl } from "../../../declarations/dao/dao.did.js";
import { idlFactory as digitalAssetIdl } from "../../../declarations/digital_asset/digital_asset.did.js";
import { idlFactory as ledgerIdl } from "../../../declarations/ledger/ledger.did.js";

export const canisters = {
  dao: { canisterId: "ztccp-4aaaa-aaaal-qm6vq-cai", idl: daoIdl }, // mainnet
  digital_asset: { canisterId: "", idl: digitalAssetIdl }, // mainnet
  // ledger: { canisterId: "", idl: ledgerIdl },
  // dao: { canisterId: "bd3sg-teaaa-aaaaa-qaaba-cai", idl: daoIdl }, // local
  // ledger: { canisterId: "br5f7-7uaaa-aaaaa-qaaca-cai", idl: ledgerIdl }, // local
};
