"use client";

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
import { RequiredLabel } from "@/components/RequiredLabel";
import PhoneNumber from "@/components/PhoneNumber";
import { useLoginForm } from "../_hooks/useLoginForm";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { LoginBanner } from "./LoginBanner";

const COUNTRY_CODE = "+88";

export default function LoginForm() {
  const {
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
  } = useLoginForm();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="p-6 md:p-8"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold text-navy">
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
                            <RequiredLabel
                              htmlFor="phone"
                              required
                              className="text-navy"
                            >
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

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel
                              htmlFor="password"
                              required
                              className="text-navy"
                            >
                              Password
                            </RequiredLabel>
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
                                aria-label={
                                  showPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                              >
                                {showPassword ? (
                                  <EyeOff
                                    className="h-4 w-4 text-muted-foreground"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <Eye
                                    className="h-4 w-4 text-muted-foreground"
                                    aria-hidden="true"
                                  />
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
                          onCheckedChange={(checked) =>
                            setRemember(checked === true)
                          }
                          disabled={isLoading}
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm text-slate-700 dark:text-slate-300 font-normal cursor-pointer"
                        >
                          Remember me
                        </Label>
                      </div>
                      <Button
                        variant="link"
                        size="sm"
                        className="px-0 text-sm text-navy hover:underline"
                        type="button"
                        onClick={handleForgotPassword}
                      >
                        Forgot password?
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className="bg-navy hover:bg-navy-dark text-white font-medium"
                      disabled={isLoading}
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

                    <SocialLoginButtons
                      onSocialLogin={handleSocialLogin}
                      disabled={isLoading}
                    />
                  </div>
                </form>
              </Form>

              <LoginBanner />
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
      </div>
    </div>
  );
}
