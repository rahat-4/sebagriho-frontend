import { Button } from "@/components/ui/button";
import {
  socialLogins,
  type SocialLoginProvider,
} from "../_constants/socialLogins";

interface SocialLoginButtonsProps {
  onSocialLogin: (provider: string) => void;
  disabled?: boolean;
}

export function SocialLoginButtons({
  onSocialLogin,
  disabled = false,
}: SocialLoginButtonsProps) {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {socialLogins.map((social) => (
          <Button
            key={social.name}
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onSocialLogin(social.name)}
            disabled={disabled}
            type="button"
          >
            {social.icon}
            <span className="sr-only">Login with {social.name}</span>
          </Button>
        ))}
      </div>
    </>
  );
}
