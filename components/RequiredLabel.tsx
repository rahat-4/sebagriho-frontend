import { Label } from "@/components/ui/label";

// export const RequiredLabel = ({
//   htmlFor,
//   children,
// }: {
//   htmlFor: string;
//   children: React.ReactNode;
// }) => {
//   return (
//     <div className="relative w-fit">
//       <Label htmlFor={htmlFor}>{children}</Label>
//       <span className="absolute -top-1 -right-2 text-red-500">*</span>
//     </div>
//   );
// };

export const RequiredLabel = ({
  children,
  htmlFor,
  required,
}: {
  children: string;
  htmlFor: string;
  required?: boolean;
}) => (
  <Label htmlFor={htmlFor} className="text-sm font-medium">
    {children} {required && <span className="text-destructive">*</span>}
  </Label>
);
