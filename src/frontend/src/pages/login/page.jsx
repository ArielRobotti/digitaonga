import { DigitaongaCompleteIcon, NFIDIcon } from "../../components/ui/icons";
import { p2str, shortP } from "../../utils/functions";

import Button from "../../components/shared/Button";
import { useAuth } from "@nfid/identitykit/react";
import useCanister from "../../hooks/useCanister";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const Login = () => {
  const { connect, user, isConnecting } = useAuth();
  const [dao] = useCanister();
  const navigate = useNavigate();

  // get or create user
  useEffect(() => {
    if (user && dao) {
      (async () => {
        console.log({ dao });
        try {
          const member = await dao.get_member(user.principal);
          console.log({ member });
          // TODO (fran): save member in store
          if (member?.Err) {
            const new_member = await dao.create_member();
            console.log({ new_member });
            if (new_member?.Ok) {
              // save here
              navigate("/on_boarding");
            }
          } else {
            // save here
            navigate("/");
          }
        } catch (err) {
          console.log("getting or creating member error:", err);
        }
      })();
    }
  }, [user, dao]);

  return (
    <main>
      <section className="min-h-44 w-full bg-kokowai grid place-items-center">
        <DigitaongaCompleteIcon />
      </section>

      <section className="flex flex-col items-center justify-between h-[calc(100vh-236px)] pt-[120px] pb-[60px]">
        <h3 className="text-center max-w-[350px]">PRESERVE. RECONNECT. REPATRIATE.</h3>

        {user ? (
          shortP(p2str(user.principal), 8)
        ) : (
          <Button
            variant="kokowai"
            className="flex items-center justify-center gap-2"
            onClick={() => connect()}
            disabled={isConnecting}
          >
            Log in with <NFIDIcon />
          </Button>
        )}

        <img src="/images/png/pattern_kokowaif.png" alt="kokowaif pattern" />
      </section>
    </main>
  );
};

export default Login;
