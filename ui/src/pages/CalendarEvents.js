
import { Container, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useContext, useEffect, useState } from "react";
import { Context } from "..";
import CalendarView from "../components/CalendarView";

export default observer(function Dashboard() {
  const {user} = useContext(Context)
  const [events, setEvents] = useState([])

  useEffect(() => {
    const events = localStorage.getItem('events') || []
    let parseE = []
    if (events.length === 0) {
      setEvents([])
    } else {
      parseE = JSON.parse(events)
      setEvents(parseE)
    }
  }, [])

  return (
    <CalendarView events={events}/>
  )
})