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

import { postData } from "@/services/api";

import { homeoPatientSchema } from "@/schemas/AddHomeoPatient";

type HomeoPatientFormData = z.infer<typeof homeoPatientSchema>;

interface FieldProps {
  label: string;
  name: string;
  type: string;
}

const AddHomeoPatient = () => {
  const router = useRouter();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const patientAdded = () => {
    router.push("/patients");
  };

  const form = useForm<HomeoPatientFormData>({
    resolver: zodResolver(homeoPatientSchema),
  });

  const onSubmit = async (data: HomeoPatientFormData) => {
    const formData = new FormData();

    // Handle file upload
    if (data.avatar?.[0]) formData.append("avatar", data.avatar[0]);

    const [first_name, ...rest] = data.name.trim().split(" ");
    const last_name = rest.join(" ");

    formData.append("first_name", first_name);
    formData.append("last_name", last_name);

    // Append other form data
    Object.entries(data).forEach(([key, value]) => {
      if (value && key !== "name" && key !== "avatar") {
        formData.append(key, value as string);
      }
    });

    try {
      const [status, response] = await postData(
        "/organization/homeopathy/patients",
        formData
      );

      if (status !== 201) {
        console.error("Error:", response);
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
        patientAdded();
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
    { label: "Patient name", name: "name", type: "text" },
    { label: "Phone Number", name: "phone", type: "text" },
    { label: "Relative's phone number", name: "relativePhone", type: "text" },
    { label: "Address", name: "address", type: "text" },
  ];

  return (
    // console.log("-----message", message),
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
            render={({ field }: any) => (
              <FormItem className="gap-1">
                <FormLabel className="text-sm">{label}</FormLabel>
                <FormControl>
                  {type === "file" ? (
                    <Input
                      id={name}
                      type="file"
                      // accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files;
                        field.onChange(files);
                      }}
                      className="text-sm"
                    />
                  ) : (
                    <Input
                      id={name}
                      type={type}
                      {...field}
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
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddHomeoPatient;
