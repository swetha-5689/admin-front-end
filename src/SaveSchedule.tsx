import FhirRest from "@commure/fhir-rest";
import { Schedule } from "@commure/fhir-types/r4/types";
import SMARTClient from "@commure/smart-core";
import { smartConfig } from "./config";

const SaveSchedule = async (scheduleList: any[]) => {
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
  let entries: any = [];
  scheduleList.forEach((val) => {
    if (val.timeslot && val.practitioner) {
      entries.push({
        resource: {
          resourceType: "Schedule",
          identifier: [
            {
              use: "usual",
              type: {
                text: "slot",
              },
              value: "S" + val.practitioner.id,
            },
          ],
          actor: [
            {
              reference: "Practitioner/" + val.practitioner.id,
            },
          ],
          planningHorizon: {
            start: val.timeslot.start,
            end: val.timeslot.end,
          },
        },
        request: {
          method: "POST",
          url: "Schedule",
        },
      });
    }
  });
  const result = fhirRest.batch({
    bundle: {
      resourceType: "Bundle",
      type: "batch",
      entry: entries,
    },
  });
  console.log(result);
};

export default SaveSchedule;
