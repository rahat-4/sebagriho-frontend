const Admin = () => {
  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-3xl border border-border/60 bg-white/80 p-6 shadow-sm backdrop-blur">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-darker">
            Admin overview
          </p>
          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl font-ovo">
            Manage the platform from one responsive workspace.
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base text-balance">
            Track organizations, appointments, patients, and care operations with a cleaner layout that scales from desktop down to mobile.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Organizations", "42 active clinics"],
          ["Appointments", "128 today"],
          ["Patients", "3.2k records"],
          ["Revenue", "৳ 1.4M"],
        ].map(([title, description]) => (
          <div key={title} className="rounded-2xl border border-border/60 bg-white/80 p-5 shadow-sm backdrop-blur">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Admin;
