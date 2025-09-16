import { Actor, HttpAgent } from "@dfinity/agent";
import { canisters } from "../utils/canisters";
import { env } from "../utils/env";
import { useAgent } from "@nfid/identitykit/react";
import { useMemo } from "react";

const useCanister = (canisterName = "dao") => {
  const canister = canisters[canisterName];
  const isLocal = env.ICP_API_HOST.includes("localhost");

  // memoizamos el agente no autenticado
  const unauthenticatedAgent = useMemo(() => {
    const agent = HttpAgent.createSync({
      host: env.ICP_API_HOST,
      shouldFetchRootKey: isLocal,
    });
    if (isLocal) {
      agent.fetchRootKey().catch((err) => {
        console.error("Failed to fetch root key:", err);
      });
    }
    return agent;
  }, [env.ICP_API_HOST, isLocal]);

  // el hook externo ya maneja memo, pero igual lo tratamos estable
  const authenticatedAgent = useAgent({
    host: env.ICP_API_HOST,
    shouldFetchRootKey: isLocal,
  });

  if (isLocal) {
    authenticatedAgent?.fetchRootKey().catch((err) => {
      console.error("Failed to fetch root key auth:", err);
    });
  }

  // memoizamos los actores
  const nonTargetUnauthenticatedActor = useMemo(() => {
    return (
      unauthenticatedAgent &&
      Actor.createActor(canister.idl, {
        agent: unauthenticatedAgent,
        canisterId: canister.canisterId,
      })
    );
  }, [unauthenticatedAgent, canister.canisterId, canister.idl]);

  const authenticatedActor = useMemo(() => {
    return (
      authenticatedAgent &&
      Actor.createActor(canister.idl, {
        agent: authenticatedAgent,
        canisterId: canister.canisterId,
      })
    );
  }, [authenticatedAgent, canister.canisterId, canister.idl]);

  return [authenticatedActor, nonTargetUnauthenticatedActor];
};

export default useCanister;
