"use client";

import { useState } from "react";

import StepOne from "./components/stepOne";
import StepTwo from "./components/stepTwo";

const AddHomeoPatient = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [serialNumber, setSerialNumber] = useState<any>(null);

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="text-lg font-bold mb-4">Add Homeopathic Patient</h1>
      {currentStep === 1 && (
        <StepOne onNext={handleNextStep} setSerialNumber={setSerialNumber} />
      )}
      {currentStep === 2 && <StepTwo serialNumber={serialNumber} />}
      {/* setResponseData(null); */}
    </div>
  );
};

export default AddHomeoPatient;
