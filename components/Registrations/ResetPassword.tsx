"use client";

import { useAuth } from "@/context/AuthContext";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { resetPasswordSchema } from "@/schemas/LoginSchema";
import { RequiredLabel } from "@/components/RequiredLabel";

import { postData } from "@/services/api";

import { camelToSnake, snakeToCamel } from "@/services/caseConverters";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const router = useRouter();

  // State management for form fields and UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      setIsLoading(true);
      setMessage(null);

      try {
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

        formData.append("session_id", sessionId);
        formData.append("password", data.password);
        formData.append("confirm_password", data.confirmPassword);

        const [status, response] = await postData(
          "/public/auth/forgot-password",
          formData
        );

        if (status !== 201) {
          // Handle validation errors
          Object.entries(response).forEach(([field, errorMessage]: any) => {
            field = snakeToCamel(field);
            form.setError(field as keyof ResetPasswordFormData, {
              type: "manual",
              message: errorMessage,
            });
          });
          return;
        }

        // Success
        setMessage({
          type: "success",
          text: response.message || "Login successful!",
        });

        localStorage.removeItem("session_id");

        setTimeout(() => {
          router.push(`/login`);
        }, 2000);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Something went wrong. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [form, router]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  return (
    <Form {...form}>
      <div className="p-6 md:p-8">
        <div className="flex flex-col gap-6">
          {message && (
            <Alert
              className={
                message.type === "success"
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : ""
              }
              variant={message.type === "error" ? "destructive" : "default"}
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredLabel
                    htmlFor="password"
                    children="Password"
                    required
                  />
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pr-10 text-sm"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredLabel
                    htmlFor="confirmPassword"
                    children="Confirm Password"
                    required
                  />
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      id="confirmPassword"
                      type={showPassword ? "text" : "confirmPassword"}
                      placeholder="Enter your password"
                      className="pr-10 text-sm"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={toggleConfirmPasswordVisibility}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Set Password"
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
};
export default ResetPassword;
