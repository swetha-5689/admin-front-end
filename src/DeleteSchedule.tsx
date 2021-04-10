/*const result = await fhirRest.batch({ bundle: {
    *  "resourceType": "Bundle",
    *  "id": "bundle-request-simplesummary",
    *  "type": "batch",
    *  "entry": [
    *    {
    *      "request": {
    *        "method": "GET",
    *        "url": "/Patient/example"
    *      }*/
import FhirRest from "@commure/fhir-rest";
import FhirClient from "@commure/fhir-client";
import { Schedule } from "@commure/fhir-types/r4/types";
import SMARTClient from "@commure/smart-core";
import { smartConfig } from "./config";

const DeleteSchedule = async (schedule: Schedule) => {
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
  if (schedule.id) {
    let id = schedule.id;
    let bundle = { bundle: {
        resourceType: "Bundle",
        id: "bundle-request-simplesummary",
        "type": "batch",
        entry: [{
            request: {
                method: "DELETE",
                "url": "Schedule/" + id 
            }
        }]
    }};
    console.log(bundle);
    const sched = await fhirRest.batch(bundle);
    console.log(sched);
  }
};

export default DeleteSchedule;