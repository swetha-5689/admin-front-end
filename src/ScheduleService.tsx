import { FhirDataQuery } from "@commure/components-data";
import { Bundle, Resource } from "@commure/fhir-types/r4/types";
import React from "react";

let resources: Resource[];
const ScheduleService = () => {
    <FhirDataQuery queryString="Practitioner">
  {({ data, error, loading }) => {
     if (loading) {
      return "Loading...";
    }
    if (error) {
      return "Error loading data!";
    }
          if ((data as Bundle).entry === undefined) resources = [];
          else {
            resources = (data as Bundle).entry!.map(
              (value) => value.resource as Resource
            );
          }
        }
    }
    </FhirDataQuery>
    return resources;
}
export default ScheduleService;
