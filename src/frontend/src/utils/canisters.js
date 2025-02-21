import { idlFactory as daoIdl } from "../../../declarations/dao/dao.did";
import { idlFactory as ledgerIdl } from "../../../declarations/ledger/ledger.did";

export const canisters = {
  dao: { canisterId: "ztccp-4aaaa-aaaal-qm6vq-cai", idl: daoIdl },
  ledger: { canisterId: "ztccp-4aaaa-aaaal-qm6vq-cai", idl: ledgerIdl },
};
