import {getDate} from 'date-fns';
import React, { useState } from "react";
import "./Schedule.css";
import logo from "./assets/logo-qs.png";
import { Badge, Calendar, Dropdown, Icon, Nav, Popover, Whisper } from "rsuite";
import { AppHeader } from '@commure/components-core';
function getTodoList(date: any) {
    const day = getDate(date);
  switch (day) {
    case 10:
      return [
        { time: "10:30 am", title: "Meeting" },
        { time: "12:00 pm", title: "Lunch" },
      ];
    case 15:
      return [
        { time: "09:30 pm", title: "Products Introduction Meeting" },
        { time: "12:30 pm", title: "Client entertaining" },
        { time: "02:00 pm", title: "Product design discussion" },
        { time: "05:00 pm", title: "Product test and acceptance" },
        { time: "06:30 pm", title: "Reporting" },
        { time: "10:00 pm", title: "Going home to walk the dog" },
      ];
    default:
      return [];
  }
}

function renderCell(date: any) {
  const list = getTodoList(date);
  const displayList = list.filter((item, index) => index < 2);

  if (list.length) {
    const moreCount = list.length - displayList.length;
    const moreItem = (
      <li>
        <Whisper
          placement="top"
          trigger="click"
          speaker={
            <Popover>
              {list.map((item, index) => (
                <p key={index}>
                  <b>{item.time}</b> - {item.title}
                </p>
              ))}
            </Popover>
          }
        >
          <a>{moreCount} more</a>
        </Whisper>
      </li>
    );

    return (
      <ul>
        {displayList.map((item, index) => (
          <li key={index}>
            <Badge /> <b>{item.time}</b> - {item.title}
          </li>
        ))}
        {moreCount ? moreItem : null}
      </ul>
    );
  }

  return null;
}

function Schedule() {
  const [isOpen, setOpen] = useState(false);
  const toggleCollapse = () => {
    setOpen(!isOpen);
  };
  return <><AppHeader showFullUserName={true} logo={<Nav>
    <img src={logo} alt="Quick Shift Logo" width="40" height="40" />
    <Nav.Item href='/'>
      <h6>Quick Shift</h6>
    </Nav.Item>
    <Nav.Item href='/home' icon={<Icon icon="home" />}>Home</Nav.Item>
    <Nav.Item href='/schedule' active={true}>Schedule</Nav.Item>
    <Nav.Item href='/employee'>Employees</Nav.Item>
    <Nav.Item href='/skills'>Skills</Nav.Item>
    <Nav.Item href='/adjustments'>Adjustments</Nav.Item>
    <Dropdown title="About">
      <Dropdown.Item>Company</Dropdown.Item>
      <Dropdown.Item>Team</Dropdown.Item>
      <Dropdown.Item>Contact</Dropdown.Item>
    </Dropdown>
  </Nav>}/><Calendar bordered renderCell={renderCell} /></>;
}

export default Schedule;
