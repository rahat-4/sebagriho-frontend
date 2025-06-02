import { notFound } from "next/navigation";
import { getData } from "@/services/api";
const Dashboard = async ({
  params,
}: {
  params: { organizationId: string };
}) => {
  const organizationId = await params.organizationId;

  const [status, response] = await getData(
    `/organization/homeopathy/profile/${organizationId}`
  );

  if (status !== 200) {
    console.error("Failed to fetch organization data");
    return notFound();
  }

  console.log(response);

  return <div>Organization dashboard: {response.organization.name}</div>;
};

export default Dashboard;
