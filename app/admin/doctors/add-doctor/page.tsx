"use client";
import { useState } from "react";

import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StepOne = ({ onNext }: { onNext: () => void }) => (
  <div className="space-y-4">
    <div className="font-semibold">Add new doctor</div>
    <div>
      <Label className="pb-2">Step 1/2</Label>
      <Progress value={50} />
    </div>
    <div>
      <Label className="pb-1">First name</Label>
      <Input placeholder="First name" className="w-full text-sm" />
    </div>
    <div>
      <Label className="pb-1">Last name</Label>
      <Input placeholder="Last name" className="w-full text-sm" />
    </div>
    <div>
      <Label className="pb-1">Phone</Label>
      <Input placeholder="Phone" className="w-full text-sm" />
    </div>
    <div>
      <Label className="pb-1">Email</Label>
      <Input placeholder="Email" className="w-full text-sm" />
    </div>
    <div>
      <Label className="pb-1">National id</Label>
      <Input placeholder="National id" className="w-full text-sm" />
    </div>
    <div>
      <Label className="pb-1">Gender</Label>
      <Input placeholder="Gender" className="w-full text-sm" />
    </div>
    <div>
      <Label className="pb-1">Registration number</Label>
      <Input placeholder="Registration number" className="w-full text-sm" />
    </div>
    <div>
      <Label className="pb-1">Appointment fee</Label>
      <Input placeholder="Appointment fee" className="w-full text-sm" />
    </div>
    <div>
      <Label className="pb-1">Followup fee</Label>
      <Input placeholder="Followup fee" className="w-full text-sm" />
    </div>
    <div className="flex justify-end">
      <Button onClick={onNext}>Save & Continue</Button>
    </div>
  </div>
);

const StepTwo = ({ onBack }: { onBack: () => void }) => (
  <div className="space-y-4">
    <div className="font-semibold">Add new doctor</div>
    <div>
      <Label className="pb-2">Step 2/2</Label>
      <Progress value={100} />
    </div>
    <div>
      <Label className="pb-1">Department</Label>
      <Select>
        <SelectTrigger className="w-full text-sm">
          <SelectValue placeholder="Select a department" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="h-[150px]">
            <SelectItem value="department-1">Department 1</SelectItem>
            <SelectItem value="department-2">Department 2</SelectItem>
            <SelectItem value="department-3">Department 3</SelectItem>
            <SelectItem value="department-4">Department 4</SelectItem>
            <SelectItem value="department-5">Department 5</SelectItem>
            <SelectItem value="department-6">Department 6</SelectItem>
            <SelectItem value="department-7">Department 7</SelectItem>
            <SelectItem value="department-8">Department 8</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label className="pb-1">Years of experience</Label>
      <Input placeholder="Years of experience" className="w-full text-sm" />
    </div>
    <div>
      <Label className="pb-1">Expertise</Label>
      <Input placeholder="Expertise" className="w-full text-sm" />
    </div>
    <div className="flex justify-end gap-2">
      <Button variant={"outline"} onClick={onBack}>
        Back
      </Button>
      <Button>Save</Button>
    </div>
  </div>
);

const FormPage = () => {
  const [step, setStep] = useState(1);
  return (
    <div>
      {step == 1 && <StepOne onNext={() => setStep(2)} />}
      {step == 2 && <StepTwo onBack={() => setStep(1)} />}
    </div>
  );
};

export default FormPage;
