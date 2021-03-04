import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import { INITIAL_EVENTS } from "./data/events";
import { Dropdown, Icon, Nav } from "rsuite";
import { AppHeader } from "@commure/components-core";
import logo from "./assets/logo-qs.jpg";

const EventsCalendar = () => {
  const [startDate, setStart] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [endDate, setEnd] = useState(null);
  function dateSelect(selectionInfo: any) {
    setStart(selectionInfo.start.getDate());
    setEnd(selectionInfo.end.getDate());
  }

  useEffect(() => {
      console.log(startDate, endDate)
  })

  const toggleCollapse = () => {
    setOpen(!isOpen);
  };

  return (
    <><AppHeader showFullUserName={true} logo={<Nav>
      <img src={logo} alt="Quick Shift Logo" width="40" height="40" />
      <Nav.Item href='/'>
        <h6>Quick Shift</h6>
      </Nav.Item>
      <Nav.Item href='/home' icon={<Icon icon="home" />}>Home</Nav.Item>
      <Nav.Item href='/schedule'>Schedule</Nav.Item>
      <Nav.Item href='/employee'>Employees</Nav.Item>
      <Nav.Item href='/skills'>Skills</Nav.Item>
      <Nav.Item href='/adjustments' active={true}>Adjustments</Nav.Item>
      <Dropdown title="About">
        <Dropdown.Item>Company</Dropdown.Item>
        <Dropdown.Item>Team</Dropdown.Item>
        <Dropdown.Item>Contact</Dropdown.Item>
      </Dropdown>
    </Nav>}/>
      
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
    </>
  );
};

export default EventsCalendar;
