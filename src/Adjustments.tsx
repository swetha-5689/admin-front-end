import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { EventService } from "./EventService";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import { INITIAL_EVENTS } from "./data/events";

const EventsCalendar = () => {
  const [startDate, setStart] = useState(null);
  const [endDate, setEnd] = useState(null);
  function dateSelect(selectionInfo: any) {
    setStart(selectionInfo.start.getDate());
    setEnd(selectionInfo.end.getDate());
  }

  useEffect(() => {
      console.log(startDate, endDate)
  })

  return (
    <div>
      <div className="card">
        <FullCalendar
          initialEvents={INITIAL_EVENTS}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          editable={true}
          selectable={true}
          select={dateSelect}
        />
      </div>
    </div>
  );
};

export default EventsCalendar;
