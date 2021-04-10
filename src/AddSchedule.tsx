import FhirRest from "@commure/fhir-rest";
import SMARTClient from "@commure/smart-core";
import { smartConfig } from "./config";

const AddSchedule = async (pract: any, start: any, end: any) => {
  const smartClient = new SMARTClient(smartConfig);
  if (
    !process.env.REACT_APP_CLIENT_ID ||
    !process.env.REACT_APP_FHIR_BASE_URL
  ) {
    throw new Error(
      "Please define `REACT_APP_CLIENT_ID` and `REACT_APP_FHIR_BASE_URL` in your .env file"
    );
  }
  const url = process.env.REACT_APP_FHIR_BASE_URL;
  const fhirRest = new FhirRest({
    baseUrl: url,
    secureFetch: smartClient.fetch.bind(smartClient),
  });
  const res = await fhirRest.create({
    resourceType: "Schedule",
    resource: {
      resourceType: "Schedule",
      identifier: [
        {
          use: "usual",
          type: {
            text: "slot",
          },
          value: "S" + pract,
        },
      ],
      active: true,
      actor: [
        {
          reference: "Practitioner/" + pract,
        },
      ],
      planningHorizon: {
        start: start,
        end: end,
      },
    },
  });
};
export default AddSchedule;
