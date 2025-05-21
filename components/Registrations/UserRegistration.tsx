import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

import { postData } from "@/services/api";
import { userSchema } from "@/schemas/OrganizationOnboard";

interface StepProps {
  onNext: () => void;
}

interface FieldProps {
  label: string;
  name: string;
  type: string;
}

type UserFormData = z.infer<typeof userSchema>;

const UserRegistration: React.FC<StepProps> = ({ onNext }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const fields: FieldProps[] = [
    { label: "Avatar", name: "avatar", type: "file" },
    { label: "First Name", name: "firstName", type: "text" },
    { label: "Last Name", name: "lastName", type: "text" },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Gender", name: "gender", type: "text" },
    { label: "National ID", name: "nid", type: "text" },
    { label: "NID Front Image", name: "nidFrontImage", type: "file" },
    { label: "NID Back Image", name: "nidBackImage", type: "file" },
  ];

  const onSubmit = async (data: UserFormData) => {
    const formData = new FormData();

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
        key !== "nidBackImage"
      ) {
        formData.append(key, data[key as keyof UserFormData] as string);
      }
    });

    try {
      const response = await postData(
        "/public/auth/initial-registration",
        formData
      );

      if (response?.session_id) {
        localStorage.setItem("session_id", response.session_id);
        onNext();
      }
    } catch (err) {
      console.error("Registration error:", err);
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
            {...register(name as keyof UserFormData)}
            className={cn(
              "w-full text-sm",
              errors[name as keyof UserFormData] && "border-red-500"
            )}
          />
          {errors[name as keyof UserFormData] && (
            <p className="text-xs text-red-500 mt-1">
              {errors[name as keyof UserFormData]?.message}
            </p>
          )}
        </div>
      ))}

      <div className="flex justify-end">
        <Button type="submit" className="text-sm cursor-pointer" size="sm">
          Save & Continue
        </Button>
      </div>
    </form>
  );
};

export default UserRegistration;
