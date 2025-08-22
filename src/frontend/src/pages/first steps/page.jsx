import Button from "../../components/shared/Button";
import useMemberStore from "../../store/useMemberStore";

const FirstSteps = () => {
  const { member } = useMemberStore();
  // TODO (fran): continuar verificando el miembro

  return (
    <main className="xl:flex xl:flex-col-reverse">
      <div className="grid place-items-center xl:mt-6">
        <img src="/images/png/pattern_kokowaif.png" alt="kokowaif pattern" />
      </div>

      <section className="grid place-items-center gap-14 mt-14 xl:mt-32">
        <h2 className="uppercase">Nau Mai Haere Mai!</h2>

        <h4 className="uppercase">Welcome to Digitaonga</h4>

        <p className="max-w-[300px] xl:max-w-[645px]">
          A platform that connects communities, preserves taonga, and enables kaitiakitanga and
          guardianship through decentralized governance. Ka mua ka muri - let’s shape the future
          together!
        </p>

        <div className="grid place-items-center gap-4 mt-40 w-full md:mt-0">
          <Button variant="kokowai" onClick={() => window.location.href = `/assign-role`}>Assign roles</Button>
          {/* <Button variant="kokowai">Complete your profile</Button> */}
        </div>
      </section>
    </main>
  );
};

export default FirstSteps;
