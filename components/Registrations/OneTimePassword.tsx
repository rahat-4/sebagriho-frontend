"use client";

import { z } from "zod";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { postData } from "@/services/api";
import { otpSchema } from "@/schemas/OrganizationOnboard";

interface StepProps {
  onNext: () => void;
}

type OtpFormData = z.infer<typeof otpSchema>;

const OneTimePassword: React.FC<StepProps> = ({ onNext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = useCallback(async (data: OtpFormData) => {
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    const sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      setMessage({
        type: "error",
        text: "Session expired. Please try again.",
      });
      setIsLoading(false);
      return;
    }

    try {
      formData.append("session_id", sessionId);
      formData.append("otp", data.otp);

      const [status, response] = await postData(
        "/public/auth/otp-verification",
        formData
      );

      if (status !== 200) {
        Object.entries(response).forEach(([field, errorMessage]: any) => {
          form.setError(field as keyof OtpFormData, {
            type: "manual",
            message: errorMessage,
          });
        });
        setIsLoading(false);
        return;
      }
      onNext();
      setMessage({
        type: "success",
        text: "OTP verified successfully.",
      });

      setTimeout(() => setMessage(null), 2000);
    } catch {
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
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="gap-1">
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default OneTimePassword;
