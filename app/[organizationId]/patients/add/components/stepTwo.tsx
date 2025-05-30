"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { putData } from "@/services/api";
import { camelToSnake } from "@/services/caseConverters";

import { homeoPatientSchemaStepTwo } from "@/schemas/AddHomeoPatient";

type HomeoPatientFormData = z.infer<typeof homeoPatientSchemaStepTwo>;

interface FieldProps {
  label: string;
  name: string;
  type: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface StepProps {
  serialNumber: any;
}

const StepTwo = ({ serialNumber }: StepProps) => {
  const router = useRouter();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<HomeoPatientFormData>({
    resolver: zodResolver(homeoPatientSchemaStepTwo),
    defaultValues: {
      age: "",
      gender: undefined,
      miasmType: undefined,
      caseHistory: "",
      habits: "",
    },
  });

  const onSubmit = async (data: HomeoPatientFormData) => {
    const formData = new FormData();

    // Append other form data (excluding name and avatar as they're handled separately)
    Object.entries(data).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        // Convert keys to snake_case
        const snakecasekey = camelToSnake(key as string);
        // Ensure we're appending string values
        formData.append(snakecasekey, String(value));
      }
    });

    try {
      const [status, response] = await putData(
        `/organization/homeopathy/patients/${serialNumber}`,
        formData
      );

      if (status !== 200) {
        Object.entries(response).map(([field, errorMessage]: any) => {
          form.setError(field as keyof HomeoPatientFormData, {
            type: "manual",
            message: errorMessage,
          });
        });
        return;
      }

      // Show success message
      setMessage({
        type: "success",
        text: "Clinical information added successfully.",
      });

      setTimeout(() => {
        if (serialNumber) {
          router.push(`/patients/${serialNumber}`);
        } else {
          console.error("serialNumber is undefined");
        }
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({
        type: "error",
        text: "Failed to add patient. Please try again.",
      });
    }
  };

  const fields: FieldProps[] = [
    {
      label: "Age",
      name: "age",
      type: "text",
      placeholder: "Enter a age",
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
      name: "miasmType",
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md"
      >
        {/* Display message */}
        {message && (
          <Alert
            className={`mb-4 ${
              message.type === "success" ? "border-green-500 bg-green-50" : ""
            }`}
            variant={message.type === "error" ? "destructive" : "default"}
          >
            <AlertDescription
              className={message.type === "success" ? "text-green-800" : ""}
            >
              {message.text}
            </AlertDescription>
          </Alert>
        )}
        {fields.map((fieldConfig) => {
          const { label, name, type, options, placeholder } = fieldConfig;
          return (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof HomeoPatientFormData}
              render={({ field }) => (
                <FormItem className="gap-1">
                  <FormLabel className="text-sm">{label}</FormLabel>
                  <FormControl>
                    {type === "select" ? (
                      <select
                        id={name}
                        {...field}
                        value={field.value || ""}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="" disabled>
                          {placeholder || `Select ${label}`}
                        </option>
                        {options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : type === "textarea" ? (
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        placeholder={placeholder}
                        rows={3}
                        className="text-sm resize-none"
                      />
                    ) : (
                      <Input
                        id={name}
                        type={type}
                        {...field}
                        value={field.value || ""}
                        placeholder={placeholder}
                        className="text-sm"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="cursor-pointer text-sm"
            size="sm"
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StepTwo;
