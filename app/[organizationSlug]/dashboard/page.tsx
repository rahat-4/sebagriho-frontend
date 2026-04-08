import { getData } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
const Dashboard = async ({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) => {
  const resolvedParams = await params;
  const organizationSlug = resolvedParams.organizationSlug;

  const [status, response] = await getData(
    `/organization/homeopathy/${organizationSlug}/profile`
  );

  console.log("Organization profile response:", { status, response });

  if (status !== 200) {
    console.error("Failed to fetch organization data");
    // return notFound();
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-border/60 bg-white/80 p-6 shadow-sm backdrop-blur">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-darker">
            Organization dashboard
          </p>
          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl font-ovo">
            {response.organization.name}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base text-balance">
            A focused operational view for this organization with room for patient, appointment, and medicine workflows.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Patients", "Live records"],
          ["Appointments", "Today’s schedule"],
          ["Medicines", "Stock overview"],
          ["Activity", "Recent updates"],
        ].map(([title, description]) => (
          <Card key={title} className="rounded-2xl border border-border/60 bg-white/80 shadow-sm backdrop-blur">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="mt-2 text-xl font-semibold text-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
