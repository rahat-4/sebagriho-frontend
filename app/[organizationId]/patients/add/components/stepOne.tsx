"use client";

import { homeoPatientSchemaStepOne } from "@/schemas/AddHomeoPatient";

// const StepOne = ({ onNext, setSerialNumber }: StepProps) => {
//   const [message, setMessage] = useState<{
//     type: "success" | "error";
//     text: string;
//   } | null>(null);

// const form = useForm<HomeoPatientFormData>({
//   resolver: zodResolver(homeoPatientSchemaStepOne),
//   defaultValues: {
//     oldSerialNumber: "",
//     name: "",
//     phone: "",
//     relativePhone: "",
//     address: "",
//     avatar: undefined,
//   },
// });

//   const onSubmit = async (data: HomeoPatientFormData) => {
//     const formData = new FormData();

//     // Handle file upload
//     if (data.avatar?.[0]) formData.append("avatar", data.avatar[0]);

//     const [first_name, ...rest] = data.name.trim().split(" ");
//     const last_name = rest.join(" ");

//     formData.append("first_name", first_name);
//     formData.append("last_name", last_name);

//     // Append other form data (excluding name and avatar as they're handled separately)
//     Object.entries(data).forEach(([key, value]) => {
//       if (value && key !== "name" && key !== "avatar") {
//         // Convert keys to snake_case
//         const snakecasekey = camelToSnake(key as string);
//         // Ensure we're appending string values
//         formData.append(snakecasekey, String(value));
//       }
//     });

//     try {
//       const [status, response] = await postData(
//         "/organization/homeopathy/patients",
//         formData
//       );

//       if (status !== 201) {
//         Object.entries(response).map(([field, errorMessage]: any) => {
//           form.setError(field as keyof HomeoPatientFormData, {
//             type: "manual",
//             message: errorMessage,
//           });
//         });
//         return;
//       }

//       // Show success message
//       setMessage({
//         type: "success",
//         text: "Patient added successfully.",
//       });

//       setTimeout(() => {
// onNext();
// // Set serial number
// setSerialNumber(response.serial_number);
//       }, 2000);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       setMessage({
//         type: "error",
//         text: "Failed to add patient. Please try again.",
//       });
//     }
//   };

// const fields: FieldProps[] = [
//   { label: "Avatar", name: "avatar", type: "file", placeholder: "" },
//   {
//     label: "Old serial number",
//     name: "oldSerialNumber",
//     type: "text",
//     placeholder: "Ex: 12345",
//   },
//   {
//     label: "Patient name",
//     name: "name",
//     type: "tel",
//     placeholder: "Ex: John Doe",
//   },
//   {
//     label: "Phone Number",
//     name: "phone",
//     type: "tel",
//     placeholder: "Ex: 1234 567 8901",
//   },
//   {
//     label: "Relative's phone number",
//     name: "relativePhone",
//     type: "text",
//     placeholder: "Ex: 1234 567 8901",
//   },
//   {
//     label: "Address",
//     name: "address",
//     type: "textarea",
//     placeholder: "Ex: 123 Main St, City, Country",
//   },
// ];

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="space-y-4 max-w-md"
//       >
//         {/* Display message */}
//         {message && (
//           <Alert
//             className={`mb-4 ${
//               message.type === "success" ? "border-green-500 bg-green-50" : ""
//             }`}
//             variant={message.type === "error" ? "destructive" : "default"}
//           >
//             <AlertDescription
//               className={message.type === "success" ? "text-green-800" : ""}
//             >
//               {message.text}
//             </AlertDescription>
//           </Alert>
//         )}
//         {fields.map(({ label, name, type, placeholder }: FieldProps) => (
//           <FormField
//             key={name}
//             control={form.control}
//             name={name as keyof HomeoPatientFormData}
//             render={({ field }) => (
//               <FormItem className="gap-1">
//                 <FormLabel className="text-sm">{label}</FormLabel>
//                 <FormControl>
//                   {type === "file" ? (
//                     <Input
//                       id={name}
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         const files = e.target.files;
//                         field.onChange(files);
//                       }}
//                       className="text-sm"
//                     />
//                   ) : type === "textarea" ? (
//                     <Textarea
//                       {...field}
//                       value={field.value || ""}
//                       placeholder={placeholder}
//                       rows={3}
//                       className="text-sm resize-none"
//                     />
//                   ) : (
//                     <Input
//                       id={name}
//                       type={type}
//                       {...field}
//                       value={field.value || ""}
//                       className="text-sm"
//                       placeholder={placeholder}
//                     />
//                   )}
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         ))}
//         <div className="flex justify-end">
//           <Button
//             type="submit"
//             disabled={form.formState.isSubmitting}
//             className="cursor-pointer text-sm"
//             size="sm"
//           >
//             {form.formState.isSubmitting ? "Adding patient..." : "Add Patient"}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// };

