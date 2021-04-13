import FhirRest from "@commure/fhir-rest";
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
    schedule!.identifier![0].type!.text = "canceled";
    const sched = await fhirRest.update({
      resourceType: "Schedule",
      id: id,
      resource: schedule,
    });
  }
};

export default DeleteSchedule;