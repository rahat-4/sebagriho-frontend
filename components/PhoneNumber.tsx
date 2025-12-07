import { Input } from "@/components/ui/input";

const BangladeshiFlag = () => (
  <div className="w-5 h-4 rounded overflow-hidden flex-shrink-0">
    <svg viewBox="0 0 60 40" className="w-full h-full">
      <rect width="60" height="40" fill="#006A4E" />
      <circle cx="22" cy="20" r="12" fill="#F42A41" />
    </svg>
  </div>
);

function formatPhoneNumber(value: string) {
  const digitsOnly = value.replace(/\D/g, "");
  if (digitsOnly.length <= 4) return digitsOnly;
  if (digitsOnly.length <= 7)
    return `${digitsOnly.slice(0, 4)} ${digitsOnly.slice(4)}`;
  return `${digitsOnly.slice(0, 4)} ${digitsOnly.slice(
    4,
    7
  )} ${digitsOnly.slice(7, 11)}`;
}

interface PhoneNumberProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  countryCode: string;
}

const PhoneNumber = ({
  value,
  onChange,
  isLoading,
  countryCode,
}: PhoneNumberProps) => {
  return (
    <div className="flex items-center border border-input bg-background rounded focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 transition-all">
      <div className="flex items-center space-x-2 px-3 border-r border-border bg-muted/30">
        <BangladeshiFlag />
        <span className="text-sm font-medium text-muted-foreground select-none">
          {countryCode}
        </span>
      </div>
      <Input
        id="phone"
        type="tel"
        placeholder="0123 456 7890"
        className="rounded-l-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-sm"
        maxLength={13}
        value={value ? formatPhoneNumber(value) : ""}
        onChange={(e) => {
          const input = e.target;
          const prevRaw = value || "";
          const prevFormatted = formatPhoneNumber(prevRaw);
          const prevCursor = input.selectionStart ?? 0;

          // Only allow digits and handle deletion
          const lastChar = (e.nativeEvent as InputEvent).data;
          if (lastChar && /\D/.test(lastChar)) {
            input.value = prevFormatted;
            input.setSelectionRange(prevCursor - 1, prevCursor - 1);
            return;
          }

          const rawValue = input.value.replace(/\D/g, "");
          const newFormatted = formatPhoneNumber(rawValue);

          let nextCursor = prevCursor;
          if (
            rawValue.length > prevRaw.length &&
            newFormatted.length > prevFormatted.length &&
            newFormatted[prevCursor - 1] === " " &&
            prevFormatted[prevCursor - 2] !== " "
          ) {
            nextCursor = prevCursor + 1;
          }

          onChange(rawValue);

          requestAnimationFrame(() => {
            input.setSelectionRange(nextCursor, nextCursor);
          });
        }}
        disabled={isLoading}
      />
    </div>
  );
};

export default PhoneNumber;
