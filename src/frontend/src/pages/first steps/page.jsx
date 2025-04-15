import Button from "../../components/shared/Button";

const FirstSteps = () => {
  return (
    <main>
      {/* <div className="absolute top-[60px] w-full h-32 bg-gray-300 -z-10" />

      <div className="grid place-items-center pt-16">
        <img
          src="/images/jpg/stars.jpg"
          alt="placeholder"
          className="w-36 h-36 object-cover rounded-full"
        />
      </div> */}
      <div className="grid place-items-center">
        <img src="/images/png/pattern_kokowaif.png" alt="kokowaif pattern" />
      </div>

      <section className="grid place-items-center gap-14 mt-14">
        <h2 className="uppercase">Nau Mai Haere Mai!</h2>

        <h4 className="uppercase">Welcome to Digitaonga</h4>

        <p className="max-w-[300px]">
          A platform that connects communities, preserves taonga, and enables kaitiakitanga and
          guardianship through decentralized governance. Ka mua ka muri - let’s shape the future
          together!
        </p>

        <div className="grid place-items-center gap-4 mt-40 w-full">
          <Button variant="kokowai">Assign roles</Button>
          <Button variant="kokowai">Complete your profile</Button>
        </div>
      </section>
    </main>
  );
};

export default FirstSteps;
