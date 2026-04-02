import { SlidersHorizontal, ArrowDownUp } from "lucide-react";

import DoctorCardList from "@/components/DoctorCardList";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl border border-border/60 bg-white/80 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-darker">
              Discover doctors
            </p>
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl font-ovo">
              Find the right care faster.
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base text-balance">
              Browse specialists, compare availability, and book appointments from a clean interface that works well on mobile, tablet, and desktop.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ["120+", "Doctors"],
              ["24/7", "Booking"],
              ["4.8/5", "Patient rating"],
            ].map(([value, label]) => (
              <Card key={label} className="rounded-2xl border-border/60 bg-background/80">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-semibold text-foreground">{value}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
          <SlidersHorizontal size={16} />
          Featured specialists
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowDownUp size={16} />
          Sort by experience
        </div>
      </section>

      <DoctorCardList />
    </main>
  );
}
