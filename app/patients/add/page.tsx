"use client";

import DynamicForm, {
  FormConfig,
  FieldConfig,
} from "@/components/Reusable/FormComponent";
import { homeoPatientSchema } from "@/schemas/AddHomeoPatient";

const AddHomeoPatient = () => {
  // Define field configuration
  const fields: FieldConfig[] = [
    {
      label: "Avatar",
      name: "avatar",
      type: "file",
      accept: "image/*",
    },
    {
      label: "Old serial number",
      name: "oldSerialNumber",
      type: "text",
      placeholder: "Enter old serial number",
    },
    {
      label: "Patient name",
      name: "name",
      type: "text",
      required: true,
      placeholder: "Enter patient full name",
    },
    {
      label: "Phone Number",
      name: "phone",
      type: "tel",
      required: true,
      placeholder: "Enter phone number",
    },
    {
      label: "Relative's phone number",
      name: "relativePhone",
      type: "tel",
      placeholder: "Enter relative's phone number",
    },
    {
      label: "Address",
      name: "address",
      type: "textarea",
      placeholder: "Enter complete address",
    },
  ];

  // Transform data before sending to API
  const transformData = (data: any) => {
    const transformedData = { ...data };

    // Split name into first_name and last_name
    if (data.name) {
      const [first_name, ...rest] = data.name.trim().split(" ");
      transformedData.first_name = first_name;
      transformedData.last_name = rest.join(" ");
      delete transformedData.name; // Remove original name field
    }

    return transformedData;
  };

  // Form configuration
  const formConfig: FormConfig = {
    fields,
    schema: homeoPatientSchema,
    apiEndpoint: "/organization/homeopathy/patients",
    method: "POST",
    redirectPath: "/patients",
    successMessage: "Patient added successfully.",
    submitButtonText: "Add Patient",
    title: "Add New Patient",
    transformData,
    className: "max-w-2xl mx-auto p-6",
  };

  return <DynamicForm config={formConfig} />;
};

export default AddHomeoPatient;
