import React, { useEffect, useState } from "react";
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
import "./Adjustments.css";
import {
  Button,
  ControlLabel,
  Dropdown,
  FlexboxGrid,
  Form,
  FormControl,
  FormGroup,
  Icon,
  Modal,
  Nav,
  SelectPicker,
} from "rsuite";
import { AppHeader, FhirHumanName } from "@commure/components-core";
import logo from "./assets/logo-qs.png";
import { EventClickArg } from "@fullcalendar/core";
import { Bundle, Practitioner } from "@commure/fhir-types/r4/types";
import {
  FhirDataQueryConsumer,
  withFhirDataQuery,
} from "@commure/components-data";

const EventsCalendar = (props: FhirDataQueryConsumer) => {
  const [count, setCount] = useState(1);
  const [isOpen, setOpen] = useState(false);
  const [modalVal, setModalVal] = useState("A");
  const [active, setActive] = useState("edit");
  const [practNames, setPract] = useState([{ label: "" }]);
  const [selectionInfo, setSelectionInfo] = useState<DateSelectArg | undefined>(
    undefined
  );
  const [calendarApi, setCalApi] = useState<CalendarApi | undefined>(undefined);
  const [shiftDetails, setShiftDetails] = useState({
    id: "",
  });
  const [currEvent, setEvent] = useState<EventApi | undefined>(undefined);
  const [practMap, setPractMap] = useState<
    Map<string | undefined, Practitioner>
  >();
  const { query } = props;
  const [bundle, setBundle] = useState<Bundle | undefined>(undefined);

  useEffect(() => {
    query("Practitioner")
      .then((response: Response) => response.clone().json())
      .then((data) => setBundle(data));
  }, [query]);

  function practitionerSet() {
    let resources: Practitioner[];
    if (!bundle) resources = [];
    else {
      resources = bundle.entry!.map((value) => value.resource as Practitioner);
      let records = [
        {
          label:
            (resources[0] as Practitioner).name![0].given![0] +
            " " +
            (resources[0] as Practitioner).name![0].family,
          value: (resources[0] as Practitioner).id,
        },
      ];
      let map = new Map<string | undefined, Practitioner>();
      resources?.forEach((val, ind, arr) => {
        map.set((val as Practitioner)?.id, val as Practitioner);
        if (ind >= 1)
          records.push({
            label:
              (val as Practitioner).name![0].given![0] +
              " " +
              (val as Practitioner).name![0].family,
            value: (val as Practitioner).id,
          });
      });
      setPract(records);
      setPractMap(map);
    }
  }

  function dateSelect(info: any) {
    setSelectionInfo(info);
    setCalApi(info.view.calendar);
    modalOpen("A");
  }

  function handlePick(info: string) {
    setShiftDetails({ id: info });
  }

  function handleChange(value: any) {
    setShiftDetails(value);
  }

  function handleSelect(activeKey: string) {
    setActive(activeKey);
  }

  const modalOpen = (val: string) => {
    practitionerSet();
    setModalVal(val);
    setOpen(true);
  };

  const clearValues = () => {
    setShiftDetails({ id: "" });
  };

  const modalClose = () => {
    clearValues();
    setOpen(false);
  };

  const deleteEvent = () => {
    currEvent?.remove();
  };

  const editEvent = () => {
    currEvent?.setProp(
      "title",
      practMap?.get(shiftDetails.id)?.name![0].given![0] +
        " " +
        practMap?.get(shiftDetails.id)?.name![0].family
    );
    currEvent?.setExtendedProp("description", shiftDetails.id);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    modalOpen("DE");
    let details = {
      id: clickInfo.event.extendedProps.description,
    };
    setShiftDetails(details);
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
        title:
          practMap?.get(shiftDetails.id)?.name![0].given![0] +
          " " +
          practMap?.get(shiftDetails.id)?.name![0].family,
        start: selectionInfo?.startStr,
        end: selectionInfo?.endStr,
        description: shiftDetails.id,
      });
      setCount(count + 1);
    } else return;
    calendarApi.unselect();
  };

  return (
    <>
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
              <Nav.Item href="/adjustments" active={true}>
                Adjustments
              </Nav.Item>
              <Dropdown title="About">
                <Dropdown.Item href="/company">Company</Dropdown.Item>
                <Dropdown.Item href="/team">Team</Dropdown.Item>
              </Dropdown>
            </Nav>
          }
        />
      </>
      <br />
      <FlexboxGrid justify="end" align="middle">
        <Button color="green">Generate Schedule</Button>
      </FlexboxGrid>
      <>
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
                  <ControlLabel>Employee</ControlLabel>
                  <SelectPicker
                    data={practNames}
                    onSelect={handlePick}
                    name="employee"
                    renderValue={(val) => (
                      <FhirHumanName value={practMap?.get(val)?.name![0]} />
                    )}
                  ></SelectPicker>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Employee ID</ControlLabel>
                  <FormControl name="id" />
                </FormGroup>
              </Form>
            )}
            {modalVal === "DE" && active === "edit" && (
              <>
                <Nav
                  appearance="tabs"
                  onSelect={handleSelect}
                  activeKey={active}
                >
                  <Nav.Item eventKey="edit">Edit</Nav.Item>
                  <Nav.Item eventKey="delete">Delete</Nav.Item>
                </Nav>
                <Form fluid onChange={handleChange} formValue={shiftDetails}>
                  <FormGroup>
                    <ControlLabel>Employee</ControlLabel>
                    <SelectPicker
                      data={practNames}
                      onSelect={handlePick}
                      name="employee"
                      renderValue={(val) => (
                        <FhirHumanName value={practMap?.get(val)?.name![0]} />
                      )}
                    ></SelectPicker>
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Employee ID</ControlLabel>
                    <FormControl name="id" readOnly={true} />
                  </FormGroup>
                </Form>
              </>
            )}
            {modalVal === "DE" && active === "delete" && (
              <>
                <Nav
                  appearance="tabs"
                  onSelect={handleSelect}
                  activeKey={active}
                >
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
    </>
  );
};

export default withFhirDataQuery(EventsCalendar);
