"use client";

import { useAuth } from "@/context/AuthContext";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { PlusCircle } from "lucide-react";

import CardComponents from "@/components/CardComponents";
import DataTable from "@/components/Organizations/DataTable/DataTable";

import { stats } from "@/payload/Organization";
import { getData } from "@/services/api";

const Organizations = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user?.is_admin !== true) {
      router.replace("/login"); // Replace this later
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const [status, response] = await getData("/admin/organizations");

        if (status !== 200) {
          // console.log("")
        }
        setTableData(response);
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
  if (isLoading) return <p>Checking authentication...</p>; // Add loading animation later
  if (user?.is_admin !== true) return null;

  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <CardComponents key={stat.title} {...stat} />
        ))}
      </div>

      <div className="">
        <div className="flex items-center justify-between my-4">
          <h2 className="text-2xl font-bold">Organizations List</h2>
          <Button
            className="h-9 text-sm cursor-pointer"
            onClick={() => router.push("/admin/organizations/onboard")}
          >
            Add Organization <PlusCircle />
          </Button>
        </div>
        {/* Loading state */}
        {loading && <p>Loading organizations...</p>}

        {/* Error state */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Table */}
        <DataTable data={tableData} />

        {/* Empty state */}
        {!loading && !error && tableData.length === 0 && (
          <p>No organizations found.</p>
        )}
      </div>
    </div>
  );
};

export default Organizations;
