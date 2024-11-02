import { useState } from "react";

const useStepCount = (totalSteps:number) => {
  const [currentStep, setCurrentStep] = useState(1);

  const goToStep = (step:number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const isActiveStep = (step:number) => {
    return step === currentStep;
  };

  return {
    currentStep,
    goToStep,
    goToNextStep,
    goToPrevStep,
    isActiveStep,
  };
};

export default useStepCount;
