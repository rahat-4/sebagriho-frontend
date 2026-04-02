import Image from "next/image";
import Banner from "@/public/banner.png";

export function LoginBanner() {
  return (
    <div className="relative hidden overflow-hidden bg-[linear-gradient(135deg,_rgba(32,80,114,0.94),_rgba(42,183,202,0.82))] md:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_28%)]" />
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="space-y-4 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
            Healthy workflows
          </p>
          <h2 className="text-3xl font-semibold font-ovo">
            Built for clinics that move fast.
          </h2>
          <p className="max-w-sm text-sm text-white/80">
            A calm, responsive interface for running the practice across desktop, tablet, and mobile.
          </p>
          <div className="flex justify-center">
            <Image
              src={Banner}
              alt="Login banner illustration"
              priority
              className="max-w-full h-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
