"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { RequiredLabel } from "@/components/RequiredLabel";
import PhoneNumber from "@/components/PhoneNumber";

import { postData } from "@/services/api";

import { cn } from "@/lib/utils";
import { organizationSchema } from "@/schemas/OrganizationOnboard";

interface OrganizationProps {
  onComplete: () => void;
}

interface FieldProps {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

const fields: FieldProps[] = [
  {
    label: "Organization Name",
    name: "name",
    type: "text",
    placeholder: "Enter organization name",
    required: true,
  },
  {
    label: "Organization Logo",
    name: "logo",
    type: "file",
    placeholder: "Upload organization logo",
  },
  {
    label: "Organization Type",
    name: "organizationType",
    type: "text",
    placeholder: "Enter organization type",
    required: true,
  },
  {
    label: "Description",
    name: "description",
    type: "text",
    placeholder: "Enter organization description",
  },
  {
    label: "Phone",
    name: "phone",
    type: "tel",
    placeholder: "1234 567 8901",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "test@example.com",
  },
  {
    label: "Website",
    name: "website",
    type: "text",
    placeholder: "https://example.com",
  },
  {
    label: "Address",
    name: "address",
    type: "text",
    placeholder: "123 Main St, City, Country",
    required: true,
  },
  {
    label: "Facebook",
    name: "facebook",
    type: "text",
    placeholder: "https://facebook.com/example",
  },
  {
    label: "Twitter",
    name: "twitter",
    type: "text",
    placeholder: "https://twitter.com/example",
  },
  {
    label: "LinkedIn",
    name: "linkedin",
    type: "text",
    placeholder: "https://linkedin.com/company/example",
  },
  {
    label: "Instagram",
    name: "instagram",
    type: "text",
    placeholder: "https://instagram.com/example",
  },
  {
    label: "YouTube",
    name: "youtube",
    type: "text",
    placeholder: "https://youtube.com/example",
  },
];

type OrganizationFormData = z.infer<typeof organizationSchema>;

const AddOrganization: React.FC<OrganizationProps> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const countryCode = "+88";

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      logo: undefined,
      organizationType: "",
      description: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
      youtube: "",
    },
  });

  const onSubmit = useCallback(
    async (data: OrganizationFormData) => {
      setIsLoading(true);
      setMessage(null);
      const formData = new FormData();
      const sessionId = localStorage.getItem("session_id");
      if (!sessionId) {
        console.error("Session ID not found in localStorage");
        setMessage({
          type: "error",
          text: "Session expired. Please try again.",
        });
        return;
      }

      const fullPhoneNumber = `${countryCode}${data.phone?.replace(/\D/g, "")}`;
      formData.append("phone", fullPhoneNumber);

      formData.append("session_id", sessionId);

      // Handle file input
      if (data.logo?.[0]) formData.append("organization.logo", data.logo[0]);

      // Handle other fields
      Object.entries(data).forEach(([key, value]) => {
        if (value && key !== "logo" && key !== "phone") {
          formData.append(`organization.${key}`, value as string);
        }
      });

      try {
        const [status, response] = await postData(
          "/admin/organizations/members",
          formData
        );

        if (status !== 201) {
          // Handle validation errors
          Object.entries(response).map(([field, errorMessage]: any) => {
            form.setError(field as keyof OrganizationFormData, {
              type: "manual",
              message: errorMessage,
            });
          });
          return;
        }
        localStorage.removeItem("session_id");

        onComplete();
        setMessage({
          type: "success",
          text: "Successfully add organization user.",
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
          ({
            label,
            name,
            type,
            options,
            placeholder,
            required,
          }: FieldProps) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof OrganizationFormData}
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
              Adding organization...
            </>
          ) : (
            "Add organization"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddOrganization;
