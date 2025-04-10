// Improved and optimized version
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus } from "lucide-react";

const FormSection = ({ title, fields, isGrid = true, isColThree }: any) => (
  <div className="">
    <div className="font-semibold text-sm mb-2">{title}</div>
    <div className="border border-gray-200 rounded p-4">
      <div
        className={`${
          isGrid && isColThree
            ? "grid grid-cols-1 md:grid-cols-3 gap-4"
            : isGrid && !isColThree
            ? "grid grid-cols-1 md:grid-cols-2 gap-4"
            : "flex flex-col gap-4"
        }`}
      >
        {fields.map((field: any, idx: number) => (
          <div key={idx}>
            <Label className="pb-1">{field.label}</Label>
            <Input
              placeholder={field.placeholder || field.label}
              className="w-full text-sm"
            />
          </div>
        ))}
      </div>
    </div>
    <div className="flex items-center justify-end text-xs pt-2">
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Plus size={14} /> Add More
      </Button>
    </div>
  </div>
);

const StepOne = ({ onNext }: { onNext: () => void }) => (
  <div className="space-y-4">
    <div className="font-semibold text-lg">Add new doctor</div>
    <div>
      <Label className="pb-2">Step 1/2</Label>
      <Progress value={50} />
    </div>
    {[
      "First name",
      "Last name",
      "Phone",
      "Email",
      "National id",
      "Gender",
      "Registration number",
      "Appointment fee",
      "Followup fee",
    ].map((label, idx) => (
      <div key={idx}>
        <Label className="pb-1">{label}</Label>
        <Input placeholder={label} className="w-full text-sm" />
      </div>
    ))}
    <div className="flex justify-end">
      <Button onClick={onNext} className="text-sm" size="lg">
        Save & Continue
      </Button>
    </div>
  </div>
);

const StepTwo = ({ onBack }: { onBack: () => void }) => (
  <div className="space-y-6">
    <div className="font-semibold text-lg">Add new doctor</div>
    <div>
      <Label className="pb-2">Step 2/2</Label>
      <Progress value={100} />
    </div>

    {/* Department Section */}
    <div>
      <div className="font-semibold pb-2 text-sm">Department</div>
      <div className="border border-gray-200 rounded p-4">
        <div className="pb-4">
          <Label className="pb-1">Name</Label>
          <Select>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent className="max-h-[150px]">
              <SelectGroup>
                {[...Array(8)].map((_, i) => (
                  <SelectItem key={i} value={`department-${i + 1}`}>
                    Department {i + 1}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="pb-1">Years of experience</Label>
            <Input className="w-full text-sm" />
          </div>
          <div>
            <Label className="pb-1">Expertise</Label>
            <Input className="w-full text-sm" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end text-xs pt-2">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Plus size={14} /> Add More
        </Button>
      </div>
    </div>

    {/* Degrees Section */}
    <FormSection
      title="Degrees"
      fields={[
        { label: "Degree Name" },
        { label: "Institute" },
        { label: "Result" },
        { label: "Year" },
      ]}
    />

    {/* Achievements Section */}
    <FormSection
      title="Achievements"
      fields={[{ label: "Title" }, { label: "Source" }, { label: "Year" }]}
      isGrid={true}
      isColThree={true}
    />

    {/* Hospital Affiliation Section */}
    <FormSection
      title="Hospital Affiliation"
      fields={[{ label: "Name" }, { label: "Title" }, { label: "Year" }]}
      isGrid={true}
      isColThree={true}
    />

    <div className="flex justify-end gap-2 pt-4">
      <Button variant="outline" onClick={onBack} className="text-sm" size="lg">
        Back
      </Button>
      <Button className="text-sm" size="lg">
        Submit
      </Button>
    </div>
  </div>
);

const FormPage = () => {
  const [step, setStep] = useState(1);
  return (
    <div className="max-w-4xl mx-auto bg-white">
      {step === 1 && <StepOne onNext={() => setStep(2)} />}
      {step === 2 && <StepTwo onBack={() => setStep(1)} />}
    </div>
  );
};

export default FormPage;
