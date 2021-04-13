import React, { useEffect, useState } from "react";
import FullCalendar, {
  CalendarApi,
  DateSelectArg,
  EventApi,
  EventInput,
  EventSourceInput,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "./Adjustments.css";
import EditSchedule from "./EditSchedule";
import {
  Button,
  ControlLabel,
  DateRangePicker,
  Dropdown,
  FlexboxGrid,
  Form,
  FormControl,
  FormGroup,
  Icon,
  InputNumber,
  Modal,
  Nav,
  SelectPicker,
  Radio,
  RadioGroup,
  Popover,
  Whisper,
} from "rsuite";
import { AppHeader, FhirHumanName } from "@commure/components-core";
import logo from "./assets/logo-qs.png";
import { EventClickArg } from "@fullcalendar/core";
import {
  Bundle,
  Practitioner,
  Resource,
  Schedule,
} from "@commure/fhir-types/r4/types";
import {
  FhirDataQueryConsumer,
  withFhirDataQuery,
} from "@commure/components-data";
import AddSchedule from "./AddSchedule";
import DeleteSchedule from "./DeleteSchedule";
import GenerateSchedule from "./GenerateSchedules";
import moment from 'moment';
import RequestSender from "./RequestSender";
import EventSourceCreator from "./EventSourceCreator";
const {
  allowedMaxDays,
  beforeToday,
  combine
} = DateRangePicker

const EventsCalendar = (props: FhirDataQueryConsumer) => {
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
  const [schedules, setSchedules] = useState<Schedule[] | undefined>(undefined);
  const [generateDetails, setGenerateDetails] = useState({ dates: [new Date(), new Date()], numSlots: 0 });
  const { query } = props;
  const [bundle, setBundle] = useState<Bundle | undefined>(undefined);
  const [events, setEvents] = useState<EventSourceInput[] | undefined>(undefined);
  const [requestDecision, setRequestDecision] = useState({ decision: "approve" });
  const speaker = (
    <Popover>
      Dark Blue: Current Schedule <br></br>
      Gray: Canceled Schedule <br></br>
      Green: Approved Request<br></br>
      Orange: Pending Request <br></br>
      Red: Rejected Request<br></br>
    </Popover>
  );

  useEffect(
    function queryFunction() {
      query("Practitioner?_revinclude=Schedule:actor")
        .then((response: Response) => response.clone().json())
        .then((data) => setBundle(data));
    },
    [query]
  );

  function queryFunct() {
    query("Practitioner?_revinclude=Schedule:actor")
      .then((response: Response) => response.clone().json())
      .then((data) => setBundle(data));
  }

  useEffect(() => {
    practitionerSet();
  }, [bundle]);

  useEffect(() => {
    scheduleSet();
  }, [practMap])

  function practitionerSet() {
    let practResources: Resource[];
    if (!bundle) {
      practResources = [];
    } else {
      practResources = bundle
        .entry!.map((value) => value.resource as Resource)
        .filter((value) => value.resourceType === "Practitioner");
      let records = [
        {
          label:
            (practResources[0] as Practitioner).name![0].given![0] +
            " " +
            (practResources[0] as Practitioner).name![0].family,
          value: (practResources[0] as Practitioner).id,
        },
      ];
      let map = new Map<string | undefined, Practitioner>();
      practResources?.forEach((val, ind) => {
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
      scheduleSet();
    }
  }

  function generateSchedule() {
    modalOpen("G");
  }

  function scheduleSet() {
    if (bundle) {
      let schedResources = bundle.entry!.filter((value) => value.resource?.resourceType === "Schedule").map((value) => value.resource as Schedule);
      let scheduleArray = schedResources.map((value) => value as Schedule);
      setSchedules(scheduleArray);
      eventSet();
    }
  }

  function eventSet() {
    let eventSource: EventSourceInput[] = EventSourceCreator(schedules, practMap);
    setEvents(eventSource);
  }

  function dateSelect(info: any) {
    setSelectionInfo(info);
    setCalApi(info.view.calendar);
    modalOpen("A");
  }

  function requestStatus(value: any) {
    setRequestDecision(value);
  }

  function handlePick(info: string) {
    setShiftDetails({ id: info });
  }

  function handleChange(value: any) {
    setShiftDetails(value);
  }

  function handleGenerateForm(value: any) {
    setGenerateDetails(value);
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

  const deleteEvent = (item: any) => {
    DeleteSchedule(item as Schedule).then(() => queryFunct());
  };

  const editEvent = (item: any) => {
    currEvent?.setProp(
      "title",
      practMap?.get(shiftDetails.id)?.name![0].given![0] +
      " " +
      practMap?.get(shiftDetails.id)?.name![0].family
    );
    currEvent?.setExtendedProp("description", shiftDetails.id);
    EditSchedule((item as Schedule), shiftDetails.id).then(() => queryFunct());
  };

  const sendRequestDecision = (item: any) => {
    RequestSender((item as Schedule), requestDecision.decision).then(() => queryFunct());
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (clickInfo.event.extendedProps.type === "request") { modalOpen("R"); }
    else { modalOpen("DE"); }
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
    } else if (modalVal === "DE" && active === "delete") {
      let scheduleItem = schedules?.find((val) => val.id === currEvent?.id);
      deleteEvent(scheduleItem);
    } else if (modalVal === "DE" && active === "edit") {
      let scheduleItem = schedules?.find((val) => val.id === currEvent?.id);
      editEvent(scheduleItem);
    } else if (modalVal === "G") {
      generateSlots();
    } else if (modalVal === "R") {
      let scheduleItem = schedules?.find((val) => val.id === currEvent?.id);
      sendRequestDecision(scheduleItem);
    }
    modalClose();
  };

  const addEvent = () => {
    AddSchedule(shiftDetails.id, selectionInfo?.startStr, selectionInfo?.endStr).then(() => queryFunct());
    calendarApi?.unselect();
  };

  const generateSlots = () => {
    let requests = schedules?.filter((val) => val?.identifier![0].type?.text?.startsWith("approve") 
    && moment(val?.planningHorizon?.end).isSameOrAfter(Date.now()));
    GenerateSchedule(generateDetails, requests, practMap).then(() => queryFunct());
  }

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
        <Whisper placement="left" trigger="hover" speaker={speaker}>
          <Button>Help</Button>
        </Whisper>
        <Button color="green" onClick={generateSchedule}>
          Generate Schedule
        </Button>
      </FlexboxGrid>
      <>
        <div>
          <div className="card">
            <FullCalendar
              eventSources={events}
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
            {modalVal === "G" && (
              <>
                <Form fluid onChange={handleGenerateForm} formValue={generateDetails}>
                  <FormGroup>
                    <ControlLabel>Select Dates: {moment(generateDetails.dates[0]).format('MMMM Do YYYY')} {" - "} 
                    {moment(generateDetails.dates[1]).format('MMMM Do YYYY')}</ControlLabel>
                    <FormControl
                      name="dates"
                      accepter={DateRangePicker}
                      disabledDate={combine(allowedMaxDays(30), beforeToday())}
                    ></FormControl>
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Number of Employees per Shift</ControlLabel>
                    <FormControl name="numSlots" accepter={InputNumber}></FormControl>
                  </FormGroup>
                </Form>
              </>
            )}
            {modalVal === "R" && (
              <>
                <Form fluid onChange={requestStatus} formValue={requestDecision}>
                  <ControlLabel>
                    Are you sure you want to {requestDecision.decision} the level {schedules?.find((val) => val.id === currEvent?.id)?.identifier![0]?.type?.text?.substr(-1)} 
                    {" "}request for {currEvent?.title} on {moment(currEvent?.startStr).format('MMMM Do YYYY, h:mm:ss a')} {" "}
                    to {moment(currEvent?.endStr).format('MMMM Do YYYY, h:mm:ss a')}{"?"}
                  </ControlLabel>
                  <FormGroup>
                    <FormControl name="decision" accepter={RadioGroup}>
                      <Radio value="approve">Approve</Radio>
                      <Radio value="reject">Reject</Radio>
                    </FormControl>
                  </FormGroup>
                </Form>
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
