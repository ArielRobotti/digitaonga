import Container from "../../components/on boarding/Container";
import { onBoardingSteps } from "../../utils/data";
import { useNavigate } from "react-router";
import { useState } from "react";

const OnBoarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () =>
    step === onBoardingSteps.length - 1 ? navigate("/first_steps") : setStep(step + 1);
  const handleBack = () => setStep(step ? step - 1 : 0);

  return (
    <main className="p-4">
      <Container
        {...onBoardingSteps[step]}
        onNext={handleNext}
        step={step}
        onBack={handleBack}
        totalSteps={onBoardingSteps.length}
      />
    </main>
  );
};

export default OnBoarding;
