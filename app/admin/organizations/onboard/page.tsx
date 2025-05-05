"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

import UserRegistration from "@/components/Registrations/UserRegistration";
import OneTimePassword from "@/components/Registrations/OneTimePassword";

import AddOrganization from "@/components/Organizations/AddOrganization";

const Organizations = () => {
  const pathname = usePathname();
  const [step, setStep] = useState(1);

  const router = useRouter();

  const handleNext = () => {
    if (step === 3) {
      router.push("/admin/organizations");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      <div className="space-y-2 mb-4">
        <div className="font-semibold text-md">Add Organization's Owner</div>
        <div>
          <Label className="pb-2 text-sm">Step {step}/3</Label>
          <Progress value={(step / 3) * 100} />
        </div>
      </div>

      {step === 1 && (
        <UserRegistration pathname={pathname} onNext={() => setStep(2)} />
      )}
      {step == 2 && <OneTimePassword onNext={() => setStep(3)} />}

      {step == 3 && <AddOrganization onNext={handleNext} />}
    </div>
  );
};

export default Organizations;
