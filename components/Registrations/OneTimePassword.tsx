import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const OneTimePassword = ({ onNext }: { onNext: () => void }) => {
  const [value, setValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t > 0) return t - 1;
        clearInterval(interval);
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isResendActive = timeLeft <= 0;

  return (
    <div className="space-y-2 justify-center items-center flex flex-col">
      <div className="text-center text-sm text-muted-foreground">
        Check your phone for the one-time password (OTP) and enter it here to
        continue.
      </div>
      <InputOTP
        maxLength={6}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-sm font-semibold">
        {`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0"
        )}`}
      </p>
      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          className="text-sm"
          size="sm"
          disabled={!isResendActive}
        >
          Resend Password
        </Button>
        <Button className="text-sm" size="sm" onClick={onNext}>
          Verify Password
        </Button>
      </div>
    </div>
  );
};

export default OneTimePassword;
