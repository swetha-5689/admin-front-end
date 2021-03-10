import React from "react";
import { FhirDataQuery } from "@commure/components-data";
import { Bundle, Resource} from "@commure/fhir-types/r4/types";
import { ResourceListTable } from "@commure/components-core";

export const PractitionerList: React.FC = () => (
  <><h2>View Practitioners</h2>
    <FhirDataQuery queryString="Practitioner">
  {({ data, error, loading }) => {
     if (loading) {
      return "Loading...";
    }
    if (error) {
      return "Error loading data!";
    }
    const practitioners: Resource[] = (data as Bundle).entry!.map(
      value => value.resource as Resource
    );
    return (
      <ResourceListTable className="full-table"
        resources={practitioners}
        headerToCellDisplay={{
          "Name": "name",
          ID: "identifier[0].value",
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