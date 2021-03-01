import axios from 'axios';

export class EventService {

    getEvents() {
        return axios.get('data/events.json')
                .then((res: { data: { data: any; }; }) => res.data.data);
    }
}