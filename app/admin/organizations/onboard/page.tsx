"use client";

import { useAuth } from "@/context/AuthContext";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import UserRegistration from "@/components/Registrations/UserRegistration";
import OneTimePassword from "@/components/Registrations/OneTimePassword";
import AddOrganization from "@/components/Organizations/AddOrganization";

const OrganizationRegistration = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // useEffect(() => {
  //   if (!isLoading && user?.is_admin !== true) {
  //     router.replace("/login"); // Replace this later
  //   }
  // }, [isLoading, user, router]);

  // ⛔ Prevent rendering before auth status is known
  if (isLoading) return <p>Checking authentication...</p>; // Add loading animation later
  // if (user?.is_admin !== true) return null;

  const completeRegistration = () => {
    router.push("/admin/organizations");
  };

  interface StepType {
    title: string;
    component: React.ReactNode;
  }

  const steps: StepType[] = [
    {
      title: "User Information",
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
    <div className="mx-auto max-w-5xl rounded-3xl border border-border/60 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-6">
      <div className="mb-6 space-y-2">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">
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