// export default StepOne;

import { z } from "zod";

import { useState, useCallback } from "react";

import { Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { postData } from "@/services/api";
import { userSchema } from "@/schemas/OrganizationOnboard";

import { RequiredLabel } from "@/components/RequiredLabel";

import PhoneNumber from "@/components/PhoneNumber";
import { splitFullNameToParts } from "@/services/nameConverter";

interface StepProps {
  onNext: () => void;
  organizationId?: string;
  setPatientUid: (patientUid: any) => void;
}

interface FieldProps {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  placeholder: string;
}

const fields: FieldProps[] = [
  {
    label: "Avatar",
    name: "avatar",
    type: "file",
    placeholder: "Upload your image",
  },
  {
    label: "Old serial number",
    name: "oldSerialNumber",
    type: "text",
    placeholder: "Ex: 12345",
  },
  {
    label: "Patient name",
    name: "name",
    type: "tel",
    placeholder: "Ex: John Doe",
    required: true,
  },
  {
    label: "Phone Number",
    name: "phone",
    type: "tel",
    placeholder: "Ex: 1234 567 8901",
    required: true,
  },
  {
    label: "Relative's phone number",
    name: "relativePhone",
    type: "text",
    placeholder: "Ex: 1234 567 8901",
  },
  {
    label: "Address",
    name: "address",
    type: "textarea",
    placeholder: "Ex: 123 Main St, City, Country",
  },
];

type HomeoPatientFormData = z.infer<typeof homeoPatientSchemaStepOne>;

const StepOne: React.FC<StepProps> = ({
  onNext,
  organizationId,
  setPatientUid,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const countryCode = "+88";

  const form = useForm<HomeoPatientFormData>({
    resolver: zodResolver(homeoPatientSchemaStepOne),
    defaultValues: {
      oldSerialNumber: "",
      name: "",
      phone: "",
      relativePhone: "",
      address: "",
      avatar: undefined,
    },
  });
  const onSubmit = useCallback(async (data: HomeoPatientFormData) => {
    setIsLoading(true);
    setMessage(null);
    const formData = new FormData();

    const fullPhoneNumber = `${countryCode}${data.phone.replace(/\D/g, "")}`;
    formData.append("phone", fullPhoneNumber);

    const { firstName, lastName } = splitFullNameToParts(data.name);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);

    // Handle file inputs
    if (data.avatar?.[0]) formData.append("avatar", data.avatar[0]);

    // Handle text inputs
    Object.keys(data).forEach((key) => {
      if (key !== "avatar" && key !== "phone" && key !== "name") {
        formData.append(key, data[key as keyof HomeoPatientFormData] as string);
      }
    });

    try {
      const [status, response] = await postData(
        `/organization/homeopathy/${organizationId}/patients`,
        formData
      );

      if (status !== 201) {
        // Handle validation errors
        Object.entries(response).map(([field, errorMessage]: any) => {
          form.setError(field as keyof HomeoPatientFormData, {
            type: "manual",
            message: errorMessage,
          });
        });
        return;
      }

      setMessage({
        type: "success",
        text: "Patient added successfully.",
      });

      setTimeout(() => {
        onNext();
        // Set serial number
        setPatientUid(response.uid);
        setMessage(null);
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Form {...form}>
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
        {fields.map(
          ({ label, name, type, placeholder, required }: FieldProps) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof HomeoPatientFormData}
              render={({ field }) => (
                <FormItem className="gap-1">
                  <RequiredLabel htmlFor={name} required={required}>
                    {label}
                  </RequiredLabel>

                  <FormControl>
                    {type === "file" ? (
                      <Input
                        placeholder={placeholder}
                        id={name}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const files = e.target.files;
                          field.onChange(files);
                        }}
                        className="text-sm"
                      />
                    ) : name === "phone" ? (
                      <PhoneNumber
                        value={field.value}
                        onChange={field.onChange}
                        isLoading={isLoading}
                        countryCode={countryCode}
                      />
                    ) : (
                      <Input
                        placeholder={placeholder}
                        id={name}
                        type={type}
                        {...field}
                        value={field.value || ""}
                        className="text-sm"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding patient ...
            </>
          ) : (
            "Add patient"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default StepOne;
