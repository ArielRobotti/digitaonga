import { Actor, HttpAgent } from "@dfinity/agent";

import { canisters } from "../utils/canisters";
import { env } from "../utils/env";
import { useAgent } from "@nfid/identitykit/react";
import { useMemo } from "react";

const useCanister = (canisterName = "dao") => {
  const canister = canisters[canisterName];
  // console.log(env);
  // console.log({ canister });

  const isLocal = env.ICP_API_HOST.includes("localhost");

  const unauthenticatedAgent = HttpAgent.createSync({
    host: env.ICP_API_HOST,
    shouldFetchRootKey: isLocal,
  });

  const authenticatedAgent = useAgent({
    host: env.ICP_API_HOST,
    shouldFetchRootKey: isLocal,
  });

  if (isLocal) {
    unauthenticatedAgent.fetchRootKey().catch((err) => {
      console.error("Failed to fetch root key:", err);
    });
    // console.log({ authenticatedAgent });
    authenticatedAgent?.fetchRootKey().catch((err) => {
      console.error("Failed to fetch root key auth:", err);
    });
  }

  const nonTargetUnauthenticatedActor = useMemo(() => {
    return (
      unauthenticatedAgent &&
      Actor.createActor(canister.idl, {
        agent: unauthenticatedAgent,
        canisterId: canister.canisterId,
      })
    );
  }, [unauthenticatedAgent, canister, canisterName]);

  const authenticatedActor = useMemo(() => {
    return (
      authenticatedAgent &&
      Actor.createActor(canister.idl, {
        agent: authenticatedAgent,
        canisterId: canister.canisterId,
      })
    );
  }, [authenticatedAgent, canister, canisterName]);

  // console.log({ authenticatedActor });

  return [authenticatedActor, nonTargetUnauthenticatedActor];
};

export default useCanister;
