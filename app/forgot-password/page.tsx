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
    <div className="flex min-h-svh flex-col items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(42,183,202,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(32,80,114,0.1),_transparent_28%)] p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <Card className="overflow-hidden rounded-3xl border border-border/60 bg-white/90 shadow-xl backdrop-blur">
          <div className="flex flex-col items-center border-b border-border/60 px-6 pt-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-darker">
              Account recovery
            </p>
            <h1 className="mt-2 text-xl font-bold text-foreground">
              {steps[step - 1].title}
            </h1>
            <p className="mt-1 text-balance text-sm text-muted-foreground">
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
