import Container from "../../components/on boarding/Container";
import { onBoardingSteps } from "../../utils/data";
import { useNavigate } from "react-router";
import { useState } from "react";

const OnBoarding = () => {
  // State
  const [step, setStep] = useState(0);

  // Navigation
  const navigate = useNavigate();

  // Handlers
  const handleNext = () =>
    step === onBoardingSteps.length - 1 ? navigate("/first_steps") : setStep(step + 1);     // Go to the next step
  const handleBack = () => setStep(step ? step - 1 : 0);                                    // Go to the previous step

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
