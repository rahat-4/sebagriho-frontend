import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export const RequiredLabel = ({
  children,
  htmlFor,
  required,
  icon,
  className,
}: {
  children: React.ReactNode;
  htmlFor: string;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
}) => (
  <Label
    htmlFor={htmlFor}
    className={cn(
      "text-sm font-semibold text-slate-700",
      className // 🔥 override allowed
    )}
  >
    {icon}
    {children} {required && <span className="text-destructive">*</span>}
  </Label>
);
