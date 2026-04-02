"use client";

import { postData } from "@/services/api";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { ArrowLeft, Loader2 } from "lucide-react";

import { phoneVerificationSchema } from "@/schemas/LoginSchema";
import { RequiredLabel } from "@/components/RequiredLabel";
import PhoneNumber from "@/components/PhoneNumber";

type PhoneVerificationFormData = z.infer<typeof phoneVerificationSchema>;
type MessageType = { type: "success" | "error"; text: string };

const COUNTRY_CODE = "+88";

interface StepProps {
  onNext: () => void;
}

const PhoneVerification = ({ onNext }: StepProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageType | null>(null);

  const form = useForm<PhoneVerificationFormData>({
    resolver: zodResolver(phoneVerificationSchema),
    defaultValues: { phone: "" },
    mode: "onBlur",
  });

  const navigateToLogin = () => router.push("/login");

  const onSubmit = async (data: PhoneVerificationFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      const fullPhoneNumber = `${COUNTRY_CODE}${data.phone.replace(/\D/g, "")}`;
      formData.append("phone", fullPhoneNumber);

      const [status, response] = await postData(
        "/public/auth/phone-verification",
        formData
      );

      if (status !== 200) {
        // Handle field-specific validation errors
        if (response.errors) {
          Object.entries(response.errors).forEach(([field, errorMessage]) => {
            form.setError(field as keyof PhoneVerificationFormData, {
              type: "manual",
              message: errorMessage as string,
            });
          });
        }

        // Handle general error message
        if (response.message) {
          setMessage({ type: "error", text: response.message });
        }
        return;
      }

      if (!response.session_id) {
        setMessage({
          type: "error",
          text: "Session expired. Please try again.",
        });
        return;
      }
      localStorage.setItem("session_id", response.session_id);
      // Success - show message and redirect
      setMessage({
        type: "success",
        text: response.message || "OTP sent successfully!",
      });

      setTimeout(() => onNext(), 2000);
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6 md:p-8">
        <div className="flex flex-col gap-4">
          {/* Alert Message */}
          {message && (
            <Alert
              className={message.type === "success" ? "mb-4 border-emerald-500 bg-emerald-50" : "mb-4"}
              variant={message.type === "error" ? "destructive" : "default"}
            >
              <AlertDescription className={message.type === "success" ? "text-emerald-800" : ""}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Phone Number Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>
                  <RequiredLabel htmlFor="phone" required>
                    Phone number
                  </RequiredLabel>
                </FormLabel>
                <FormControl>
                  <PhoneNumber
                    value={field.value}
                    onChange={field.onChange}
                    isLoading={isLoading}
                    countryCode={COUNTRY_CODE}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="mb-4 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Verify Phone Number"
            )}
          </Button>

          {/* Back to Login Link */}
          <div className="flex items-center justify-center">
            <Button
              variant="link"
              size="sm"
              className="px-0 text-sm text-primary hover:underline"
              type="button"
              onClick={navigateToLogin}
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to login
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PhoneVerification;
