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

import { useAuth } from "@/context/AuthContext";
import {
  AddHomeoPatient,
  HomeoPatientAdditonalInformations,
} from "@/components/HomeoPatients/AddHomeopatient";
import { Plus } from "lucide-react";

// Enhanced Add Patient Dialog Component
const AddPatientDialog = () => {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"lg"}
          className="bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        >
          <Plus className="h-8 w-8" />
          Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[330px] max-h-[650px] sm:max-w-[500px] rounded-2xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Add Homeopathic Patient
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-xs">
            Enter patient information to create a new record.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {currentStep === 1 && (
            <AddHomeoPatient
              onNext={handleNextStep}
              organizationId={organization?.uid}
              setPatientUid={setPatientUid}
            />
          )}
          {currentStep === 2 && (
            <HomeoPatientAdditonalInformations
              organizationId={organization?.uid}
              patientUid={patientUid}
              onComplete={completeRegistration}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientDialog;
