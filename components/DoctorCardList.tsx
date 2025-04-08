import DoctorCard from "./DoctorCard";

const DoctorCardList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-3">
      <DoctorCard />
      <DoctorCard />
      <DoctorCard />
      <DoctorCard />
    </div>
  );
};

export default DoctorCardList;
