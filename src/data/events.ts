import { EventInput } from '@fullcalendar/react'
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
export const INITIAL_EVENTS: EventInput[] = [
    {
      id: '1',
      title: 'John Smith',
      description: '1 3456',
      start: todayStr
    },
    {
      id: '2',
      title: 'Jane Doe',
      description: '1 343546',
      start: todayStr + 'T12:00:00'
    }
  ]