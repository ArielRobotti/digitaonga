import Button from "../shared/Button";
import ProgressBar from "../shared/ProgressBar";

const Container = ({ title, description, Icon, onNext, onBack, step, totalSteps }) => {
  return (
    <section className="grid place-items-center gap-12 text-center mt-12">
      <h3 className="uppercase">{title}</h3>

      <div className="w-[258px] h-[258px] grid place-items-center">
        <Icon />
      </div>

      <p className="text-gray-900 max-w-[300px] md:max-w-[664px] xl:max-w-[970px]">{description}</p>

      <div className="grid gap-4 xl:grid-cols-2">
        <Button className="w-[316px] xl:w-[214px] border" onClick={onBack}>
          Skip
        </Button>
        <Button className="bg-kokowai text-white w-[316px] xl:w-[214px]" onClick={onNext}>
          {step === 3 ? "Finish" : "Next"}
        </Button>
      </div>

      <ProgressBar step={step} totalSteps={totalSteps} />
    </section>
  );
};

export default Container;
