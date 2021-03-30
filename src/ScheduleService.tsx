import { FhirDataQuery } from "@commure/components-data";
import { Bundle, Practitioner, Resource, Schedule } from "@commure/fhir-types/r4/types";
import React from "react";
import { EventInput } from '@fullcalendar/react'

let resources: Resource[];
let schedules: Resource[];
const ScheduleService = () => {
  <FhirDataQuery queryString="Practitioner?_revinclude=Schedule:actor">
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
      let practMap = new Map();
      resources.forEach((val) => {
        if (val.resourceType === "Practitioner") {
          practMap.set("Practitioner/" + val.id, (val as Practitioner).name);
        }
      });
      schedules = resources.filter((val) => {
        return (val.resourceType != "Practitioner" && (val as Schedule).identifier![0].value?.startsWith('P'));
      });
      let events: EventInput[];
      schedules.forEach((val) => {
        events.push({
          id: val.id,
          title: practMap.get((val as Schedule).actor[0].reference),
          start: (val as Schedule).planningHorizon?.start,
          end: (val as Schedule).planningHorizon?.end,
        })
      })
    }}
  </FhirDataQuery>;
};
 export default ScheduleService;