import PatientCard from "@/components/CardComponents/PatientCard";

const Patients = () => {
  return (
    <div className="space-y-4">
      <PatientCard />
      <PatientCard />
      <PatientCard />
    </div>
  );
};

export default Patients;

export const metadata = {
  title: "Patients",
  description: "Manage your patients",
};
