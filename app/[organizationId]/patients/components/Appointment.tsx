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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useCallback, useState, useEffect } from "react";
import { patientAppointmentSchema } from "@/schemas/PatientAppointment";
import { RequiredLabel } from "@/components/RequiredLabel";
import { camelToSnake } from "@/services/caseConverters";
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
  onAppointmentCreated?: () => void; // Callback for redirect
}

// Updated Multi-select medicines component
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest("[data-medicine-dropdown]")) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // Fetch medicines from API with better error handling
  const fetchMedicines = useCallback(
    async (query: string = "") => {
      setLoading(true);
      setError(null);

      try {
        const url = `/organization/homeopathy/${organizationId}/medicines${
          query ? `?search=${encodeURIComponent(query)}` : ""
        }`;

        console.log("API URL:", url);
        const [status, response] = await getData(url);

        if (status === 200) {
          // Try different possible data structures
          let medicineData;
          if (response.results) {
            medicineData = response.results;
          } else if (response.data) {
            medicineData = response.data;
          } else if (Array.isArray(response)) {
            medicineData = response;
          } else {
            medicineData = [];
          }

          setMedicines(Array.isArray(medicineData) ? medicineData : []);
        } else {
          console.error("Failed to fetch medicines:", status, response);
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

  // Initial fetch
  useEffect(() => {
    console.log("Initial fetch triggered for organization:", organizationId);
    if (organizationId) {
      fetchMedicines();
    }
  }, [fetchMedicines, organizationId]);

  // Debounced search with cleanup
  useEffect(() => {
    if (!organizationId) return;

    if (!searchQuery.trim()) {
      fetchMedicines();
      return;
    }

    console.log("Setting up search timer for:", searchQuery);
    const timer = setTimeout(() => {
      fetchMedicines(searchQuery.trim());
    }, 300);

    return () => {
      console.log("Clearing search timer");
      clearTimeout(timer);
    };
  }, [searchQuery, fetchMedicines, organizationId]);

  const handleSelect = (medicine: Medicine) => {
    const isSelected = value.some((m) => m.uid === medicine.uid);
    if (isSelected) {
      onChange(value.filter((m) => m.uid !== medicine.uid));
    } else {
      onChange([...value, medicine]);
    }
    // Keep dropdown open for multiple selections
  };

  const removeMedicine = (medicineId: string) => {
    onChange(value.filter((m) => m.uid !== medicineId));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log("Search query changed to:", newValue);
    setSearchQuery(newValue);
  };

  const toggleDropdown = () => {
    console.log("Toggling dropdown, current state:", open);
    setOpen(!open);
  };

  return (
    <div className="space-y-2" data-medicine-dropdown>
      {/* Dropdown trigger */}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={toggleDropdown}
          className="w-full justify-between min-h-[40px] h-auto rounded-lg"
          aria-expanded={open}
        >
          <div className="flex flex-wrap gap-1">
            {value.length === 0 ? (
              <span className="text-muted-foreground text-sm">
                Select medicines...
              </span>
            ) : (
              <span className="text-sm">
                {value.length} medicine(s) selected
              </span>
            )}
          </div>
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
                onChange={handleSearchChange}
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
                    const isSelected = value.some(
                      (m) => m.uid === medicine.uid
                    );
                    return (
                      <button
                        key={medicine.uid}
                        type="button"
                        onClick={() => handleSelect(medicine)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center cursor-pointer transition-colors"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected
                              ? "opacity-100 text-blue-600"
                              : "opacity-0"
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
      </div>

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

  // Reset form and message when dialog closes
  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when dialog closes
      form.reset();
      setMessage(null);
    }
  };

  const onSubmit = useCallback(
    async (data: HomeoPatientAppointmentFormData) => {
      setIsLoading(true);
      setMessage(null);

      const formData = new FormData();

      // Handle form data conversion
      Object.entries(data).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          const snakeCaseKey = camelToSnake(key);

          if (key === "medicines" && Array.isArray(value)) {
            // Append each medicine UID separately instead of JSON stringifying

            console.log("Appending medicines to formData:", value);

            value.forEach((medicine) => {
              if (typeof medicine === "string") {
                // If it's already transformed to UID string by Zod
                formData.append(snakeCaseKey, medicine);
              } else if (medicine && medicine.uid) {
                // If it's still a medicine object
                formData.append(snakeCaseKey, medicine.uid);
              }
            });
          } else if (key === "appointmentFile" && value instanceof FileList) {
            // Handle file upload
            if (value.length > 0) {
              formData.append(snakeCaseKey, value[0]);
            }
          } else {
            formData.append(snakeCaseKey, String(value));
          }
        }
      });

      try {
        const [status, response] = await postData(
          `/organization/homeopathy/${organizationId}/patients/${patientId}/appointments`,
          formData
        );

        if (status === 200 || status === 201) {
          // Success
          setMessage({
            type: "success",
            text: "Appointment created successfully!",
          });

          // Reset form
          form.reset({
            symptoms: "",
            treatmentEffectiveness: "",
            appointmentFile: null,
            medicines: [],
          });

          // Close dialog and redirect after a short delay
          setTimeout(() => {
            setIsOpen(false);

            // Call the redirect callback if provided
            if (onAppointmentCreated) {
              onAppointmentCreated();
            }
            setMessage(null);
          }, 1500);
        } else {
          // Handle validation errors
          if (response && typeof response === "object") {
            Object.entries(response).forEach(([field, errorMessage]: any) => {
              form.setError(field as keyof HomeoPatientAppointmentFormData, {
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
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Appointment
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] rounded-2xl border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Patient Appointment
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-xs leading-relaxed">
            Record patient present conditions and medicines.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)] pr-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              {/* Symptoms Field */}
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel
                      htmlFor="symptoms"
                      required={true}
                      icon={<Activity className="w-4 h-4 text-red-500" />}
                    >
                      Symptoms
                    </RequiredLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the patient's symptoms in detail..."
                        id="symptoms"
                        rows={4}
                        {...field}
                        value={field.value || ""}
                        className="text-sm resize-none border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Effectiveness Field */}
              <FormField
                control={form.control}
                name="treatmentEffectiveness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-semibold text-slate-700">
                      <Activity className="w-4 h-4 text-blue-500" />
                      Treatment Effectiveness
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the effectiveness of previous treatments (optional)..."
                        id="effectiveness"
                        rows={3}
                        {...field}
                        value={field.value || ""}
                        className="text-sm resize-none border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File Upload Field */}
              <FormField
                control={form.control}
                name="appointmentFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-semibold text-slate-700">
                      <FileText className="w-4 h-4 text-orange-500" />
                      Appointment Files
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="appointmentFile"
                          type="file"
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={(e) => field.onChange(e.target.files)}
                          className="text-sm border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Appointment...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
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
