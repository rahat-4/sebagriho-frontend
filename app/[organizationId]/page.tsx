import { redirect } from "next/navigation";

const Organization = async ({
  params,
}: {
  params: { organizationId: string };
}) => {
  const resolvedParams = await params;
  const organizationId = resolvedParams.organizationId;

  redirect(`/${organizationId}/dashboard`);
};

export default Organization;
