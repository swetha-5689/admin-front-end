import { ResourceListTable } from "@commure/components-core";
import { FhirDataQuery, FhirDataQueryConsumer } from "@commure/components-data";
import { Resource, Bundle } from "@commure/fhir-types/r4/types";
import React from "react";
import { useEffect, useState } from "react";
import "./ScheduleService.scss"

const ScheduleService: React.FC = () => (
  <FhirDataQuery queryString="Schedule">
  {({ data, error, loading }) => {
     if (loading) {
      return "Loading...";
    }
    if (error) {
      return "Error loading data!";
    }
    const schedules: Resource[] = (data as Bundle).entry!.map(
      value => value.resource as Resource
    );
    return (
      <ResourceListTable className="plzwork"
        resources={schedules}
        headerToCellDisplay={{
          Practitioner: "actor.reference",
          Status: "active",
          "Time Start": "planningHorizon.start",
          "Time End": "planningHorizon.end"
        }}
      />
    );
  }}
  </FhirDataQuery>
);
export default ScheduleService;
