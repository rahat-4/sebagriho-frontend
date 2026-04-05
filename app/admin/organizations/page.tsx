"use client";

import { useAuth } from "@/context/AuthContext";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { PlusCircle } from "lucide-react";

import CardComponents from "@/components/CardComponents";
import DataTable from "@/components/Organizations/DataTable/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { stats } from "@/payload/Organization";
import { getData } from "@/services/api";

const Organizations = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const [status, response] = await getData("/admin/organizations");

        console.log("API Response Status:", status);
        console.log("API Response Data:", response["results"] || response); // Adjust based on actual API response structure

        setTableData(response["results"] || []); // Adjust based on actual API response structure


      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch organizations");
        } else {
          setError(String(err) || "Failed to fetch organizations");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  // ⛔ Prevent rendering before auth status is known
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-3xl" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-[28rem] rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-border/60 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-darker">
              Organizations
            </p>
            <h1 className="font-ovo text-2xl font-semibold text-foreground sm:text-3xl">
              Organize providers with a clearer, faster workspace.
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base text-balance">
              Review live organization data, filter records, and move between onboarding and operations without losing context.
            </p>
          </div>
          <Button
            className="h-11 cursor-pointer rounded-xl bg-primary px-5 text-sm text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            onClick={() => router.push("/admin/organizations/onboard")}
          >
            Add Organization <PlusCircle />
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <CardComponents key={stat.title} {...stat} />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-ovo text-xl font-semibold text-foreground sm:text-2xl">
            Organizations list
          </h2>
          <p className="text-sm text-muted-foreground">
            {tableData.length} records loaded
          </p>
        </div>

        {loading && (
          <Card className="rounded-3xl border-border/60 bg-white/80 shadow-sm backdrop-blur">
            <CardContent className="space-y-3 p-6">
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="rounded-3xl border-border/60 bg-white/80 shadow-sm backdrop-blur">
            <CardContent className="p-6 text-sm text-destructive">
              {error}
            </CardContent>
          </Card>
        )}

        {!loading && !error && tableData.length > 0 && <DataTable data={tableData} />}

        {!loading && !error && tableData.length === 0 && (
          <Card className="rounded-3xl border-dashed border-border/70 bg-white/60 shadow-none backdrop-blur">
            <CardContent className="flex min-h-40 items-center justify-center p-6 text-sm text-muted-foreground">
              No organizations found.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Organizations;
