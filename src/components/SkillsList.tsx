import React from "react";
import { FhirDataQuery } from "@commure/components-data";
import { Bundle, PractitionerRole, Practitioner } from "@commure/fhir-types/r4/types";
import { FhirCodeableConcept, FhirCodeableConceptInput, FhirCodeInput, FhirCoding, FhirDateTime, FhirHumanName, FhirIdentifier, FhirReference, FhirTime } from "@commure/components-core";

export const SkillsList: React.FC = () => (
  <ul className="skills-list">
    <FhirDataQuery queryString="PractitionerRole">
      {({ loading, error, data: dataUntyped }) => {
        const data = dataUntyped as Bundle | undefined;

        return (
          <>
            {loading && <p>Loading...</p>}
            {error && <p>An error occurred while fetching the skills</p>}
            {data?.entry?.map(({ resource }) => {
              const skills = resource as PractitionerRole;
              

              return (
                  
                <li className="skills-list__item" key={skills.id}>
                <FhirReference value={(skills.practitioner)}/>
            
                <p className="skills-list__date">
                Specialty: <FhirCodeableConcept
                  className="skills-menu-item__name"value={(skills.specialty || [])[0]} inline />
                  <br></br>

                Skill: <FhirCodeableConcept value={(skills.code || [])[0]} inline />
                <br></br>
                Timing: 
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