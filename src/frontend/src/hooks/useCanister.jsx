import { Actor, HttpAgent } from "@dfinity/agent";
import { useEffect, useMemo, useState } from "react";

import { canisters } from "../utils/canisters";
import { env } from "../utils/env";
import { useAgent } from "@nfid/identitykit/react";

const useCanister = (canisterName = "dao") => {
  const canister = canisters[canisterName];

  // Use an unauthenticatedAgent (aka anonymous agent)
  // when the user doesn't need to execute the call themselves.
  const [unauthenticatedAgent, setUnauthenticatedAgent] = useState();

  useEffect(() => {
    HttpAgent.create({ host: env.ICP_API_HOST }).then(setUnauthenticatedAgent);
  }, []);

  // Use an authenticatedAgent when making authenticated calls.
  // A wallet approval pop-up will be displayed if necessary.
  const authenticatedAgent = useAgent({ host: env.ICP_API_HOST });

  // Actor for methods the user DOES NOT need to be authenticated to call (i.e. icrc2_allowance).
  // These will never result in a wallet approval prompt.
  const nonTargetUnauthenticatedActor = useMemo(() => {
    return (
      unauthenticatedAgent &&
      Actor.createActor(canister.idl, {
        agent: unauthenticatedAgent,
        canisterId: canister.canisterId,
      })
    );
  }, [unauthenticatedAgent, canister, canisterName]);

  // Actor for methods the user DOES need to be authenticated to call (i.e. icrc2_approve).
  // These may result in a wallet approval prompt depending on how the user authenticated.
  // Will be undefined until user is not connected or IdentityKitAgent is being created.
  const authenticatedActor = useMemo(() => {
    return (
      authenticatedAgent &&
      // or nonTargetIdlFactory
      Actor.createActor(canister.idl, {
        agent: authenticatedAgent,
        canisterId: canister.canisterId, // or NON_TARGET_CANISTER_ID_TO_CALL
      })
    );
  }, [authenticatedAgent, canister, canisterName]);

  return [authenticatedActor, nonTargetUnauthenticatedActor];
};

export default useCanister;
