import React from "react";
import { FhirDataQuery } from "@commure/components-data";
import { Bundle, Resource, Practitioner, PractitionerRole} from "@commure/fhir-types/r4/types";
import { FhirCodeableConcept, ResourceListTable } from "@commure/components-core";

export const PractitionerList: React.FC = () => (
  <><h2>View Practitioners</h2>
    <FhirDataQuery queryString="Practitioner?_revinclude=PractitionerRole:practitioner">
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
          console.log(resources)
          let practMap = new Map();
          resources.forEach((val) =>{
            if (val.resourceType === 'PractitionerRole') {
              let id = (val as PractitionerRole).practitioner?.reference;
              id = id?.split('/')[1]
              practMap.set(id, (val as PractitionerRole).specialty);
            }
          })
          let specialty = resources.filter((val) => {return val.resourceType != "PractitionerRole"})

    return (
      <ResourceListTable className="full-table"
        resources={specialty}
        headerToCellDisplay={{
          "Name": "name",
          ID: "identifier[0].value",
          Specialty: (_pract: Practitioner) => (
            practMap.get(_pract.id) != null && <><FhirCodeableConcept value={practMap.get(_pract.id)[0]}></FhirCodeableConcept></>
            
          ),
          Gender: "gender",
          Contact: "telecom[0].value",
          Address: ["address"]
        }}
      />
    );
  }}
</FhirDataQuery>
  </>
);