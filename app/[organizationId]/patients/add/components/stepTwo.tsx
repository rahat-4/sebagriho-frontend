import { patchData } from "@/services/api";
import { camelToSnake } from "@/services/caseConverters";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { RequiredLabel } from "@/components/RequiredLabel";

import { homeoPatientSchemaStepTwo } from "@/schemas/AddHomeoPatient";

interface FieldProps {
  label: string;
  name: string;
  type: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface StepProps {
  organizationId?: string;
  patientUid: string;
  onComplete: () => void;
}

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

type HomeoPatientFormData = z.infer<typeof homeoPatientSchemaStepTwo>;

const StepTwo: React.FC<StepProps> = ({
  organizationId,
  patientUid,
  onComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const countryCode = "+88";

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

  const onSubmit = useCallback(
    async (data: HomeoPatientFormData) => {
      setIsLoading(true);
      setMessage(null);
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
        const [status, response] = await patchData(
          `/organization/homeopathy/${organizationId}/patients/${patientUid}`,
          formData
        );

        if (status !== 200) {
          // Handle validation errors
          Object.entries(response).map(([field, errorMessage]: any) => {
            form.setError(field as keyof HomeoPatientFormData, {
              type: "manual",
              message: errorMessage,
            });
          });
          return;
        }

        onComplete();
        setMessage({
          type: "success",
          text: "Clinical information added successfully.",
        });

        setTimeout(() => {
          setMessage(null);
        }, 2000);
      } catch (error) {
        console.error("Registration error:", error);
        setMessage({
          type: "error",
          text: "Something went wrong. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },

    []
  );
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
        {fields.map(
          ({ label, name, type, options, placeholder }: FieldProps) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof HomeoPatientFormData}
              render={({ field }) => (
                <FormItem className="gap-1">
                  <RequiredLabel htmlFor={name}>{label}</RequiredLabel>

                  <FormControl>
                    {type === "file" ? (
                      <Input
                        placeholder={placeholder}
                        id={name}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const files = e.target.files;
                          field.onChange(files);
                        }}
                        className="text-sm"
                      />
                    ) : type === "select" ? (
                      <select
                        id={name}
                        {...field}
                        value={field.value || ""}
                        className="flex h-9 w-full rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                    ) : (
                      <Input
                        placeholder={placeholder}
                        id={name}
                        type={type}
                        {...field}
                        value={field.value || ""}
                        className="text-sm"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default StepTwo;
