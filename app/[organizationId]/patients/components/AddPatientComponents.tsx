"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  AddHomeoPatient,
  HomeoPatientAdditonalInformations,
} from "@/components/HomeoPatients/AddHomeopatient";

interface AddPatientDialogProps {
  onPatientCreated?: () => void;
}

const AddPatientDialog = ({ onPatientCreated }: AddPatientDialogProps) => {
  const router = useRouter();
  const { organizationId } = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [patientUid, setPatientUid] = useState<string | null>(null);

  const completeRegistration = () => {
    if (organizationId && patientUid) {
      setIsOpen(false);
      setCurrentStep(1);
      setPatientUid(null);
      onPatientCreated?.();
      router.push(`/${organizationId}/patients/${patientUid}`);
    }
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setCurrentStep(1);
      setPatientUid(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-gradient-to-br from-[#205072] to-[#2d6a96] hover:from-[#183d56] hover:to-[#205072] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] rounded-2xl border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50">
        <DialogHeader className="gap-0">
          <DialogTitle className="text-lg font-bold bg-gradient-to-r from-[#205072] to-[#2ab7ca] bg-clip-text text-transparent">
            Add Homeopathic Patient
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-xs">
            {currentStep === 1
              ? "Enter patient basic information"
              : "Enter patient clinical information"}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)] pr-2">
          <div className="py-4">
            {currentStep === 1 && (
              <AddHomeoPatient
                onNext={handleNextStep}
                organizationId={organizationId as string}
                setPatientUid={setPatientUid}
              />
            )}
            {currentStep === 2 && patientUid && (
              <HomeoPatientAdditonalInformations
                organizationId={organizationId as string}
                patientUid={patientUid}
                onComplete={completeRegistration}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientDialog;
