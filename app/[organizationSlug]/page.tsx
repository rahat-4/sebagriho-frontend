import { redirect } from "next/navigation";

const Organization = async ({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) => {
  
  const resolvedParams = await params;
  console.log("llllllllllllllllllll", resolvedParams)
  const organizationSlug = resolvedParams.organizationSlug;

  redirect(`/${organizationSlug}/dashboard`);
};

export default Organization;
