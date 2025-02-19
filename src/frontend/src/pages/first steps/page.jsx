import Button from "../../components/shared/Button";

const FirstSteps = () => {
  return (
    <main>
      <div className="absolute top-[60px] w-full h-32 bg-gray-300 -z-10" />

      <div className="grid place-items-center pt-16">
        <img
          src="/images/jpg/stars.jpg"
          alt="placeholder"
          className="w-36 h-36 object-cover rounded-full"
        />
      </div>

      <section className="grid place-items-center">
        <h2 className="uppercase my-6">Welcome user!</h2>

        <h4 className="uppercase mb-12">First steps</h4>

        <p className="max-w-[300px]">
          This platform empowers advocacy, preserves cultural artifacts, and enables member
          participation through decentralized governance. We’re excited to have you on board—let’s
          shape the future together!
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
