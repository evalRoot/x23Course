import { Box, Container, Typography, Card, Button } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Context } from ".."
import request from "../helpers/request"
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import moment from "moment"

const online = 'Онлайн'

function EventDetail() {
  const {id} = useParams()
  const [event, setEvent] = useState([])
  const {user} = useContext(Context)

  useEffect(() => {
    (async () => {
      const response = await request('event', 'POST', { id })
      setEvent(response.event)
    })()
  }, [])

  const assign = async () => {
    try {
      const response = await request('assignEvent', 'POST', {
        eventId: id,
        userId: user.getUser.id
      })

      alert(response.message)
    } catch (error) {
      console.log(error.message)
    }
  }

  return(
    <Container>
       <Typography style={{ display: 'flex', alignItems: 'center' }} variant="h4" sx={{ mb: 5 }}>
          Мероприятие
          <EventAvailableIcon style={{ marginLeft: 15 }}/>
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Card style={{ padding: 10 }}>
          <ul style={{ padding: 20 }}>
            <li>
              <strong>Название:</strong> {event.title}
            </li>
            <li>
              <strong>Дата Начала:</strong> {moment(event.start).format('DD.MM.YYYY HH:mm:ss')}
            </li>
            <li>
              <strong>Дата Завершения:</strong> {moment(event.end).format('DD.MM.YYYY HH:mm:ss')}
            </li>
            <li>
              <strong>Описание:</strong> {event.description}
            </li>
            <li>
              <strong>Формат обучения:</strong> {event.educationForm}
            </li>
            <li>
              <strong>Вид обучения:</strong> {event.educationType}
            </li>
            <li>
              <strong>Проекты:</strong> {event.projects}
            </li>
            <li>
              <strong>Местро проведения:</strong> {event.place}
            </li>
            <li>
              {event.educationForm === online ? (<span><strong>Свободных мест:</strong> Мест не ограничено </span>) : (
                <span><strong>Свободных мест:</strong> {event.freeVacancies} из {event.vacancies} </span>
              )}
            </li>
          </ul>
        </Card>
        <Button style={{ marginTop: 15 }} variant="contained" onClick={assign}> Записаться на курс </Button>
      </Box>
    </Container>
  )
}

export default EventDetail