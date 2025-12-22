import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { loginSchema } from "@/schemas/LoginSchema";
import { login } from "@/services/auth";

type LoginFormData = z.infer<typeof loginSchema>;

interface MessageState {
  type: "success" | "error";
  text: string;
}

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "", password: "" },
    mode: "onBlur",
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await login({
        phone: data.phone,
        password: data.password,
        rememberMe: remember,
      });

      let url = "/dashboard";

      console.log("Login successful:", searchParams.toString());

      setMessage({
        type: "success",
        text: `Welcome back, ${response.user_name}`,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (response.admin === true) {
        url = "/admin";
      }

      router.push(url);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message) as Record<
            string,
            string | string[]
          >;

          Object.entries(errorData).forEach(([field, messages]) => {
            // Handle non-field errors explicitly
            if (field === "non_field_errors" || field === "detail") {
              form.setError("root", {
                type: "manual",
                message: Array.isArray(messages) ? messages[0] : messages,
              });
              return;
            }

            form.setError(field as keyof LoginFormData, {
              type: "manual",
              message: Array.isArray(messages) ? messages[0] : messages,
            });
          });
        } catch {
          form.setError("root", {
            type: "manual",
            message: error.message || "Something went wrong",
          });
        }
      } else {
        setMessage({
          type: "error",
          text: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  function handleForgotPassword() {
    router.push("/forgot-password");
  }

  function handleSocialLogin(provider: string) {
    setMessage({
      type: "success",
      text: `${provider} login will be available soon.`,
    });
  }

  return {
    form,
    showPassword,
    remember,
    isLoading,
    message,
    onSubmit,
    setRemember,
    togglePasswordVisibility,
    handleForgotPassword,
    handleSocialLogin,
  };
}
