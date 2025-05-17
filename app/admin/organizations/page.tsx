"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { PlusCircle } from "lucide-react";

import CardComponents from "@/components/CardComponents";
import DataTable from "@/components/Organizations/DataTable/DataTable";

import { stats } from "@/payload/Organization";
import { getData } from "@/services/api";

const Organizations = () => {
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getData("/admin/organizations");
        setTableData(data);
      } catch (error: any) {
        setError(error.message || "Failed to fetch organizations");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

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
