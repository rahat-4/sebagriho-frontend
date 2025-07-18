import { z } from "zod";

import { useParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Loader2,
  Plus,
  ImageIcon,
  Pill,
  Calendar,
  Building,
  Hash,
  DollarSign,
  Package,
  FileText,
} from "lucide-react";
import { useCallback, useState } from "react";
import { RequiredLabel } from "@/components/RequiredLabel";
import { camelToSnake } from "@/services/caseConverters";
import { postData } from "@/services/api";
import { cn } from "@/lib/utils";

import { homeopathicMedicineSchema } from "@/schemas/MedicineSchema";
import { ParamValue } from "next/dist/server/request/params";

type HomeopathicMedicineForm = z.infer<typeof homeopathicMedicineSchema>;

// Form field configuration
const FORM_FIELDS = [
  {
    name: "avatar" as const,
    label: "Medicine Image",
    icon: <ImageIcon className="w-4 h-4 text-orange-500" />,
    required: false,
    type: "file",
    accept: "image/*",
  },
  {
    name: "name" as const,
    label: "Medicine Name",
    icon: <Pill className="w-4 h-4 text-orange-500" />,
    required: true,
    type: "text",
    placeholder: "Enter medicine name",
  },
  {
    name: "power" as const,
    label: "Power",
    icon: <Pill className="w-4 h-4 text-blue-500" />,
    required: false,
    type: "text",
    placeholder: "Enter power (e.g., 30C, 200C)",
  },
  {
    name: "expiration_date" as const,
    label: "Expiration Date",
    icon: <Calendar className="w-4 h-4 text-red-500" />,
    required: true,
    type: "date",
    placeholder: "Enter expiration date",
  },
  {
    name: "manufacturer" as const,
    label: "Manufacturer",
    icon: <Building className="w-4 h-4 text-purple-500" />,
    required: false,
    type: "text",
    placeholder: "Enter manufacturer name",
  },
  {
    name: "unit_price" as const,
    label: "Unit Price",
    icon: <DollarSign className="w-4 h-4 text-green-600" />,
    required: false,
    type: "number",
    placeholder: "Enter unit price",
    step: "0.01",
  },
  {
    name: "total_quantity" as const,
    label: "Total Quantity",
    icon: <Package className="w-4 h-4 text-indigo-500" />,
    required: false,
    type: "number",
    placeholder: "Enter total quantity",
  },
  {
    name: "batch_number" as const,
    label: "Batch Number",
    icon: <Hash className="w-4 h-4 text-gray-500" />,
    required: false,
    type: "text",
    placeholder: "Enter batch number",
  },
  {
    name: "description" as const,
    label: "Description",
    icon: <FileText className="w-4 h-4 text-slate-500" />,
    required: false,
    type: "textarea",
    placeholder: "Describe the medicine in detail...",
    rows: 3,
  },
  {
    name: "is_available" as const,
    label: "Medicine is currently available",
    icon: <Package className="w-4 h-4 text-green-500" />,
    required: true,
    type: "checkbox",
    placeholder: "Is Available",
  },
] as const;

interface AddHomeopathicMedicineProps {
  onMedicineCreated?: () => void;
}

