import React from "react";
import { FhirDataQuery } from "@commure/components-data";
import { Bundle, Practitioner, Resource} from "@commure/fhir-types/r4/types";
import { FhirAddress, FhirContactPointInput, FhirCodeableConcept, FhirCodeInput,  FhirCoding,  FhirDateTime, FhirHumanName, FhirInteger, FhirIdentifier, ResourceListTable, } from "@commure/components-core";
import { Table } from 'rsuite';
const { Column, HeaderCell, Cell, Pagination } = Table;

export const PractitionerList: React.FC = () => (
  <>
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
      <ResourceListTable
        resources={practitioners}
        headerToCellDisplay={{
          "Name": "name",
          "Date of Birth": "birthDate",
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