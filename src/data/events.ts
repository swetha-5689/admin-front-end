import { EventInput } from '@fullcalendar/react'
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
export const INITIAL_EVENTS: EventInput[] = [
    {
      id: '1',
      title: 'All-day event',
      start: todayStr
    },
    {
      id: '2',
      title: 'Timed event',
      start: todayStr + 'T12:00:00'
    }
  ]