import { redirect } from "next/navigation";

const Organization = async ({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) => {
  
  const resolvedParams = await params;
  console.log("llllllllllllllllllll", resolvedParams)
  const organizationId = resolvedParams.organizationId;

  redirect(`/${organizationId}/dashboard`);
};

export default Organization;
