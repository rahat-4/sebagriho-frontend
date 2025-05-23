import DynamicForm, {
  FormConfig,
  FieldConfig,
} from "@/components/Reusable/FormComponent";

import { homeoPatientSchemaStepTwo } from "@/schemas/AddHomeoPatient";

interface StepTwoProps {
  onPrevious: () => void;
  responseData: string;
  setResponseData?: (data: any) => void;
}

const StepTwo = ({
  onPrevious,
  responseData,
  setResponseData,
}: StepTwoProps) => {
  // Define field configuration
  const fields: FieldConfig[] = [
    {
      label: "Age",
      name: "age",
      type: "number",
      placeholder: "Enter age",
    },
    {
      label: "Gender",
      name: "gender",
      type: "select",
      options: [
        { value: "MALE", label: "Male" },
        { value: "FEMALE", label: "Female" },
        { value: "OTHER", label: "Other" },
      ],
      placeholder: "Select a gender",
    },

    {
      label: "Miasm",
      name: "miasm",
      type: "select",
      options: [
        { value: "ACUTE", label: "Acute" },
        { value: "TYPHOID", label: "Typhoid" },
        { value: "MALARIAL", label: "Malarial" },
        { value: "RINGWORM", label: "Ringworm" },
        { value: "PSORIC", label: "Psoric" },
        { value: "SYCOTIC", label: "Sycotic" },
        { value: "CANCER", label: "Cancer" },
        { value: "TUBERCULAR", label: "Tubercular" },
        { value: "LEPROSY", label: "Leprosy" },
        { value: "SYPHILITIC", label: "Syphilitic" },
        { value: "AIDS", label: "AIDS" },
      ],
      placeholder: "Select miasm",
    },
    {
      label: "Case history",
      name: "caseHistory",
      type: "textarea",
      placeholder: "Enter case history",
    },
    {
      label: "Patient habits",
      name: "habits",
      type: "textarea",
      placeholder: "Enter patient habits",
    },
  ];

  // Form configuration
  const formConfig: FormConfig = {
    fields,
    schema: homeoPatientSchemaStepTwo,
    apiEndpoint: `/organization/homeopathy/patients/${responseData}`,
    method: "PUT",
    redirectPath: `/patients/${responseData}`,
    successMessage: "Patient added successfully.",
    submitButtonText: "Submit",
    title: "Step 2: Medical & Lifestyle Details",
    setResponseData: setResponseData,
    className: "max-w-2xl mx-auto p-6",
  };

  return <DynamicForm config={formConfig} />;
};

export default StepTwo;
