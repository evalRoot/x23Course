
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import CalendarView from "../components/CalendarView";
import request from "../helpers/request";

export default observer(function Dashboard() {
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