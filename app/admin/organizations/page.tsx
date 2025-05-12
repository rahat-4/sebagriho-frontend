import CardComponents from "@/components/CardComponents";
import DataTable from "@/components/Organizations/DataTable";

const Organizations = () => {
  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <CardComponents
          title="Total Organizations"
          amount="1,234"
          description="Total number of organizations registered in the system."
          trendingDescription="Trending Up"
        />
        <CardComponents
          title="Active Organizations"
          amount="1,000"
          description="Number of organizations currently active."
          trendingDescription="Trending Up"
        />
        <CardComponents
          title="Payment Due Organizations"
          amount="234"
          description="Number of organizations that are due for payment."
          trendingDescription="Trending Down"
        />
        <CardComponents
          title="New Organizations"
          amount="50"
          description="Number of new organizations registered this month."
          trendingDescription="Trending Up"
        />
      </div>
      <DataTable />
    </div>
  );
};

export default Organizations;
