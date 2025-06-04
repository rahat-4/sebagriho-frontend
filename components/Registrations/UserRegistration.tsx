"use client";

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

interface StepProps {
  onNext: () => void;
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
    label: "Avatar",
    name: "avatar",
    type: "file",
    placeholder: "Upload your image",
  },
  {
    label: "Name",
    name: "name",
    type: "text",
    placeholder: "Mehedi Hasan",
    required: true,
  },
  {
    label: "Phone",
    name: "phone",
    type: "tel",
    placeholder: "1234 567 8901",
    required: true,
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "test@example.com",
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
    required: true,
  },
  {
    label: "National ID",
    name: "nid",
    type: "text",
    placeholder: "1234567890123",
    required: true,
  },
  {
    label: "NID Front Image",
    name: "nidFrontImage",
    type: "file",
    placeholder: "Upload NID front image",
  },
  {
    label: "NID Back Image",
    name: "nidBackImage",
    type: "file",
    placeholder: "Upload NID back image",
  },
];

type UserFormData = z.infer<typeof userSchema>;

const UserRegistration: React.FC<StepProps> = ({ onNext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const countryCode = "+88";

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      avatar: undefined,
      name: "",
      phone: "",
      email: "",
      gender: undefined,
      nid: "",
      nidFrontImage: undefined,
      nidBackImage: undefined,
    },
  });

  const onSubmit = useCallback(async (data: UserFormData) => {
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
    if (data.nidFrontImage?.[0])
      formData.append("nidFrontImage", data.nidFrontImage[0]);
    if (data.nidBackImage?.[0])
      formData.append("nidBackImage", data.nidBackImage[0]);

    // Handle text inputs
    Object.keys(data).forEach((key) => {
      if (
        key !== "avatar" &&
        key !== "nidFrontImage" &&
        key !== "nidBackImage" &&
        key !== "phone" &&
        key !== "name"
      ) {
        formData.append(key, data[key as keyof UserFormData] as string);
      }
    });

    try {
      const [status, response] = await postData(
        "/public/auth/initial-registration",
        formData
      );

      if (status !== 201) {
        // Handle validation errors
        Object.entries(response).map(([field, errorMessage]: any) => {
          form.setError(field as keyof UserFormData, {
            type: "manual",
            message: errorMessage,
          });
        });
        return;
      }

      if (!response.session_id) {
        setMessage({
          type: "error",
          text: "Session ID is missing in the response.",
        });
        return;
      }

      localStorage.setItem("session_id", response.session_id);
      onNext();
      setMessage({
        type: "success",
        text: "Successfully add organization user.",
      });

      setTimeout(() => {
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
              name={name as keyof UserFormData}
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
              Adding organization user...
            </>
          ) : (
            "Add organization user"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default UserRegistration;
