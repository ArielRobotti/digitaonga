import { DigitaongaCompleteIcon, NFIDIcon } from "../../components/ui/icons";
import { p2str, shortP } from "../../utils/functions";
import { useNavigate } from "react-router";
import { useEffect } from "react";

import Button from "../../components/shared/Button";
import useMember from "../../hooks/useMember";

const Login = () => {
  // Store
  const { user, connect, isConnecting } = useMember();
  const navigate = useNavigate()

  useEffect(() => {
    if(user) navigate("/digital-taonga")
  }, [user])

  return (
    <main>
      {/* Icon responsive */}
      <section className="min-h-44 w-full bg-kokowai grid place-items-center">
        {window.innerWidth >= 1280 ? (
          <img
            src="/images/png/pattern_kokowaif_white.png"
            alt="kokowaif pattern"
            className="py-6"
          />
        ) : (
          <DigitaongaCompleteIcon/>
          )}
      </section>

      <section className="flex flex-col items-center justify-between h-[calc(100vh-236px)] pt-[120px] pb-[60px] xl:h-full xl:pt-0">
          <div 
            className={`flex flex-col items-center ${
              user ? " cursor-pointer hover:text-[#912424] duration-500" : ""
            }`}

            onClick={()=> {if(user) navigate("/")}}
          >
        <img
          src="/images/png/primary_kokowaif.png"
          alt="digitaonga kokowaif"
          className="hidden xl:block"
          />

        <h3 className="text-center max-w-[350px] xl:max-w-full xl:mb-14">
          PRESERVE. RECONNECT. REPATRIATE.
        </h3>
          </div>

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

        <img
          src="/images/png/pattern_kokowaif.png"
          alt="kokowaif pattern"
          className="block xl:hidden"
        />
      </section>
    </main>
  );
};

export default Login;
