"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";

import PhoneVerification from "@/components/Registrations/PhoneVerification";
import OneTimePassword from "@/components/Registrations/OneTimePassword";
import ResetPassword from "@/components/Registrations/ResetPassword";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);

  interface StepType {
    title: string;
    description: string;
    component: React.ReactNode;
  }

  const steps: StepType[] = [
    {
      title: "Forgot your password?",
      description: "OTP will be sent to your phone number",
      component: <PhoneVerification onNext={() => setStep(2)} />,
    },
    {
      title: "OTP Verification",
      description: "Please enter the OTP sent to your phone number",
      component: <OneTimePassword onNext={() => setStep(3)} />,
    },
    {
      title: "Reset Password",
      description: "Please enter your new password",
      component: <ResetPassword />,
    },
  ];

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <Card className="overflow-hidden shadow-lg rounded">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-xl font-bold text-foreground">
              {steps[step - 1].title}
            </h1>
            <p className="text-balance text-sm text-muted-foreground mt-1">
              {steps[step - 1].description}
            </p>
          </div>
          {steps[step - 1].component}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
