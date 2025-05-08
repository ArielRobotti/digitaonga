import Button from "../shared/Button";
import ProgressBar from "../shared/ProgressBar";

const Container = ({ title, description, Icon, onNext, onBack, step, totalSteps }) => {
  return (
    // <section className="flex flex-col justify-between items-center gap-4 text-center">
    <section className="grid place-items-center gap-12 text-center mt-12">
      <h3 className="uppercase">{title}</h3>

      <div className="w-[258px] h-[258px] grid place-items-center">
        <Icon />
      </div>

      <p className="text-gray-900 max-w-[300px] md:max-w-[664px]">{description}</p>

      <div className="grid gap-4">
        <Button className="w-[316px] border" onClick={onBack}>
          Skip
        </Button>
        <Button className="bg-kokowai text-white w-[316px]" onClick={onNext}>
          {step === 3 ? "Finish" : "Next"}
        </Button>
      </div>

      <ProgressBar step={step} totalSteps={totalSteps} />
    </section>
  );
};

export default Container;
