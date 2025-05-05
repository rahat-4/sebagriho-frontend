import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AddOrganization = ({ onNext }: { onNext: () => void }) => {
  const baseFields = [
    "Organization Name",
    "Organization Logo",
    "Organization Type",
    "Description",
    "Phone",
    "Email",
    "Website",
    "Address",
    // "City",
    // "State",
    // "Country",
    // "Postal Code",
    "Facebook",
    "Twitter",
    "LinkedIn",
    "Instagram",
    "YouTube",
  ];

  return (
    <div className="space-y-4">
      {baseFields.map((label) => {
        const id = label.toLowerCase().replace(/\s+/g, "-");
        return (
          <div key={id}>
            <Label htmlFor={id} className="pb-1 block">
              {label}
            </Label>
            <Input
              id={id}
              type={
                label === "Organization Logo"
                  ? "file"
                  : label === "Email"
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
          Save
        </Button>
      </div>
    </div>
  );
};

export default AddOrganization;
