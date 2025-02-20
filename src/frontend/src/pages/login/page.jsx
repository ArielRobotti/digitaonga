import { DigitaongaCompleteIcon, NFIDIcon } from "../../components/ui/icons";

import Button from "../../components/shared/Button";
import { useAuth } from "@nfid/identitykit/react";

const Login = () => {
  const { connect } = useAuth();

  return (
    <main>
      <section className="min-h-44 w-full bg-kokowai grid place-items-center">
        <DigitaongaCompleteIcon />
      </section>

      <section className="flex flex-col items-center justify-between h-[calc(100vh-236px)] pt-[120px] pb-[60px]">
        <h3 className="text-center max-w-[350px]">PRESERVE. RECONNECT. REPATRIATE.</h3>

        <div className="flex flex-col gap-4">
          <Button
            variant="kokowai"
            className="flex items-center justify-center gap-2"
            onClick={() => connect()}
          >
            Log in with <NFIDIcon />
          </Button>
          <Button variant="kokowai">Registrer</Button>
        </div>

        <img src="/images/png/pattern_kokowaif.png" alt="kokowaif pattern" />
      </section>
    </main>
  );
};

export default Login;
