import React from "react";
import { FhirDataQuery } from "@commure/components-data";
import { Bundle, Resource } from "@commure/fhir-types/r4/types";
import { ResourceListTable } from "@commure/components-core";
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
    <><h3>View Practitioner Roles</h3>
    <ResourceListTable
      resources={skills}
      headerToCellDisplay={{
        "Name": "practitioner.display",
        "Skill": "code",
        Specialty: "specialty",
        Contact: "telecom[0].value"        
      }}
    />
    </>
  );
}}
</FhirDataQuery>
</>
);