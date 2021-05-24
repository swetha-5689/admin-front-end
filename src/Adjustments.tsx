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
  Drawer,
  Nav,
  SelectPicker,
  Radio,
  RadioGroup,
  Popover,
  Whisper,
  InputGroup,
  DatePicker,
  IconButton,
  CheckTreePicker,
  CheckTreePickerProps,
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
import moment from "moment";
import RequestSender from "./RequestSender";
import EventSourceCreator from "./EventSourceCreator";
import { TypeAttributes } from "rsuite/lib/@types/common";
import filterConfig from "./filterConfig";
const { allowedMaxDays, beforeToday, combine } = DateRangePicker;

const EventsCalendar = (props: FhirDataQueryConsumer) => {
  const [isOpen, setOpen] = useState(false);
  const [drawerDirection, setDrawerDirection] = useState<
    TypeAttributes.Placement4 | undefined
  >(undefined);
  const [drawerVal, setdrawerVal] = useState("A");
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
  const [generateDetails, setGenerateDetails] = useState({
    dates: [new Date(), new Date()],
    numSlots: 0,
  });
  const { query } = props;
  const [bundle, setBundle] = useState<Bundle | undefined>(undefined);
  const [events, setEvents] = useState<EventSourceInput[] | undefined>(
    undefined
  );
  const [eventShow, setEventShow] = useState<EventSourceInput[] | undefined>(
    undefined
  );
  const [requestDecision, setRequestDecision] = useState({
    decision: "approve",
  });
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
  }, [practMap]);

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
      console.log(practResources);
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
    drawerOpen("G");
  }

  function scheduleSet() {
    if (bundle) {
      let schedResources = bundle
        .entry!.filter((value) => value.resource?.resourceType === "Schedule")
        .map((value) => value.resource as Schedule);
      let scheduleArray = schedResources.map((value) => value as Schedule);
      setSchedules(scheduleArray);
      eventSet();
    }
  }

  function eventSet() {
    let eventSource: EventSourceInput[] = EventSourceCreator(
      schedules,
      practMap
    );
    setEvents(eventSource);
    setEventShow(eventSource);
  }

  function dateSelect(info: any) {
    setSelectionInfo(info);
    setCalApi(info.view.calendar);
    drawerOpen("A");
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

  const drawerOpen = (val: string) => {
    practitionerSet();
    setdrawerVal(val);
    if (val === "A" || val === "DE" || val === "R") setDrawerDirection("left");
    else if (val === "G") setDrawerDirection("right");
    setOpen(true);
  };

  const clearValues = () => {
    setShiftDetails({ id: "" });
  };

  const DrawerClose = () => {
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
    EditSchedule(item as Schedule, shiftDetails.id).then(() => queryFunct());
  };

  const sendRequestDecision = (item: any) => {
    RequestSender(item as Schedule, requestDecision.decision).then(() =>
      queryFunct()
    );
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (clickInfo.event.extendedProps.type === "request") {
      drawerOpen("R");
    } else {
      drawerOpen("DE");
    }
    let details = {
      id: clickInfo.event.extendedProps.description,
    };
    setShiftDetails(details);
    setCalApi(clickInfo.view.calendar);
    setEvent(clickInfo.event);
  };

  const doAction = () => {
    if (drawerVal === "A") {
      addEvent();
    } else if (drawerVal === "DE" && active === "delete") {
      let scheduleItem = schedules?.find((val) => val.id === currEvent?.id);
      deleteEvent(scheduleItem);
    } else if (drawerVal === "DE" && active === "edit") {
      let scheduleItem = schedules?.find((val) => val.id === currEvent?.id);
      editEvent(scheduleItem);
    } else if (drawerVal === "G") {
      generateSlots();
    } else if (drawerVal === "R") {
      let scheduleItem = schedules?.find((val) => val.id === currEvent?.id);
      sendRequestDecision(scheduleItem);
    }
    DrawerClose();
  };

  const changeFilter = (val: any[]) => {
    let eventInput: EventSourceInput[] | undefined = [];
    val.forEach((x) => {
      if(x === "shifts") eventInput?.push(events![1], events![4]);
      if(x === "requests") eventInput?.push(events![2], events![3], events![0]);
      if(x === "slot") eventInput?.push(events![1]);
      if(x === "canceled") eventInput?.push(events![4]);
      if(x === "approve") eventInput?.push(events![2]);
      if(x === "reject") eventInput?.push(events![3]);
      if(x === "priority") eventInput?.push(events![0]);
    });
    setEventShow(eventInput);
  }

  const addEvent = () => {
    AddSchedule(
      shiftDetails.id,
      selectionInfo?.startStr,
      selectionInfo?.endStr
    ).then(() => queryFunct());
    calendarApi?.unselect();
  };

  const generateSlots = () => {
    let requests = schedules?.filter(
      (val) =>
        val?.identifier![0].type?.text?.startsWith("approve") &&
        moment(val?.planningHorizon?.end).isSameOrAfter(Date.now())
    );
    GenerateSchedule(generateDetails, requests, practMap).then(() =>
      queryFunct()
    );
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
      <CheckTreePicker placeholder="Filter" defaultExpandAll data={filterConfig} defaultValue={["shifts", "requests"]}
      onChange={changeFilter} style={{ width: 280 }} />
        <Whisper placement="left" trigger="hover" speaker={speaker}>
          <IconButton
            icon={
              <Icon className="fill-color" icon="question" />
            }
            placement='right'
          >Help</IconButton>
        </Whisper>
        <IconButton
            color="green"
            icon={
              <Icon className="fill-color" icon="play" />
            }
            placement='right'
            onClick={generateSchedule}
          >Generate Schedule</IconButton>
      </FlexboxGrid>
      <>
        <div>
          <div className="card">
            <FullCalendar
              eventSources={eventShow}
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

        <Drawer
          show={isOpen}
          size={"sm"}
          placement={drawerDirection}
          onHide={DrawerClose}
        >
          <Drawer.Header>
            <Drawer.Title>Change Calendar</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            {drawerVal === "A" && (
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
            {drawerVal === "DE" && active === "edit" && (
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
                    <strong>
                      Are you sure you want to change the scheduled employee for
                      the slot on{" "}
                      {moment(currEvent?.startStr).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}{" "}
                      to{" "}
                      {moment(currEvent?.endStr).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                      {"?"}
                    </strong>
                  </FormGroup>
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
            {drawerVal === "DE" && active === "delete" && (
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
            {drawerVal === "G" && (
              <>
                <Form
                  fluid
                  onChange={handleGenerateForm}
                  formValue={generateDetails}
                >
                  <FormGroup>
                    <ControlLabel>
                      Select Dates:{" "}
                      {moment(generateDetails.dates[0]).format("MMMM Do YYYY")}{" "}
                      {" - "}
                      {moment(generateDetails.dates[1]).format("MMMM Do YYYY")}
                    </ControlLabel>
                    <FormControl
                      name="dates"
                      accepter={DateRangePicker}
                      disabledDate={combine(allowedMaxDays(30), beforeToday())}
                    ></FormControl>
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Number of Employees per Shift</ControlLabel>
                    <FormControl
                      name="numSlots"
                      accepter={InputNumber}
                    ></FormControl>
                  </FormGroup>
                </Form>
              </>
            )}
            {drawerVal === "R" && (
              <>
                <Form
                  fluid
                  onChange={requestStatus}
                  formValue={requestDecision}
                >
                  <ControlLabel>
                    Are you sure you want to {requestDecision.decision} the
                    level{" "}
                    {schedules
                      ?.find((val) => val.id === currEvent?.id)
                      ?.identifier![0]?.type?.text?.substr(-1)}{" "}
                    request for {currEvent?.title} on{" "}
                    {moment(currEvent?.startStr).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}{" "}
                    to{" "}
                    {moment(currEvent?.endStr).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                    {"?"}
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
          </Drawer.Body>
          <Drawer.Footer>
            <Button onClick={doAction} appearance="primary">
              OK
            </Button>
            <Button onClick={DrawerClose} appearance="subtle">
              Cancel
            </Button>
          </Drawer.Footer>
        </Drawer>
      </>
    </>
  );
};

export default withFhirDataQuery(EventsCalendar);
