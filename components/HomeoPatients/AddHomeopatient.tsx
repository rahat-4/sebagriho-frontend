"use client";

import {
  homeoPatientSchema,
  homeoPatientAdditionalInformationSchema,
} from "@/schemas/AddHomeoPatient";
import { z } from "zod";

import { useState, useCallback } from "react";

import { Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { postData } from "@/services/api";
import { userSchema } from "@/schemas/OrganizationOnboard";

import { RequiredLabel } from "@/components/RequiredLabel";

import PhoneNumber from "@/components/PhoneNumber";
import { splitFullNameToParts } from "@/services/nameConverter";

import { patchData } from "@/services/api";
import { camelToSnake } from "@/services/caseConverters";

interface FieldProps {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

const fields: FieldProps[] = [
  {
    label: "Avatar",
    name: "avatar",
    type: "file",
    placeholder: "Upload your image",
  },
  {
    label: "Old serial number",
    name: "oldSerialNumber",
    type: "text",
    placeholder: "Ex: 12345",
  },
  {
    label: "Patient name",
    name: "name",
    type: "tel",
    placeholder: "Ex: John Doe",
    required: true,
  },
  {
    label: "Phone Number",
    name: "phone",
    type: "tel",
    placeholder: "Ex: 1234 567 8901",
    required: true,
  },
  {
    label: "Relative's phone number",
    name: "relativePhone",
    type: "text",
    placeholder: "Ex: 1234 567 8901",
  },
  {
    label: "Address",
    name: "address",
    type: "textarea",
    placeholder: "Ex: 123 Main St, City, Country",
  },
];

const additionalFields: FieldProps[] = [
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

type HomeoPatientFormData = z.infer<typeof homeoPatientSchema>;
type HomeoPatientAdditionalInformationFormData = z.infer<
  typeof homeoPatientAdditionalInformationSchema
>;

interface HomeoPatientProps {
  onNext: () => void;
  organizationId?: string;
  setPatientUid: (patientUid: any) => void;
}

export const AddHomeoPatient: React.FC<HomeoPatientProps> = ({
  onNext,
  organizationId,
  setPatientUid,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const countryCode = "+88";

  const form = useForm<HomeoPatientFormData>({
    resolver: zodResolver(homeoPatientSchema),
    defaultValues: {
      oldSerialNumber: "",
      name: "",
      phone: "",
      relativePhone: "",
      address: "",
      avatar: undefined,
    },
  });
  const onSubmit = useCallback(async (data: HomeoPatientFormData) => {
    setIsLoading(true);
    setMessage(null);
    const formData = new FormData();

    const fullPhoneNumber = `${countryCode}${data.phone.replace(/\D/g, "")}`;
    formData.append("phone", fullPhoneNumber);

    const { firstName, lastName } = splitFullNameToParts(data.name);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);

    // Handle file inputs
    if (data.avatar?.[0]) formData.append("avatar", data.avatar[0]);

    // Handle text inputs
    Object.keys(data).forEach((key) => {
      if (key !== "avatar" && key !== "phone" && key !== "name") {
        formData.append(key, data[key as keyof HomeoPatientFormData] as string);
      }
    });

    try {
      const [status, response] = await postData(
        `/organization/homeopathy/${organizationId}/patients`,
        formData
      );

      if (status !== 201) {
        // Handle validation errors
        Object.entries(response).map(([field, errorMessage]: any) => {
          form.setError(field as keyof HomeoPatientFormData, {
            type: "manual",
            message: errorMessage,
          });
        });
        return;
      }

      setMessage({
        type: "success",
        text: "Patient added successfully.",
      });

      setTimeout(() => {
        onNext();
        // Set serial number
        setPatientUid(response.uid);
        setMessage(null);
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

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
          ({ label, name, type, placeholder, required }: FieldProps) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof HomeoPatientFormData}
              render={({ field }) => (
                <FormItem className="gap-1">
                  <RequiredLabel htmlFor={name} required={required}>
                    {label}
                  </RequiredLabel>

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
                    ) : name === "phone" ? (
                      <PhoneNumber
                        value={field.value}
                        onChange={field.onChange}
                        isLoading={isLoading}
                        countryCode={countryCode}
                      />
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
              Adding patient ...
            </>
          ) : (
            "Add patient"
          )}
        </Button>
      </form>
    </Form>
  );
};

interface AdditionalInformationProps {
  organizationId?: string;
  patientUid: string;
  onComplete: () => void;
}

export const HomeoPatientAdditonalInformations: React.FC<
  AdditionalInformationProps
> = ({ organizationId, patientUid, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const countryCode = "+88";

  const form = useForm<HomeoPatientAdditionalInformationFormData>({
    resolver: zodResolver(homeoPatientAdditionalInformationSchema),
    defaultValues: {
      age: "",
      gender: undefined,
      miasmType: undefined,
      caseHistory: "",
      habits: "",
    },
  });

  const onSubmit = useCallback(
    async (data: HomeoPatientAdditionalInformationFormData) => {
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
            form.setError(
              field as keyof HomeoPatientAdditionalInformationFormData,
              {
                type: "manual",
                message: errorMessage,
              }
            );
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
        {additionalFields.map(
          ({ label, name, type, options, placeholder }: FieldProps) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof HomeoPatientAdditionalInformationFormData}
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
