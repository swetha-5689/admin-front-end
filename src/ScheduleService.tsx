import { ResourceListTable } from "@commure/components-core";
import { FhirDataQuery, FhirDataQueryConsumer } from "@commure/components-data";
import { Resource, Bundle } from "@commure/fhir-types/r4/types";
import React from "react";
import { useEffect, useState } from "react";
import "./ScheduleService.scss"

const ScheduleService: React.FC = () => (
  <FhirDataQuery queryString="Schedule?practitioner=0458d419-da18-4d86-82de-31a2272f018a_include=Schedule:practitioner">
  {({ data, error, loading }) => {
     if (loading) {
      return "Loading...";
    }
    if (error) {
      return "Error loading data!";
    }
    if ((data as Bundle).entry) console.log((data as Bundle).entry![0]);
    const schedules: Resource[] = (data as Bundle).entry!.map(
      value => value.resource as Resource
    );
    return (
      <ResourceListTable className="full-table"
        resources={schedules}
        headerToCellDisplay={{
          Practitioner: "name",
          Status: "active",
          "Time Start": "planningHorizon.start",
          "Time End": "planningHorizon.end"
        }} />
    );
  }}
  </FhirDataQuery>
);
export default ScheduleService;
