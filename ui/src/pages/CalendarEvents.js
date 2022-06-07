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
  width: 400,
  backgroundColor: '#fff',
  border: '2px solid #000',
  boxShadow: 24,
  padding: 15
};

export default class CalendarEvents extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalShow: false,
      eventName: '',
    }
  }

  showModal = () => {
    this.setState({
      modalShow: true
    })
  }

  closeModal = () => {
    this.setState({
      modalShow: false
    })
  }

  onEventAdded = (evt) => {
    evt.preventDefault()
    const api = this.calendar.getApi();
    const date = new Date(this.dateInput.value + 'T00:00:00')
    if (!isNaN(date.valueOf())) {
      api.addEvent({
        title: this.state.eventName,
        start: date,
        allDay: true
      });
      this.closeModal()
    } else {
      alert('Дата невалидна');
    }
  };

  render () {
    const {
      modalShow
    } = this.state

    const minDate = moment().format('YYYY-MM-DD')

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
          plugins={[ dayGridPlugin ]}
          initialView="dayGridMonth"
        />
      <Modal
        closeAfterTransition
        open={modalShow}
        onClose={this.closeModal}
        >
          <Box component="form" onSubmit={this.onEventAdded} style={{ ...style }}>
            <h2 id="child-modal-title">Добавить Мероприятие</h2>
            <label>
              <p style={{marginTop: 10, marginBottom: 10}}>
                Выбрать Дату
              </p>
              <input ref={node => this.dateInput = node} type='date' min={minDate} defaultValue={minDate} />
            </label>

            <TextField
              margin="normal"
              onChange={(evt) => {
                this.setState({
                  eventName: evt.target.value
                })
              }}
              required
              fullWidth
              id="name"
              label="Название"
              name="name"
              autoFocus
            />

            <div style={{ display: 'flex' }}>
              <Button style={{marginTop: 10, marginRight: 10}}  onClick={this.closeModal}>Закрыть</Button>
              <Button variant='contained' type='submit' style={{marginTop: 10}}>Добавить</Button>
            </div>
          </Box>
        </Modal>
      </Container>
    )
  }
}
