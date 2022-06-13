import { 
  Card,
  Container, 
  Typography
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import request from '../helpers/request';

function EventsView() {
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

  return(
    <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
            Мероприятия
        </Typography>
        {events.map(event => (
          <Card>
            {event.title}
          </Card>
        ))}
    </Container>
  )
}

export default EventsView