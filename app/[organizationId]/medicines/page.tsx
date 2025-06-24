"use client";

import LoadingComponent from "@/components/LoadingComponent";

import { useAuth } from "@/context/AuthContext";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { PlusCircle } from "lucide-react";

import CardComponents from "@/components/CardComponents";
import DataTable from "@/components/Organizations/DataTable/DataTable";

import { medicineStats } from "@/payload/Organization";
import { getData } from "@/services/api";

const Medicines = () => {
  const { isAuthenticated, user, organization, isLoading } = useAuth();
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      !isLoading &&
      (!isAuthenticated || organization === null || user?.is_owner !== true)
    ) {
      router.replace("/login"); // Replace this later
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const [status, response] = await getData(
          `/organization/homeopathy/${organization?.uid}/medicines`
        );

        console.log("------status----", status);
        console.log("------response----", response);

        if (status !== 200) {
          setError("Failed to fetch medicines");
          return;
        }
        setTableData(response);
      } catch (error: any) {
        setError(error.message || "Failed to fetch medicines");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  if (isLoading) return <LoadingComponent name={"Loading medicines..."} />;
  if (!isAuthenticated || user?.is_owner !== true) return null;

  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {medicineStats.map((stat) => (
          <CardComponents key={stat.title} {...stat} />
        ))}
      </div>

      <div className="">
        <div className="flex items-center justify-between my-4">
          <h2 className="text-2xl font-bold">Medicines List</h2>
          <Button
            className="h-9 text-sm cursor-pointer"
            onClick={() => router.push(`/${organization?.uid}/medicines/add`)}
          >
            Add Medicine <PlusCircle />
          </Button>
        </div>
        {/* Loading state */}
        {loading && <LoadingComponent name={"Loading medicines..."} />}

        {/* Error state */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Table */}
        {/* <DataTable data={tableData} /> */}

        {/* Empty state */}
        {!loading && !error && tableData.length === 0 && (
          <p>No medicines found.</p>
        )}
      </div>
    </div>
  );
};

export default Medicines;
