import FhirRest from "@commure/fhir-rest";
import { Schedule } from "@commure/fhir-types/r4/types";
import SMARTClient from "@commure/smart-core";
import { smartConfig } from "./config";
import moment from 'moment';

const GenerateSchedule = async (details: any, requests: Schedule[] | undefined, practitioners: any) => {
    let numSlots: number = details.numSlots;
    let startDate: Date = details.dates[0];
    let endDate: Date = details.dates[1];
    let requestArr: Schedule[] = requests!.filter((val) => val!.identifier![0].type!.text?.startsWith("approve"));
    let count: number = 1;
    let timeslots: any[] = [];
    let requestOffs: any[] = [];
    let practs: any[] = [];
    console.log(details);
    for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        let currDate = d;
        for(var s = 0; s < numSlots; s++) {
            timeslots.push({
                start: moment(currDate, moment.ISO_8601).format(),
                end: moment(currDate, moment.ISO_8601).add(12, 'hours').format(),
                slotId: count
            })
            count++;
        }
        for(var s = 0; s < numSlots; s++) {
            timeslots.push({
                start: moment(currDate, moment.ISO_8601).add(12, 'hours').format(),
                end: moment(currDate, moment.ISO_8601).add(24, 'hours').format(),
                slotId: count
            })
            count++;
        }
        
    }
    requestArr.forEach((val) => {
        requestOffs.push({
            dateStart: val?.planningHorizon?.start,
            dateEnd: val?.planningHorizon?.end,
            priority: val?.identifier![0].type?.text?.substr(-1),
            practitioner:
                {
                    id: val?.actor![0].reference?.split('/')[1]
                }
        })
    })
    Array.from(practitioners.keys()).forEach((val) => {
        practs.push({
            id: val
        })
    })
    console.log(timeslots);
    console.log(requestOffs);
    console.log(practs);
}

export default GenerateSchedule;