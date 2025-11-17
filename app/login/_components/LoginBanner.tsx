import Image from "next/image";
import Banner from "@/public/banner.png";

export function LoginBanner() {
  return (
    <div className="relative hidden bg-muted md:block">
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src={Banner}
              alt="Login banner illustration"
              priority
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
