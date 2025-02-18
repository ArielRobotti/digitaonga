import Button from "../shared/Button";

const Container = ({ title, description, onNext, onBack, step }) => {
  return (
    // <section className="flex flex-col justify-between items-center gap-4 text-center">
    <section className="grid place-items-center gap-12 text-center mt-12">
      <h3 className="uppercase">{title}</h3>

      <div className="w-[258px] h-[258px] bg-[#d9d9d9]" />

      <p className="text-gray-900 max-w-[300px]">{description}</p>

      <div className="grid gap-4">
        <Button className="bg-kokowai text-white w-[316px]" onClick={onNext}>
          {step === 3 ? "Finish" : "Next"}
        </Button>
        <Button className="w-[316px] border" onClick={onBack}>
          Skip
        </Button>
      </div>

      <div className="w-[288px] h-2 bg-gray-300 overflow-hidden">
        <div
          className="h-full bg-kokowai transition-all duration-300"
          style={{ width: `${(step + 1) * 25}%` }}
        />
      </div>
    </section>
  );
};

export default Container;
