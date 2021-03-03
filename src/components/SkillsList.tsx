import React from "react";
import { FhirDataQuery } from "@commure/components-data";
import { Bundle, PractitionerRole, Practitioner } from "@commure/fhir-types/r4/types";
import { FhirAddress, FhirContactPointInput, FhirCodeableConcept, FhirCodeInput,  FhirCoding,  FhirDateTime, FhirHumanName, FhirInteger, FhirIdentifier, ResourceListTable, } from "@commure/components-core";
import { Table } from 'rsuite';
const { Column, HeaderCell, Cell, Pagination } = Table;
export const SkillsList: React.FC = () => (
  <>
  <FhirDataQuery queryString="PractitionerRole">
{({ data, error, loading }) => {
   if (loading) {
    return "Loading...";
  }
  if (error) {
    return "Error loading data!";
  }
  const skills: Resource[] = (data as Bundle).entry!.map(
    value => value.resource as Resource
  );
  return (
    <ResourceListTable
      resources={skills}
      headerToCellDisplay={{
        "Name": "practitioner",
        "Skill": "code",
        Specialty: "specialty",
        Contact: "telecom[0].value",
        
      }}
    />
  );
}}
</FhirDataQuery>
</>
);