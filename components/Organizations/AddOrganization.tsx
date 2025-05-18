"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { postData } from "@/services/api";

import { cn } from "@/lib/utils";
import { organizationSchema } from "@/services/schemas";

interface OrganizationProps {
  onComplete?: () => void;
}

interface FieldProps {
  label: string;
  name: string;
  type: string;
}

type OrganizationFormData = z.infer<typeof organizationSchema>;

const AddOrganization: React.FC<OrganizationProps> = ({ onComplete }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
  });

  const fields: FieldProps[] = [
    { label: "Organization Name", name: "name", type: "text" },
    { label: "Organization Logo", name: "logo", type: "file" },
    { label: "Organization Type", name: "organization_type", type: "text" },
    { label: "Description", name: "description", type: "text" },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Website", name: "website", type: "text" },
    { label: "Address", name: "address", type: "text" },
    { label: "Facebook", name: "facebook", type: "text" },
    { label: "Twitter", name: "twitter", type: "text" },
    { label: "LinkedIn", name: "linkedin", type: "text" },
    { label: "Instagram", name: "instagram", type: "text" },
    { label: "YouTube", name: "youtube", type: "text" },
  ];

  const onSubmit = async (data: OrganizationFormData) => {
    const sessionId = localStorage.getItem("session_id");
    if (!sessionId) return alert("Session expired. Please register again.");

    const formData = new FormData();
    formData.append("session_id", sessionId);

    // Handle file input
    if (data.logo?.[0]) formData.append("organization.logo", data.logo[0]);

    // Handle other fields
    Object.entries(data).forEach(([key, value]) => {
      if (value && key !== "logo") {
        formData.append(`organization.${key}`, value as string);
      }
    });

    try {
      await postData("/admin/organizations/members", formData);
      localStorage.removeItem("session_id");

      if (onComplete) {
        onComplete();
      } else {
        router.push("/admin/organizations");
      }
    } catch (error) {
      console.error("Organization submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map(({ label, name, type }) => (
        <div key={name}>
          <Label htmlFor={name}>{label}</Label>
          <Input
            id={name}
            type={type}
            {...register(name as keyof OrganizationFormData)}
            className={cn(
              "w-full text-sm",
              errors[name as keyof OrganizationFormData] && "border-red-500"
            )}
          />
          {errors[name as keyof OrganizationFormData] && (
            <p className="text-xs text-red-500 mt-1">
              {errors[name as keyof OrganizationFormData]?.message}
            </p>
          )}
        </div>
      ))}

      <div className="flex justify-end">
        <Button
          type="submit"
          className="text-sm cursor-pointer"
          size="sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default AddOrganization;
