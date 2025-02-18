import Container from "../../components/on boarding/Container";
import { onBoardingSteps } from "../../utils/data";
import { useState } from "react";

const OnBoarding = () => {
  const [step, setStep] = useState(0);

  const handleNext = () =>
    setStep(step < onBoardingSteps.length - 1 ? step + 1 : onBoardingSteps.length - 1);
  const handleBack = () => setStep(step ? step - 1 : 0);

  return (
    <main className="p-4">
      <Container {...onBoardingSteps[step]} onNext={handleNext} step={step} onBack={handleBack} />
    </main>
  );
};

export default OnBoarding;
