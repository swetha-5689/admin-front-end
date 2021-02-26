import React from "react";
import { FhirDataQuery } from "@commure/components-data";
import { Bundle, Practitioner} from "@commure/fhir-types/r4/types";
import { FhirCodeInput, FhirCoding, FhirDateTime, FhirHumanName } from "@commure/components-core";

export const PractitionerList: React.FC = () => (
  <ul className="practitioner-list">
    <FhirDataQuery queryString="Practitioner">
      {({ loading, error, data: dataUntyped }) => {
        const data = dataUntyped as Bundle | undefined;

        return (
          <>
            {loading && <p>Loading...</p>}
            {error && <p>An error occurred while fetching the patients</p>}
            {data?.entry?.map(({ resource }) => {
              const practitioner= resource as Practitioner;

              return (
                <li className="practitioner-list__item" key={practitioner.id}>
                <FhirHumanName
                  className="practitioner-menu-item__name"
                 
                  value={(practitioner.name || [])[0]}
                />
                <p className="practitioner-list__date">
                DOB: <FhirDateTime value={practitioner.birthDate} inline />
                <br></br>
                Gender: <FhirDateTime value={practitioner.gender} inline />
                <br></br>
                
                </p>
                </li>
              );
            })}
          </>
        );
      }}
    </FhirDataQuery>
  </ul>
);