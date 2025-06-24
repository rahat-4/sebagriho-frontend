"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getData } from "@/services/api";
import PatientDetail from "./components/PatientDetail";

import { convertKeysToCamelCase } from "@/services/caseConverters";
import { combineNamePartsToFullName } from "@/services/nameConverter";

const PatientProfile = () => {
  const { organizationId, patientId } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (organizationId && patientId) {
        const [status, response] = await getData(
          `/organization/homeopathy/${organizationId}/patients/${patientId}`
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
  }, [organizationId, patientId]);

  return (
    <div>
      <PatientDetail />
    </div>
  );
};

export default PatientProfile;
