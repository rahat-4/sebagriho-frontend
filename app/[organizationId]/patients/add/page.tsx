"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

import StepOne from "./components/stepOne";
import StepTwo from "./components/stepTwo";

const AddHomeoPatient = () => {
  const router = useRouter();
  const { organization } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [patientUid, setPatientUid] = useState<any>(null);

  const completeRegistration = () => {
    if (organization && patientUid) {
      router.replace(`/${organization?.uid}/patients/${patientUid}`);
    } else {
      console.error("Organization or patientUid is null");
    }
  };
  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="text-lg font-bold mb-4">Add Homeopathic Patient</h1>
      {currentStep === 1 && (
        <StepOne
          onNext={handleNextStep}
          organizationId={organization?.uid}
          setPatientUid={setPatientUid}
        />
      )}
      {currentStep === 2 && (
        <StepTwo
          organizationId={organization?.uid}
          patientUid={patientUid}
          onComplete={completeRegistration}
        />
      )}
      {/* setResponseData(null); */}
    </div>
  );
};

export default AddHomeoPatient;
