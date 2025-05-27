"use client";

import { useState } from "react";

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

import { postData } from "@/services/api";
import { camelToSnake } from "@/services/caseConverters";

import { homeoPatientSchemaStepOne } from "@/schemas/AddHomeoPatient";

type HomeoPatientFormData = z.infer<typeof homeoPatientSchemaStepOne>;

interface FieldProps {
  label: string;
  name: string;
  type: string;
}

interface StepProps {
  onNext: () => void;
  setSerialNumber: (data: any) => void;
}

const StepOne = ({ onNext, setSerialNumber }: StepProps) => {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<HomeoPatientFormData>({
    resolver: zodResolver(homeoPatientSchemaStepOne),
    defaultValues: {
      oldSerialNumber: "",
      name: "",
      phone: "",
      relativePhone: "",
      address: "",
      avatar: undefined,
    },
  });

  const onSubmit = async (data: HomeoPatientFormData) => {
    const formData = new FormData();

    // Handle file upload
    if (data.avatar?.[0]) formData.append("avatar", data.avatar[0]);

    const [first_name, ...rest] = data.name.trim().split(" ");
    const last_name = rest.join(" ");

    formData.append("first_name", first_name);
    formData.append("last_name", last_name);

    // Append other form data (excluding name and avatar as they're handled separately)
    Object.entries(data).forEach(([key, value]) => {
      if (value && key !== "name" && key !== "avatar") {
        // Convert keys to snake_case
        const snakecasekey = camelToSnake(key as string);
        // Ensure we're appending string values
        formData.append(snakecasekey, String(value));
      }
    });

    console.log("Form data before conversion:", Object.fromEntries(formData));

    try {
      const [status, response] = await postData(
        "/organization/homeopathy/patients",
        formData
      );

      if (status !== 201) {
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
        text: "Patient added successfully.",
      });

      setTimeout(() => {
        onNext();
        // Set serial number
        setSerialNumber(response.serial_number);
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
    { label: "Avatar", name: "avatar", type: "file" },
    { label: "Old serial number", name: "oldSerialNumber", type: "text" },
    { label: "Patient name", name: "name", type: "tel" },
    { label: "Phone Number", name: "phone", type: "tel" },
    { label: "Relative's phone number", name: "relativePhone", type: "text" },
    { label: "Address", name: "address", type: "textarea" },
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
        {fields.map(({ label, name, type }: FieldProps) => (
          <FormField
            key={name}
            control={form.control}
            name={name as keyof HomeoPatientFormData}
            render={({ field }) => (
              <FormItem className="gap-1">
                <FormLabel className="text-sm">{label}</FormLabel>
                <FormControl>
                  {type === "file" ? (
                    <Input
                      id={name}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files;
                        field.onChange(files);
                      }}
                      className="text-sm"
                    />
                  ) : type === "textarea" ? (
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="Enter address..."
                      rows={3}
                      className="text-sm resize-none"
                    />
                  ) : (
                    <Input
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
        ))}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="cursor-pointer text-sm"
            size="sm"
          >
            {form.formState.isSubmitting ? "Adding patient..." : "Add Patient"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StepOne;
