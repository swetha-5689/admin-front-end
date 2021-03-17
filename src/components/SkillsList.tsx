import React from "react";
import { FhirDataQuery } from "@commure/components-data";
import { Bundle, Resource, Practitioner, PractitionerRole } from "@commure/fhir-types/r4/types";
import { FhirAddress, FhirCodeableConcept, FhirHumanName, ResourceListTable } from "@commure/components-core";
export const SkillsList: React.FC = () => (
  <><h2>View Practitioner Roles</h2>
    <FhirDataQuery queryString="Practitioner?_has:PractitionerRole:practitioner:active=true&_revinclude=PractitionerRole:practitioner">
      {({ data, error, loading }) => {
        if (loading) {
          return "Loading...";
        }
        if (error) {
          return "Error loading data!";
        }
        let resources: Resource[];
        if ((data as Bundle).entry === undefined) resources = [];
        else {
          resources = (data as Bundle).entry!.map(
            (value) => value.resource as Resource
          );
        }
        let practMap = new Map();
        resources.forEach((val) => {
          if (val.resourceType === 'Practitioner') {
            practMap.set('Practitioner/' + val.id, (val as Practitioner).address);
          }
        })
        let skills = resources.filter((val) => { return val.resourceType != "Practitioner" })

        return (
          <>
            <ResourceListTable className="full-table"
              resources={skills}
              headerToCellDisplay={{
                
                
                "Name": "practitioner.display",
                "Skill": "code",
                Specialty: "specialty",
                Contact: "telecom[0].value",



              }}
            />
          </>
        );
      }}
    </FhirDataQuery>
  </>
);