import React, { useState } from "react";
import "./Requests.css";
import logo from "./assets/logo-qs.png";
import { Button, Dropdown, Icon, Modal, Nav } from "rsuite";
import { AppHeader, FhirHumanName, ResourceListTable } from "@commure/components-core";
import "./ScheduleService.scss";
import { FhirDataQuery } from "@commure/components-data";
import { Bundle, Practitioner, Resource, Schedule } from "@commure/fhir-types/r4/types";
function Requests() {
  const [isOpen, setOpen] = useState(false);
  const [modalVal, setModalVal] = useState(false);
  const modalClose = () => {
    setOpen(false);
  };
  const modalOpen = () => {
    setOpen(true);
  }
  const setModal = (modal: boolean) => {
    setModalVal(modal);
  }
  const onApprove = () => {
    setModal(true);
    modalOpen();
  }
  const onReject = () => {
    setModal(false);
    modalOpen();
  }

  
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
            <Nav.Item href="/requests" active={true}>
              Requests
            </Nav.Item>
            <Nav.Item href="/employee">Employees</Nav.Item>
            <Nav.Item href="/skills">Skills</Nav.Item>
            <Nav.Item href="/adjustments">Adjustments</Nav.Item>
            <Dropdown title="About">
              <Dropdown.Item href="/company">Company</Dropdown.Item>
              <Dropdown.Item href="/team">Team</Dropdown.Item>
            </Dropdown>
          </Nav>
        }
      />
      <FhirDataQuery queryString="Practitioner?_has:Schedule:actor:active=true&_revinclude=Schedule:actor">
        {({ data, error, loading }) => {
          if (loading) {
            return "Loading...";
          }
          if (error) {
            return "Error loading data!";
          }
          let resources: Resource[];
          if ((data as Bundle).entry === undefined) resources = [];
          else {
            resources = (data as Bundle).entry!.map(
              (value) => value.resource as Resource
            );
          }
          let practMap = new Map();
          resources.forEach((val) =>{
            if (val.resourceType === 'Practitioner') {
              practMap.set('Practitioner/' + val.id, (val as Practitioner).name);
            }
          })
          let schedules = resources.filter((val) => {return val.resourceType != "Practitioner"})

          return (
            <ResourceListTable
              className="full-table"
              resources={schedules}
              headerToCellDisplay={{
                Practitioner: (_schedule: Schedule) => (
                  <><FhirHumanName value={practMap.get(_schedule.actor[0].reference)[0]}></FhirHumanName></>
                ),
                Status: "active",
                "Time Start": "planningHorizon.start",
                "Time End": "planningHorizon.end",
                Action: (_schedule: any) => (
                  <>
                    <Button onClick={onApprove} color="green">Approve</Button>
                    {"     "}
                    <Button onClick={onReject} color="red">Reject</Button>
                  </>
                ),
              }}
            />
          );
        }}
      </FhirDataQuery>
      <Modal show={isOpen} onHide={modalClose}>
        <Modal.Header>
          <Modal.Title>Confirm action</Modal.Title>
        </Modal.Header>
        {modalVal &&
        <Modal.Body>Are you sure you want to approve this request?</Modal.Body>}
        {!modalVal &&
        <Modal.Body>Are you sure you want to reject this request?</Modal.Body>
        }
        <Modal.Footer>
          <Button onClick={modalClose} appearance="primary">
            OK
          </Button>
          <Button onClick={modalClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Requests;
