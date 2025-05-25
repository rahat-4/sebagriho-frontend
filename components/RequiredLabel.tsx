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
}: {
  children: string;
  htmlFor: string;
}) => (
  <Label htmlFor={htmlFor} className="text-sm font-medium">
    {children} <span className="text-destructive">*</span>
  </Label>
);
