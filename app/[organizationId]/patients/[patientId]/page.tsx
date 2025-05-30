"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getData } from "@/services/api";
import PatientDetail from "./components.tsx/PatientDetail";

import { convertKeysToCamelCase } from "@/services/caseConverters";
import { combineNamePartsToFullName } from "@/services/nameConverter";

const PatientProfile = () => {
  const params = useParams();
  const serialNumber = params?.id;
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (serialNumber) {
        const [status, response] = await getData(
          `/organization/homeopathy/patients/${serialNumber}`
        );

        if (status !== 200) {
          console.error("Failed to fetch patient data");
          return;
        }

        // Combine first and last name into full name
        if (response.first_name && response.last_name) {
          response.name = combineNamePartsToFullName({
            first_name: response.first_name,
            last_name: response.first_name,
          });
        } else {
          response.name = response.first_name;
        }

        // Convert keys from snake_case to camelCase
        const convertedResponse: any = convertKeysToCamelCase(response);

        setPatient(convertedResponse);
      }
    };

    fetchPatientData();
  }, [serialNumber]);

  return (
    <div>
      {patient ? (
        <PatientDetail patient={patient} />
      ) : (
        <p>Loading patient data...</p>
      )}
    </div>
  );
};

export default PatientProfile;
