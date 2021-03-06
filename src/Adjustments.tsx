import React, { useState } from "react";
import FullCalendar, {
  CalendarApi,
  DateSelectArg,
  EventApi,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import { INITIAL_EVENTS } from "./data/events";
import {
  Button,
  ControlLabel,
  Dropdown,
  Form,
  FormControl,
  FormGroup,
  HelpBlock,
  Icon,
  Modal,
  Nav,
} from "rsuite";
import { AppHeader } from "@commure/components-core";
import logo from "./assets/logo-qs.png";
import { EventClickArg } from "@fullcalendar/core";

const EventsCalendar = () => {
  const [count, setCount] = useState(1);
  const [isOpen, setOpen] = useState(false);
  const [modalVal, setModalVal] = useState("A");
  const [active, setActive] = useState("edit");
  const [selectionInfo, setSelectionInfo] = useState<DateSelectArg | undefined>(
    undefined
  );
  const [calendarApi, setCalApi] = useState<CalendarApi | undefined>(undefined);
  const [shiftDetails, setShiftDetails] = useState({
    employee: "",
    id: "",
    contact: "",
  });
  const [currEvent, setEvent] = useState<EventApi | undefined>(undefined);

  function dateSelect(info: any) {
    setSelectionInfo(info);
    setCalApi(info.view.calendar);
    modalOpen("A");
  }

  function handleChange(value: any) {
    setShiftDetails(value);
  }

  function handleSelect(activeKey: string) {
    setActive(activeKey);
  }

  const modalOpen = (val: string) => {
    setModalVal(val);
    setOpen(true);
  };

  const clearValues = () => {
    setShiftDetails({ employee: "", id: "", contact: "" });
  };

  const modalClose = () => {
    clearValues();
    setOpen(false);
  };

  const deleteEvent = () => {
    currEvent?.remove();
  };

  const editEvent = () => {
    currEvent?.setProp("title", shiftDetails.employee);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    modalOpen("DE");
    setShiftDetails({
      employee: clickInfo.event.title,
      id: clickInfo.event.extendedProps.description.split(" ")[0],
      contact: clickInfo.event.extendedProps.description.split(" ")[1],
    });
    setCalApi(clickInfo.view.calendar);
    setEvent(clickInfo.event);
  };

  const doAction = () => {
    if (modalVal === "A") {
      addEvent();
    } else if (active === "delete") {
      deleteEvent();
    } else if (active === "edit") {
      editEvent();
    }
    modalClose();
  };

  const addEvent = () => {
    if (calendarApi) {
      calendarApi.addEvent({
        id: "e" + count,
        title: shiftDetails.employee,
        start: selectionInfo?.startStr,
        end: selectionInfo?.endStr,
        description: shiftDetails.id + " " + shiftDetails.contact,
      });
      setCount(count + 1);
    } else return;
    calendarApi.unselect();
  };

  return (
    <>
      <AppHeader
        showFullUserName={true}
        logo={
          <Nav>
            <img src={logo} alt="Quick Shift Logo" width="40" height="40" />
            <Nav.Item href="/">
              <h6>Quick Shift</h6>
            </Nav.Item>
            <Nav.Item href="/home" icon={<Icon icon="home" />}>
              Home
            </Nav.Item>
            <Nav.Item href="/requests">Requests</Nav.Item>
            <Nav.Item href="/employee">Employees</Nav.Item>
            <Nav.Item href="/skills">Skills</Nav.Item>
            <Nav.Item href="/adjustments" active={true}>
              Adjustments
            </Nav.Item>
            <Dropdown title="About">
              <Dropdown.Item href='/company'>Company</Dropdown.Item>
              <Dropdown.Item href='/team'>Team</Dropdown.Item>
            </Dropdown>
          </Nav>
        }
      />

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
            eventClick={handleEventClick}
          />
        </div>
      </div>

      <Modal show={isOpen} onHide={modalClose}>
        <Modal.Header>
          <Modal.Title>Change Calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalVal === "A" && (
            <Form fluid onChange={handleChange} formValue={shiftDetails}>
              <FormGroup>
                <ControlLabel>Employee Name</ControlLabel>
                <FormControl name="employee" />
                <HelpBlock>Required</HelpBlock>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Employee ID</ControlLabel>
                <FormControl name="id" />
                <HelpBlock>Required</HelpBlock>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Contact</ControlLabel>
                <FormControl name="contact" />
                <HelpBlock>Required</HelpBlock>
              </FormGroup>
            </Form>
          )}
          {modalVal === "DE" && active === "edit" && (
            <>
              <Nav appearance="tabs" onSelect={handleSelect} activeKey={active}>
                <Nav.Item eventKey="edit">Edit</Nav.Item>
                <Nav.Item eventKey="delete">Delete</Nav.Item>
              </Nav>
              <Form fluid onChange={handleChange} formValue={shiftDetails}>
                <FormGroup>
                  <ControlLabel>Employee Name</ControlLabel>
                  <FormControl name="employee" />
                  <HelpBlock>Required</HelpBlock>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Employee ID</ControlLabel>
                  <FormControl name="id" />
                  <HelpBlock>Required</HelpBlock>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Contact</ControlLabel>
                  <FormControl name="contact" />
                  <HelpBlock>Required</HelpBlock>
                </FormGroup>
              </Form>
            </>
          )}
          {modalVal === "DE" && active === "delete" && (
            <>
              <Nav appearance="tabs" onSelect={handleSelect} activeKey={active}>
                <Nav.Item eventKey="edit">Edit</Nav.Item>
                <Nav.Item eventKey="delete">Delete</Nav.Item>
              </Nav>
              <br></br>
              <p>Are you sure you want to delete this shift?</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={doAction} appearance="primary">
            OK
          </Button>
          <Button onClick={modalClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EventsCalendar;
