import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const UserRegistration = ({
  pathname,
  onNext,
}: {
  pathname: string;
  onNext: () => void;
}) => {
  const baseFields = [
    "Avatar",
    "First name",
    "Last name",
    "Phone",
    "Email",
    "Gender",
    "National id",
    "Nid Front Image",
    "Nid Back Image",
  ];

  const extraDoctorFields =
    pathname === "/admin/doctors/add-doctor"
      ? ["Registration number", "Appointment fee", "Followup fee"]
      : [];

  const allFields = [...baseFields, ...extraDoctorFields];

  const fileInputLabels = new Set([
    "Avatar",
    "Nid Front Image",
    "Nid Back Image",
  ]);

  return (
    <div className="space-y-4">
      {allFields.map((label) => {
        const id = label.toLowerCase().replace(/\s+/g, "-");
        const isFileInput = fileInputLabels.has(label);

        return (
          <div key={id}>
            <Label htmlFor={id} className="pb-1 block">
              {label}
            </Label>
            <Input
              id={id}
              type={
                isFileInput
                  ? "file"
                  : label.toLocaleLowerCase() == "email"
                  ? "email"
                  : "text"
              }
              className="w-full text-sm"
            />
          </div>
        );
      })}

      <div className="flex justify-end">
        <Button onClick={onNext} className="text-sm" size="sm">
          Save & Continue
        </Button>
      </div>
    </div>
  );
};

export default UserRegistration;
