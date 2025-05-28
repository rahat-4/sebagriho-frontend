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

import { forgotPasswordSchema } from "@/schemas/LoginSchema";
import { RequiredLabel } from "@/components/RequiredLabel";
import PhoneNumber from "@/components/PhoneNumber";
import { Card } from "@/components/ui/card";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type MessageType = { type: "success" | "error"; text: string };

const COUNTRY_CODE = "+88";

const ForgotPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageType | null>(null);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { phone: "" },
    mode: "onBlur",
  });

  const navigateToResetPassword = () => router.push("/reset-password");

  const navigateToLogin = () => router.push("/login");

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      const fullPhoneNumber = `${COUNTRY_CODE}${data.phone.replace(/\D/g, "")}`;
      formData.append("phone", fullPhoneNumber);

      const [status, response] = await postData(
        "/public/auth/forgot-password",
        formData
      );

      if (status !== 200) {
        // Handle field-specific validation errors
        if (response.errors) {
          Object.entries(response.errors).forEach(([field, errorMessage]) => {
            form.setError(field as keyof ForgotPasswordFormData, {
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

      // Success - show message and redirect
      setMessage({
        type: "success",
        text: response.message || "OTP sent successfully!",
      });

      setTimeout(navigateToResetPassword, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <Card className="overflow-hidden shadow-lg rounded">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col">
                {/* Header */}
                <div className="flex flex-col items-center text-center pb-6">
                  <h1 className="text-xl font-bold text-foreground">
                    Forgot your password?
                  </h1>
                  <p className="text-balance text-sm text-muted-foreground mt-1">
                    OTP will be sent to your phone number
                  </p>
                </div>

                {/* Alert Message */}
                {message && (
                  <Alert
                    className={
                      message.type === "success"
                        ? "border-green-500 bg-green-50 dark:bg-green-950 mb-4"
                        : "mb-4"
                    }
                    variant={
                      message.type === "error" ? "destructive" : "default"
                    }
                  >
                    <AlertDescription
                      className={
                        message.type === "success"
                          ? "text-green-800 dark:text-green-200"
                          : ""
                      }
                    >
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
                <Button
                  type="submit"
                  className="w-full mb-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Reset Password"
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
        </Card>
        {/* Footer text */}
        <p className="text-center text-gray-500 dark:text-gray-400 text-xs mt-6">
          Secure password reset powered by OTP verification
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