const AddHomeopathicMedicine = ({
  onMedicineCreated,
}: AddHomeopathicMedicineProps) => {
  const { organizationId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<HomeopathicMedicineForm>({
    resolver: zodResolver(homeopathicMedicineSchema),
    defaultValues: {
      avatar: null,
      name: "",
      power: "",
      expiration_date: "",
      is_available: false,
      manufacturer: "",
      unit_price: 0,
      total_quantity: 0,
      description: "",
      batch_number: "",
    },
  });

  // Reset form when dialog closes
  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
      setMessage(null);
    }
  };

  const onSubmit = useCallback(
    async (data: HomeopathicMedicineForm) => {
      setIsLoading(true);
      setMessage(null);

      const formData = new FormData();

      // Process form data
      Object.entries(data).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) return;

        const snakeCaseKey = camelToSnake(key);

        if (key === "avatar" && value instanceof FileList) {
          if (value.length > 0) {
            formData.append(snakeCaseKey, value[0]);
          }
        } else if (key === "unit_price" || key === "total_quantity") {
          // Only append if value is greater than 0
          if (Number(value) > 0) {
            formData.append(snakeCaseKey, String(value));
          }
        } else {
          formData.append(snakeCaseKey, String(value));
        }
      });

      try {
        const [status, response] = await postData(
          `/organization/homeopathy/${organizationId}/medicines`,
          formData
        );

        if (status === 200 || status === 201) {
          setMessage({
            type: "success",
            text: "Medicine added successfully!",
          });
          form.reset();

          setTimeout(() => {
            setIsOpen(false);
            onMedicineCreated?.();
            setMessage(null);
          }, 1500);
        } else {
          // Handle validation errors
          if (response && typeof response === "object") {
            Object.entries(response).forEach(([field, errorMessage]: any) => {
              form.setError(field as keyof HomeopathicMedicineForm, {
                type: "manual",
                message: Array.isArray(errorMessage)
                  ? errorMessage[0]
                  : errorMessage,
              });
            });
          }
          setMessage({
            type: "error",
            text: "Please fix the errors below and try again.",
          });
        }
      } catch (error) {
        console.error("Medicine creation error:", error);
        setMessage({
          type: "error",
          text: "Something went wrong. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [organizationId, form, onMedicineCreated]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Medicine
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] rounded-2xl border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50">
        <DialogHeader className="gap-0">
          <DialogTitle className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Add New Medicine
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-xs leading-relaxed">
            Add a new homeopathic medicine to your inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)] pr-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 pb-2"
            >
              {/* Message Alert */}
              {message && (
                <Alert
                  className={cn(
                    "border-l-4 rounded-lg",
                    message.type === "success"
                      ? "border-l-green-500 bg-green-50 border-green-200"
                      : "border-l-red-500 bg-red-50 border-red-200"
                  )}
                  variant={message.type === "error" ? "destructive" : "default"}
                >
                  <AlertDescription
                    className={cn(
                      "font-medium",
                      message.type === "success"
                        ? "text-green-800"
                        : "text-red-800"
                    )}
                  >
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              {/* Dynamic form fields */}
              {FORM_FIELDS.map((fieldConfig) => (
                <FormField
                  key={fieldConfig.name}
                  control={form.control}
                  name={fieldConfig.name}
                  render={({ field }) => (
                    <FormItem>
                      {fieldConfig.type !== "checkbox" &&
                        (fieldConfig.required ? (
                          <RequiredLabel
                            htmlFor={fieldConfig.name}
                            required={true}
                            icon={fieldConfig.icon}
                          >
                            {fieldConfig.label}
                          </RequiredLabel>
                        ) : (
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            {fieldConfig.icon}
                            {fieldConfig.label}
                          </FormLabel>
                        ))}
                      <FormControl>
                        {fieldConfig.type === "textarea" ? (
                          <Textarea
                            placeholder={fieldConfig.placeholder}
                            id={fieldConfig.name}
                            rows={fieldConfig.rows}
                            {...field}
                            value={field.value || ""}
                            className="text-sm resize-none border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        ) : fieldConfig.type === "file" ? (
                          <Input
                            id={fieldConfig.name}
                            type="file"
                            accept={fieldConfig.accept}
                            onChange={(e) => field.onChange(e.target.files)}
                            className="text-sm border-slate-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                          />
                        ) : fieldConfig.type === "checkbox" ? (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={fieldConfig.name}
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                              className="border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                            />
                            <RequiredLabel
                              htmlFor={fieldConfig.name}
                              required={true}
                            >
                              {fieldConfig.label}
                            </RequiredLabel>
                          </div>
                        ) : fieldConfig.type === "number" ? (
                          <Input
                            id={fieldConfig.name}
                            type="number"
                            placeholder={fieldConfig.placeholder}
                            step={fieldConfig.step}
                            min="0"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        ) : (
                          <Input
                            id={fieldConfig.name}
                            type={fieldConfig.type}
                            placeholder={fieldConfig.placeholder}
                            {...field}
                            value={field.value || ""}
                            className="text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Adding Medicine...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Add Medicine
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddHomeopathicMedicine;
