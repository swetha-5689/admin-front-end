import {
    EventInput,
    EventSourceInput,
} from "@fullcalendar/react";
import {
    Schedule,
  } from "@commure/fhir-types/r4/types";
function EventSourceCreator(schedules: Schedule[] | undefined, practMap: any) {
    let eventArrayRequests: EventInput[] = [];
    let requests = schedules?.filter((val) => val?.identifier![0].type?.text?.startsWith("priority"));
    requests?.forEach((val) => {
      eventArrayRequests.push({
        id: val.id,
        description: practMap?.get(val.actor[0].reference?.split("/")[1])?.id,
        title:
          practMap?.get(val.actor[0].reference?.split("/")[1])?.name![0]
            .given![0] +
          " " +
          practMap?.get(val.actor[0].reference?.split("/")[1])?.name![0].family,
        start: val.planningHorizon?.start,
        end: val.planningHorizon?.end,
        type: "request"
      });
    });
    let eventArrayScheds: EventInput[] = [];
    let scheds = schedules?.filter((val) => val?.identifier![0].type?.text?.startsWith("slot"));
    scheds?.forEach((val) => {
      eventArrayScheds.push({
        id: val.id,
        description: practMap?.get(val.actor[0].reference?.split("/")[1])?.id,
        title:
          practMap?.get(val.actor[0].reference?.split("/")[1])?.name![0]
            .given![0] +
          " " +
          practMap?.get(val.actor[0].reference?.split("/")[1])?.name![0].family,
        start: val.planningHorizon?.start,
        end: val.planningHorizon?.end,
        type: "slot"
      });
    });
    let eventArrayRejected: EventInput[] = [];
    let rejects = schedules?.filter((val) => val?.identifier![0].type?.text?.startsWith("reject"));
    rejects?.forEach((val) => {
      eventArrayRejected.push({
        id: val.id,
        description: practMap?.get(val.actor[0].reference?.split("/")[1])?.id,
        title:
          practMap?.get(val.actor[0].reference?.split("/")[1])?.name![0]
            .given![0] +
          " " +
          practMap?.get(val.actor[0].reference?.split("/")[1])?.name![0].family,
        start: val.planningHorizon?.start,
        end: val.planningHorizon?.end,
        type: "request"
      });
    });
    let eventArrayApproved: EventInput[] = [];
    let approved = schedules?.filter((val) => val?.identifier![0].type?.text?.startsWith("approve"));
    approved?.forEach((val) => {
      eventArrayApproved.push({
        id: val.id,
        description: practMap?.get(val.actor[0].reference?.split("/")[1])?.id,
        title:
          practMap?.get(val.actor[0].reference?.split("/")[1])?.name![0]
            .given![0] +
          " " +
          practMap?.get(val.actor[0].reference?.split("/")[1])?.name![0].family,
        start: val.planningHorizon?.start,
        end: val.planningHorizon?.end,
        type: "request"
      });
    });
    let eventArrayCanceled: EventInput[] = [];
    let canceled = schedules?.filter((val) => val?.identifier![0].type?.text?.startsWith("canceled"));
    canceled?.forEach((val) => {
      eventArrayCanceled.push({
        id: val.id,
        description: practMap?.get(val.actor[0].reference?.split("/")[1])?.id,
        title:
          practMap?.get(val.actor[0].reference?.split("/")[1])?.name![0]
            .given![0] +
          " " +
          practMap?.get(val.actor[0].reference?.split("/")[1])?.name![0].family,
        start: val.planningHorizon?.start,
        end: val.planningHorizon?.end,
        type: "slot"
      });
    });
    let eventSource: EventSourceInput[] = [
      {
        events: eventArrayRequests,
        color: 'orange',
        textColor: 'white',
        editable: false
      },
      {
        events: eventArrayScheds,
        color: 'blue',
        textColor: 'white',
        editable: true
      },
      {
        events: eventArrayApproved,
        color: 'Green',
        textColor: "white",
        editable: true
      },
      {
        events: eventArrayRejected,
        color: 'Red',
        textColor: "white",
        editable: true
      },
      {
        events: eventArrayCanceled,
        color: 'silver',
        textColor: "black",
        editable: true
      }
    ];
    return eventSource;
}
export default EventSourceCreator;