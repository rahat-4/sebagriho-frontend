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

import { loginSchema } from "@/schemas/LoginSchema";
import { RequiredLabel } from "@/components/RequiredLabel";

import PhoneNumber from "./PhoneNumber";

type LoginFormData = z.infer<typeof loginSchema>;

// Social login buttons data
const socialLogins = [
  {
    name: "Apple",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-4 h-4"
      >
        <path
          d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Google",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-4 h-4"
      >
        <path
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Meta",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-4 h-4"
      >
        <path
          d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

const LoginForm = () => {
  const { login, user } = useAuth();
  const router = useRouter();

  // State management for form fields and UI states
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const countryCode = "+88";

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      setIsLoading(true);
      setMessage(null);

      try {
        const result = await login({
          phone: data.phone,
          password: data.password,
          rememberMe: remember,
        });

        if (!result.success) {
          // Handle validation errors
          if (result.errors) {
            Object.entries(result.errors).forEach(
              ([field, errorMessage]: any) => {
                form.setError(field as keyof LoginFormData, {
                  type: "manual",
                  message: errorMessage,
                });
              }
            );
          }

          // Handle general error message
          if (result.message) {
            setMessage({
              type: "error",
              text: result.message,
            });
          }
          return;
        }

        // Success
        setMessage({
          type: "success",
          text: result.message || "Login successful!",
        });

        setTimeout(() => {
          router.push(`/admin`);
        }, 2000);
      } catch (error) {
        setMessage({
          type: "error",
          text: "An unexpected error occurred. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [login, remember, form, router]
  );

  const handleForgetPassword = () => {
    router.push("/forgot-password");
  };

  const handleSocialLogin = useCallback((provider: string) => {
    console.log(`Login with ${provider} - Feature coming soon!`);
    setMessage({
      type: "success",
      text: `${provider} login will be available soon.`,
    });
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-foreground">
                    Welcome back
                  </h1>
                  <p className="text-balance text-muted-foreground mt-1">
                    Login to your Sebagriho account
                  </p>
                </div>
                {message && (
                  <Alert
                    className={
                      message.type === "success"
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : ""
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

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
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
                          countryCode={countryCode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={remember}
                      onCheckedChange={setRemember}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="px-0 text-sm text-primary hover:underline"
                    type="button"
                    onClick={handleForgetPassword}
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {socialLogins.map((social) => (
                    <Button
                      key={social.name}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleSocialLogin(social.name)}
                      disabled={isLoading}
                      type="button"
                    >
                      {social.icon}
                      <span className="sr-only">Login with {social.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Form>

          <div className="relative hidden bg-muted md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-primary">
                  Join Sebagriho Today
                </h2>
                <p className="text-muted-foreground">
                  Experience seamless access to your favorite services
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Button variant="link" size="sm" className="px-0 text-xs h-auto">
          Terms of Service
        </Button>{" "}
        and{" "}
        <Button variant="link" size="sm" className="px-0 text-xs h-auto">
          Privacy Policy
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
