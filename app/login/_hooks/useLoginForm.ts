import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { loginSchema } from "@/schemas/LoginSchema";

type LoginFormData = z.infer<typeof loginSchema>;

interface MessageState {
  type: "success" | "error";
  text: string;
}

export function useLoginForm() {
  const { login, user, organization } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "", password: "" },
    mode: "onBlur",
  });

  useEffect(() => {
    if (loginSuccess && user) {
      const timer = setTimeout(() => {
        const destination = user.is_admin
          ? "/admin"
          : `/${organization?.uid ?? ""}`;
        router.replace(destination);
        setLoginSuccess(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [loginSuccess, user, organization, router]);

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    setMessage(null);
    setLoginSuccess(false);

    try {
      const result = await login({
        phone: data.phone,
        password: data.password,
        rememberMe: remember,
      });

      if (!result.success) {
        if (result.errors) {
          Object.entries(result.errors).forEach(
            ([field, err]: [string, unknown]) => {
              let messageText: string;
              if (Array.isArray(err)) {
                const first = err[0];
                messageText = typeof first === "string" ? first : String(first);
              } else if (typeof err === "string") {
                messageText = err;
              } else {
                messageText = String(err ?? "");
              }
              form.setError(field as keyof LoginFormData, {
                type: "manual",
                message: messageText,
              });
            }
          );
        }
        if (result.message) {
          setMessage({ type: "error", text: result.message });
        }
        return;
      }

      setMessage({
        type: "success",
        text: result.message || "Login successful!",
      });
      setLoginSuccess(true);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred.",
      });
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
