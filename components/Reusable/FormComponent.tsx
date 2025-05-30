"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { postData, putData } from "@/services/api";

// Convert single camelCase string to snake_case
const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

// Convert object keys from camelCase to snake_case
const convertKeysToSnakeCase = (
  obj: Record<string, any>
): Record<string, any> => {
  const converted: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = camelToSnake(key);
    converted[snakeKey] = value;
  }

  return converted;
};

export interface FieldConfig {
  label: string;
  name: string;
  type:
    | "text"
    | "email"
    | "number"
    | "tel"
    | "password"
    | "file"
    | "textarea"
    | "select"
    | "date";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select fields
  accept?: string; // For file inputs
  validation?: z.ZodTypeAny;
  rows?: number; // For textarea
}

export interface FormConfig {
  fields: FieldConfig[];
  schema: z.ZodSchema<any>;
  apiEndpoint: string;
  method?: "POST" | "PUT";
  redirectPath?: string;
  successMessage?: string;
  submitButtonText?: string;
  title?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  transformData?: (data: any) => any;
  setStep?: () => void;
  responseData?: string;
  setResponseData?: (data: any) => void;
  className?: string;
}

interface DynamicFormProps {
  config: FormConfig;
  initialData?: Record<string, any>;
  isEdit?: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  config,
  initialData = {},
  isEdit = false,
}) => {
  const router = useRouter();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formKey, setFormKey] = useState(0);

  // Create default values from field configuration
  const getDefaultValues = () => {
    const defaults: Record<string, any> = {};
    config.fields.forEach((field) => {
      if (field.type === "file") {
        defaults[field.name] = undefined;
      } else if (field.type === "number") {
        defaults[field.name] = initialData[field.name] || 0;
      } else if (field.type === "date") {
        defaults[field.name] = initialData[field.name]
          ? new Date(initialData[field.name])
          : undefined;
      } else {
        defaults[field.name] = initialData[field.name] || "";
      }
    });
    return defaults;
  };

  const form = useForm({
    resolver: zodResolver(config.schema),
    defaultValues: getDefaultValues(),
  });

  const handleRedirect = () => {
    if (config.redirectPath) {
      router.push(config.redirectPath);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      let processedData = { ...data };

      // Convert dates to ISO strings for API
      config.fields.forEach((field) => {
        if (
          field.type === "date" &&
          processedData[field.name] instanceof Date
        ) {
          processedData[field.name] = processedData[field.name].toISOString();
        }
      });

      // Apply custom data transformation if provided
      if (config.transformData) {
        processedData = config.transformData(processedData);
      } else {
        // Default: Convert camelCase keys to snake_case for backend
        processedData = convertKeysToSnakeCase(processedData);
      }

      // Check if we need to use FormData (for file uploads)
      const hasFileField = config.fields.some((field) => field.type === "file");
      let requestData: FormData | Record<string, any>;

      if (hasFileField) {
        const formData = new FormData();

        Object.entries(processedData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (typeof value === "object" && value[0] instanceof File) {
              // Handle file upload
              formData.append(key, value[0]);
            } else if (typeof value !== "object") {
              formData.append(key, String(value));
            }
          }
        });

        requestData = formData;
      } else {
        requestData = processedData;
      }

      // Choose API method
      const apiMethod = config.method === "PUT" ? putData : postData;
      const [status, response] = await apiMethod(
        config.apiEndpoint,
        requestData
      );

      const expectedStatus = config.method === "PUT" ? 200 : 201;

      if (status !== expectedStatus) {
        console.error("API Error:", response);

        // Handle validation errors from API
        if (typeof response === "object" && response !== null) {
          Object.entries(response).forEach(([field, errorMessage]: any) => {
            if (config.fields.some((f) => f.name === field)) {
              form.setError(field, {
                type: "manual",
                message: Array.isArray(errorMessage)
                  ? errorMessage[0]
                  : errorMessage,
              });
            }
          });
        }

        if (config.onError) {
          config.onError(response);
        }
        return;
      }

      // Reset form on success (only for create, not edit)
      if (!isEdit) {
        form.reset(getDefaultValues());

        // Clear file inputs manually
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input: any) => {
          input.value = "";
        });

        // Force form re-render
        setFormKey((prev) => prev + 1);
      }

      // Show success message
      setMessage({
        type: "success",
        text:
          config.successMessage ||
          `${isEdit ? "Updated" : "Created"} successfully.`,
      });

      // Handle success callback
      if (config.onSuccess) {
        config.onSuccess(response);
      }

      // Redirect after delay
      if (config.redirectPath) {
        setTimeout(() => {
          handleRedirect();
        }, 2000);
      }

      if (config.setResponseData) {
        config.setResponseData(response.serial_number.toString());
      }

      // Go to next step if provided
      if (config.setStep) {
        config.setStep();
      }

      if (config.responseData && config.setResponseData) {
        config.setResponseData(null);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setMessage({
        type: "error",
        text: `Failed to ${isEdit ? "update" : "create"}. Please try again.`,
      });

      if (config.onError) {
        config.onError(error);
      }
    }
  };

  const renderField = (fieldConfig: FieldConfig, field: any) => {
    const { type, options, accept, placeholder, rows = 3 } = fieldConfig;

    switch (type) {
      case "textarea":
        return (
          <Textarea
            placeholder={placeholder}
            {...field}
            rows={rows}
            className="text-sm resize-none"
            // Ensure the value is always a string and handle undefined/null
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
          />
        );

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal text-sm",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>{placeholder || "Pick a date"}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case "select":
        return (
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <SelectTrigger className="text-sm w-full">
              <SelectValue placeholder={placeholder || "Select an option..."} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "file":
        return (
          <Input
            type="file"
            accept={accept}
            onChange={(e) => {
              const files = e.target.files;
              field.onChange(files);
            }}
            className="text-sm"
          />
        );

      default:
        return (
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            className="text-sm"
            // Ensure proper value handling for text inputs
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className={config.className}>
      {config.title && (
        <h2 className="text-lg font-semibold mb-4">{config.title}</h2>
      )}

      <Form {...form} key={formKey}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-md"
        >
          {/* Display message */}
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

          {/* Render fields dynamically */}
          {config.fields.map((fieldConfig) => (
            <FormField
              key={fieldConfig.name}
              control={form.control}
              name={fieldConfig.name}
              render={({ field }) => (
                <FormItem className="gap-1">
                  <FormLabel className="text-sm">
                    {fieldConfig.label}
                    {fieldConfig.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </FormLabel>
                  <FormControl>{renderField(fieldConfig, field)}</FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="cursor-pointer text-sm"
              size="sm"
            >
              {form.formState.isSubmitting
                ? `${isEdit ? "Updating" : "Submitting"}...`
                : config.submitButtonText || (isEdit ? "Update" : "Submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DynamicForm;
