import DoctorCard from "./DoctorCard";

const DoctorCardList = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <DoctorCard />
      <DoctorCard />
      <DoctorCard />
      <DoctorCard />
    </div>
  );
};

export default DoctorCardList;
