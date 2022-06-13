
import { Container, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useContext, useEffect, useState } from "react";
import { Context } from "..";
import CalendarView from "../components/CalendarView";
import request from "../helpers/request";

export default observer(function Dashboard() {
  const {user} = useContext(Context)
  const [events, setEvents] = useState([])

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async (onUpdate = false) => {
    if (onUpdate) {
      setEvents([])
    }
    const response = await request('events', "GET")
    setEvents(response.events)
  }

  return (
    <CalendarView loadEvents={() => loadEvents(true)} events={events}/>
  )
})