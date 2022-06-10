import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { Container } from '@mui/system'
import { Box, Button, Modal, TextField } from '@mui/material'
import moment from 'moment'
const ruLocale = {
  code: "ru",
  buttonText: {
    today: "Сегодня",
  },
  noEventsText: "No hay eventos para mostrar",
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 400,
  backgroundColor: '#fff',
  border: '2px solid #000',
  boxShadow: 24,
  padding: 15
};

export default class CalendarView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalShow: false,
      eventName: '',
      currentDate: moment().format('YYYY-MM-DDTHH:mm'),
      editEvent: false,
      currentEvent: ''
    }
  }

  showModal = () => {
    this.setState({
      modalShow: true
    })
  }

  closeModal = () => {
    this.setState({
      modalShow: false,
      eventName: '',
      currentDate: moment().format('YYYY-MM-DDTHH:mm'),
      editEvent: false
    })
  }

  onEventAdded = (evt) => {
    evt.preventDefault()
    const api = this.calendar.getApi();
    const date = new Date(this.dateInput.value)
    if (!isNaN(date.valueOf())) {
      api.addEvent({
        title: this.state.eventName,
        start: date,
        allDay: false,
        editable: true
      });
      this.closeModal()
    } else {
      alert('Дата невалидна');
    }
  }

  onEventEdit = (evt) => {
    evt.preventDefault()
    const date = new Date(this.dateInput.value)
    if (!isNaN(date.valueOf())) {
      this.state.currentEvent.setProp('title', this.state.eventName)
      this.state.currentEvent.setDates(date)
      this.closeModal()
      this.setState({
        currentEvent: ''
      })
    } else {
      alert('Дата невалидна');
    }
  }


  onEventClick = (info) => {
    this.setState({
      eventName: info.event.title,
      currentDate: moment(info.event.start).format('YYYY-MM-DDTHH:mm'),
      editEvent: true,
      currentEvent: info.event
    })
    this.showModal()
  }

  
  onEventRemove = () => {
    this.state.currentEvent.remove()
    this.closeModal()
    this.setState({
      currentEvent: ''
    })
  }

  onEventsSave = () => {
    const api = this.calendar.getApi();
    localStorage.setItem('events', JSON.stringify(api.getEvents())) 
  }


  render () {
    const {
      modalShow,
      eventName,
      currentDate,
      editEvent
    } = this.state
    const minDate = moment().format('YYYY-MM-DDTHH:mm')
    return (
      <Container>
        <Button onClick={this.showModal} style={{
          marginBottom: 15
        }}>
          Добавить Мероприятие
        </Button>
        <FullCalendar
          ref={node => this.calendar = node}
          locale='ru'
          locales={[ruLocale]}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }}
          eventClick={this.onEventClick}
          plugins={[ dayGridPlugin ]}
          events={this.props.events || []}
          initialView="dayGridMonth"
        />
        <Button onClick={this.onEventsSave} style={{marginTop: 10}} variant="contained" color="primary">
          Сохранить
        </Button>
      <Modal
        closeAfterTransition
        open={modalShow}
        onClose={this.closeModal}
        >
          <Box component="form" onSubmit={editEvent ? this.onEventEdit : this.onEventAdded} style={{ ...style }}>
            <h2 id="child-modal-title">Добавить Мероприятие</h2>
            <label>
              <p style={{marginTop: 10, marginBottom: 10}}>
                Выбрать Дату
              </p>
              <input ref={node => this.dateInput = node} type='datetime-local' min={minDate} defaultValue={currentDate} />
            </label>

            <TextField
              margin="normal"
              multiline
              rows={6}
              onChange={(evt) => {
                this.setState({
                  eventName: evt.target.value
                })
              }}
              value={eventName}
              required
              fullWidth
              id="name"
              label="Название"
              name="name"
              autoFocus
            />

            <div style={{ display: 'flex' }}>
              <Button style={{marginTop: 10, marginRight: 10}}  onClick={this.closeModal}>Закрыть</Button>
              <Button variant='contained' type='submit' style={{marginTop: 10, marginRight: 10}}>{`${editEvent ? 'Изменить' : 'Добавить'}`}</Button>
              {editEvent &&
                <Button size="small" onClick={this.onEventRemove} style={{marginTop: 10}} variant="contained" color="error">
                  Удалить
                </Button>
              }
            </div>
          </Box>
        </Modal>
      </Container>
    )
  }
}
