import { redirect } from "next/navigation";

const Organization = ({ params }: { params: { organizationId: string } }) => {
  redirect(`/${params.organizationId}/dashboard`);
};

export default Organization;
