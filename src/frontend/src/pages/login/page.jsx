import { DigitaongaCompleteIcon, NFIDIcon } from "../../components/ui/icons";
import { p2str, shortP } from "../../utils/functions";

import Button from "../../components/shared/Button";
import useMember from "../../hooks/useMember";

const Login = () => {
  const { user } = useMember();

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
