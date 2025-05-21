"use client";

import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { postData } from "@/services/api";

import { cn } from "@/lib/utils";
import { otpSchema } from "@/schemas/OrganizationOnboard";

interface StepProps {
  onNext: () => void;
}

type OtpFormData = z.infer<typeof otpSchema>;

const OneTimePassword: React.FC<StepProps> = ({ onNext }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OtpFormData) => {
    const sessionId = localStorage.getItem("session_id");
    if (!sessionId) return alert("Session expired. Please register again.");

    try {
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("otp", data.otp);

      await postData("/public/auth/otp-verification", formData);
      onNext();
    } catch (err) {
      console.error("OTP verification error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="otp">Enter OTP</Label>
        <Input
          id="otp"
          {...register("otp")}
          className={cn("w-full text-sm", errors.otp && "border-red-500")}
          placeholder="Enter OTP sent to your one"
        />
        {errors.otp && (
          <p className="text-xs text-red-500 mt-1">{errors.otp.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="text-sm cursor-pointer"
          size="sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify & Continue"}
        </Button>
      </div>
    </form>
  );
};

export default OneTimePassword;
