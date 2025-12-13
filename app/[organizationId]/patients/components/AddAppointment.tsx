import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  Check,
  ChevronsUpDown,
  X,
  FileText,
  Pill,
  Activity,
} from "lucide-react";
import { useCallback, useState, useEffect, useMemo } from "react";
import { patientAppointmentSchema } from "@/schemas/PatientAppointment";
import { RequiredLabel } from "@/components/RequiredLabel";
import { camelToSnake } from "@/services/converter";
import { postData, getData } from "@/services/api";
import { cn } from "@/lib/utils";

// Medicine interface
interface Medicine {
  uid: string;
  name: string;
  power?: string;
  total_quantity?: number;
  unit_price?: number;
}

type HomeoPatientAppointmentFormData = z.infer<typeof patientAppointmentSchema>;

interface PatientAppointmentProps {
  organizationId: string;
  patientId: string;
  onAppointmentCreated?: () => void;
}

const MedicineMultiSelect = ({
  value = [],
  onChange,
  organizationId,
}: {
  value: Medicine[];
  onChange: (medicines: Medicine[]) => void;
  organizationId: string;
}) => {
  const [open, setOpen] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Memoize selected UIDs for performance
  const selectedUids = useMemo(() => new Set(value.map((m) => m.uid)), [value]);

  // Optimized fetch function
  const fetchMedicines = useCallback(
    async (query = "") => {
      if (!organizationId) return;

      setLoading(true);
      setError(null);

      try {
        const url = `/organization/homeopathy/${organizationId}/medicines${
          query ? `?search=${encodeURIComponent(query)}` : ""
        }`;
        const [status, response] = await getData(url);

        if (status === 200) {
          const medicineData =
            response.results || response.data || response || [];
          setMedicines(Array.isArray(medicineData) ? medicineData : []);
        } else {
          setError(`Failed to load medicines (Status: ${status})`);
          setMedicines([]);
        }
      } catch (error) {
        console.error("Failed to fetch medicines:", error);
        setError("Network error while loading medicines");
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    },
    [organizationId]
  );

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(
      () => {
        fetchMedicines(searchQuery.trim());
      },
      searchQuery ? 300 : 0
    );

    return () => clearTimeout(timer);
  }, [searchQuery, fetchMedicines]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest("[data-medicine-dropdown]")) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelect = (medicine: Medicine) => {
    const isSelected = selectedUids.has(medicine.uid);
    if (isSelected) {
      onChange(value.filter((m) => m.uid !== medicine.uid));
    } else {
      onChange([...value, medicine]);
    }
  };

  const removeMedicine = (medicineId: string) => {
    onChange(value.filter((m) => m.uid !== medicineId));
  };

  const displayText =
    value.length === 0
      ? "Select medicines..."
      : `${value.length} medicine(s) selected`;

  return (
    <div className="relative space-y-2" data-medicine-dropdown>
      {/* Dropdown trigger */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(!open)}
        className="w-full justify-between min-h-[40px] rounded-lg"
        aria-expanded={open}
      >
        <span
          className={cn(
            "text-sm",
            value.length === 0 && "text-muted-foreground"
          )}
        >
          {displayText}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {/* Dropdown content */}
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <Input
              type="text"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-sm"
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">Loading medicines...</span>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-sm text-red-600">
                {error}
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => fetchMedicines(searchQuery)}
                  className="ml-2 h-auto p-0"
                >
                  Retry
                </Button>
              </div>
            ) : medicines.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {searchQuery
                  ? `No medicines found for "${searchQuery}"`
                  : "No medicines available"}
              </div>
            ) : (
              <div className="py-1">
                {medicines.map((medicine) => {
                  const isSelected = selectedUids.has(medicine.uid);
                  return (
                    <button
                      key={medicine.uid}
                      type="button"
                      onClick={() => handleSelect(medicine)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center transition-colors"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100 text-blue-600" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium text-sm truncate">
                          {medicine.name}
                        </span>
                        {medicine.power && (
                          <span className="text-xs text-muted-foreground">
                            Power: {medicine.power}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected medicines display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-lg">
          {value.map((medicine) => (
            <Badge
              key={medicine.uid}
              variant="secondary"
              className="px-2 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
            >
              <Pill className="w-3 h-3 mr-1" />
              {medicine.name}
              {medicine.power && (
                <span className="ml-1 text-xs">({medicine.power})</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0 hover:bg-blue-300"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeMedicine(medicine.uid);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

// Form field configuration
const FORM_FIELDS = [
  {
    name: "symptoms" as const,
    label: "Symptoms",
    icon: <Activity className="w-4 h-4 text-red-500" />,
    required: true,
    type: "textarea",
    placeholder: "Describe the patient's symptoms in detail...",
    rows: 4,
  },
  {
    name: "treatmentEffectiveness" as const,
    label: "Treatment Effectiveness",
    icon: <Activity className="w-4 h-4 text-blue-500" />,
    required: false,
    type: "textarea",
    placeholder:
      "Describe the effectiveness of previous treatments (optional)...",
    rows: 3,
  },
  {
    name: "appointmentFile" as const,
    label: "Appointment Files",
    icon: <FileText className="w-4 h-4 text-orange-500" />,
    required: false,
    type: "file",
    accept: "image/*,.pdf,.doc,.docx",
  },
] as const;

export const PatientAppointment = ({
  organizationId,
  patientId,
  onAppointmentCreated,
}: PatientAppointmentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<HomeoPatientAppointmentFormData>({
    resolver: zodResolver(patientAppointmentSchema),
    defaultValues: {
      symptoms: "",
      treatmentEffectiveness: "",
      appointmentFile: null,
      medicines: [],
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
    async (data: HomeoPatientAppointmentFormData) => {
      setIsLoading(true);
      setMessage(null);

      const formData = new FormData();

      // Process form data
      Object.entries(data).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) return;

        const snakeCaseKey = camelToSnake(key);

        if (key === "medicines" && Array.isArray(value)) {
          value.forEach((medicine) => {
            const uid = typeof medicine === "string" ? medicine : medicine?.uid;
            if (uid) formData.append(snakeCaseKey, uid);
          });
        } else if (key === "appointmentFile" && value instanceof FileList) {
          if (value.length > 0) {
            formData.append(snakeCaseKey, value[0]);
          }
        } else {
          formData.append(snakeCaseKey, String(value));
        }
      });

      try {
        const [status, response] = await postData(
          `/organization/homeopathy/${organizationId}/patients/${patientId}/appointments`,
          formData
        );

        if (status === 200 || status === 201) {
          setMessage({
            type: "success",
            text: "Appointment created successfully!",
          });
          form.reset();

          setTimeout(() => {
            setIsOpen(false);
            onAppointmentCreated?.();
            setMessage(null);
          }, 1500);
        } else {
          // Handle validation errors
          if (response && typeof response === "object") {
            Object.entries(response).forEach(([field, errorMessage]) => {
              const message = Array.isArray(errorMessage)
                ? errorMessage[0]
                : String(errorMessage);
              form.setError(field as keyof HomeoPatientAppointmentFormData, {
                type: "manual",
                message,
              });
            });
          }
          setMessage({
            type: "error",
            text: "Please fix the errors below and try again.",
          });
        }
      } catch (error) {
        console.error("Appointment creation error:", error);
        setMessage({
          type: "error",
          text: "Something went wrong. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [organizationId, patientId, form, onAppointmentCreated]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-[#2ab7ca] to-[#2199aa] hover:from-[#2199aa] hover:to-[#187b8a] hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Appointment
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] rounded-2xl border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50">
        <DialogHeader className="gap-0">
          <DialogTitle className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Patient Appointment
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-xs leading-relaxed">
            Record patient present conditions and medicines.
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
                      {fieldConfig.required ? (
                        <RequiredLabel
                          htmlFor={fieldConfig.name}
                          required={true}
                          icon={fieldConfig.icon}
                        >
                          {fieldConfig.label}
                        </RequiredLabel>
                      ) : (
                        <FormLabel className="flex items-center text-sm font-semibold text-slate-700">
                          {fieldConfig.icon}
                          {fieldConfig.label}
                        </FormLabel>
                      )}
                      <FormControl>
                        {fieldConfig.type === "textarea" ? (
                          <Textarea
                            placeholder={fieldConfig.placeholder}
                            id={fieldConfig.name}
                            rows={fieldConfig.rows}
                            {...field}
                            value={field.value || ""}
                            className="text-sm resize-none border-slate-200 rounded-lg"
                          />
                        ) : (
                          <Input
                            id={fieldConfig.name}
                            type="file"
                            accept={fieldConfig.accept}
                            onChange={(e) => field.onChange(e.target.files)}
                            className="text-sm border-slate-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {/* Medicines Field */}
              <FormField
                control={form.control}
                name="medicines"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-semibold text-slate-700">
                      <Pill className="w-4 h-4 text-purple-500" />
                      Prescribed Medicines
                    </FormLabel>
                    <FormControl>
                      <MedicineMultiSelect
                        value={field.value || []}
                        onChange={field.onChange}
                        organizationId={organizationId}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#2ab7ca] to-[#2199aa] hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Creating Appointment...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Create Appointment
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
