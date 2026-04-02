const Appointments = () => {
  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-darker">
          Appointments
        </p>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl font-ovo">
          Appointment management
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base text-balance">
          Schedule, review, and manage visits from a layout that stays usable on smaller screens.
        </p>
      </div>
    </div>
  );
};

export default Appointments;
