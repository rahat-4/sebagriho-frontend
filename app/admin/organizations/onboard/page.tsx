"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import UserRegistration from "@/components/Registrations/UserRegistration";
import OneTimePassword from "@/components/Registrations/OneTimePassword";
import AddOrganization from "@/components/Organizations/AddOrganization";

const OrganizationRegistration = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const completeRegistration = () => {
    router.push("/admin/organizations");
  };

  interface StepType {
    title: string;
    component: React.ReactNode;
  }

  const steps: StepType[] = [
    {
      title: "Organization user registration",
      component: <UserRegistration onNext={() => setStep(2)} />,
    },
    {
      title: "OTP Verification",
      component: <OneTimePassword onNext={() => setStep(3)} />,
    },
    {
      title: "Organization Details",
      component: <AddOrganization onComplete={completeRegistration} />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white p-4 rounded-lg shadow-sm">
      <div className="space-y-2 mb-6">
        <div>
          <Label className="text-sm">
            Step {step} of {steps.length}: {steps[step - 1].title}
          </Label>
          <Progress value={(step / steps.length) * 100} className="mt-2" />
        </div>
      </div>

      {steps[step - 1].component}
    </div>
  );
};

export default OrganizationRegistration;
