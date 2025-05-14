"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { PlusCircle } from "lucide-react";

import CardComponents from "@/components/CardComponents";
import DataTable from "@/components/Organizations/DataTable/DataTable";

import { stats, tableData } from "@/payload/Organization";

const Organizations = () => {
  const router = useRouter();

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
        <DataTable data={tableData} />
      </div>
    </div>
  );
};

export default Organizations;
