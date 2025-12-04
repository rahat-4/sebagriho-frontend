// File: app/(organization)/[organizationId]/medicines/components/AddMedicine.tsx
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

type HomeopathicMedicineForm = z.infer<typeof homeopathicMedicineSchema>;

const FORM_FIELDS = [
  {
    name: "is_available" as const,
    label: "Medicine is currently available",
    icon: <Package className="w-4 h-4 text-[#2ab7ca]" />,
    required: true,
    type: "checkbox",
  },
  {
    name: "avatar" as const,
    label: "Medicine Image",
    icon: <ImageIcon className="w-4 h-4 text-[#2ab7ca]" />,
    required: false,
    type: "file",
    accept: "image/*",
  },
  {
    name: "name" as const,
    label: "Medicine Name",
    icon: <Pill className="w-4 h-4 text-[#205072]" />,
    required: true,
    type: "text",
    placeholder: "Enter medicine name",
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
    name: "power" as const,
    label: "Power",
    icon: <Pill className="w-4 h-4 text-[#2ab7ca]" />,
    required: false,
    type: "text",
    placeholder: "Enter power (e.g., 30C, 200C)",
  },
  {
    name: "manufacturer" as const,
    label: "Manufacturer",
    icon: <Building className="w-4 h-4 text-[#205072]" />,
    required: false,
    type: "text",
    placeholder: "Enter manufacturer name",
  },
  {
    name: "unit_price" as const,
    label: "Unit Price",
    icon: <DollarSign className="w-4 h-4 text-[#2ab7ca]" />,
    required: false,
    type: "number",
    placeholder: "Enter unit price",
    step: "0.01",
  },
  {
    name: "total_quantity" as const,
    label: "Total Quantity",
    icon: <Package className="w-4 h-4 text-[#205072]" />,
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

      Object.entries(data).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) return;

        const snakeCaseKey = camelToSnake(key);

        if (key === "avatar" && value instanceof FileList) {
          if (value.length > 0) {
            formData.append(snakeCaseKey, value[0]);
          }
        } else if (key === "unit_price" || key === "total_quantity") {
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
          if (response && typeof response === "object") {
            Object.entries(response as Record<string, unknown>).forEach(
              ([field, errorMessage]: [string, unknown]) => {
                const messageText = Array.isArray(errorMessage)
                  ? String((errorMessage as unknown[])[0])
                  : String(errorMessage);
                form.setError(field as keyof HomeopathicMedicineForm, {
                  type: "manual",
                  message: messageText,
                });
              }
            );
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
          size="sm"
          className="bg-gradient-to-br from-[#205072] to-[#2d6a96] hover:from-[#183d56] hover:to-[#205072] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Medicine
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] rounded-2xl border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50">
        <DialogHeader className="gap-0">
          <DialogTitle className="text-lg font-bold bg-gradient-to-r from-[#205072] to-[#2ab7ca] bg-clip-text text-transparent">
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
              {message && (
                <Alert
                  className={cn(
                    "border-l-4 rounded-lg",
                    message.type === "success"
                      ? "border-l-[#2ab7ca] bg-[#e6f7f9] border-[#2ab7ca]/30"
                      : "border-l-red-500 bg-red-50 border-red-200"
                  )}
                  variant={message.type === "error" ? "destructive" : "default"}
                >
                  <AlertDescription
                    className={cn(
                      "font-medium",
                      message.type === "success"
                        ? "text-[#2199aa]"
                        : "text-red-800"
                    )}
                  >
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

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
                            className="text-sm resize-none border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2ab7ca]/50 focus:border-[#2ab7ca]"
                          />
                        ) : fieldConfig.type === "file" ? (
                          <Input
                            id={fieldConfig.name}
                            type="file"
                            accept={fieldConfig.accept}
                            onChange={(e) => field.onChange(e.target.files)}
                            className="text-sm border-slate-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e6f7f9] file:text-[#205072] hover:file:bg-[#d1f2f5]"
                          />
                        ) : fieldConfig.type === "checkbox" ? (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={fieldConfig.name}
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                              className="border-slate-300 data-[state=checked]:bg-[#2ab7ca] data-[state=checked]:border-[#2ab7ca]"
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
                            min="0"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2ab7ca]/50 focus:border-[#2ab7ca]"
                          />
                        ) : (
                          <Input
                            id={fieldConfig.name}
                            type={fieldConfig.type}
                            placeholder={fieldConfig.placeholder}
                            {...field}
                            value={field.value || ""}
                            className="text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2ab7ca]/50 focus:border-[#2ab7ca]"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#2ab7ca] to-[#2199aa] hover:from-[#2199aa] hover:to-[#187b8a] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
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
