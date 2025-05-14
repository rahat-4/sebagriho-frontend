import CardComponents from "@/components/CardComponents";
// import DataTable from "@/components/TableView/data-table";
import DataTable from "@/components/Organizations/DataTable/DataTable";

import { columns } from "@/components/Organizations/DataTable/OrganizationColumns";

import { stats, tableData } from "@/payload/Organization";

const Organizations = () => {
  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <CardComponents key={stat.title} {...stat} />
        ))}
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-4">Organizations List</h2>
        <DataTable columns={columns} data={tableData} />
      </div>
    </div>
  );
};

export default Organizations;
