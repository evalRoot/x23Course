import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { Container } from '@mui/system'
import { Box, Button, FilledInput, Input, InputBase, InputLabel, MenuItem, Modal, OutlinedInput, Select, TextField } from '@mui/material'
import moment from 'moment'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import "moment/locale/ru";

moment.locale("ru");

const educationForm = [
  {
    0 : 'Онлайн',
    1: 'Оффлайн'
  }
]

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
  height: 650,
  overflowY: 'auto',
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
      currentDateStart: moment().format('YYYY-MM-DD HH:mm'),
      currentDateEnd: moment().format('YYYY-MM-DD HH:mm'),
      editEvent: false,
      currentEvent: '',
      onErrorDatePicker: '',
      educationFormValue: 0
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
      currentDateStart: moment().format('YYYY-MM-DD HH:mm'),
      currentDateEnd:  moment().format('YYYY-MM-DD HH:mm'),
      editEvent: false
    })
  }

  onEventAdded = (evt) => {
    evt.preventDefault()
    const api = this.calendar.getApi();
    const startDate = new Date(this.state.currentDateStart)
    const endDate = new Date(this.state.currentDateEnd)
    if (!isNaN(startDate.valueOf()) && !isNaN(endDate.valueOf())) {
      api.addEvent({
        title: this.state.eventName,
        start: startDate,
        end: endDate,
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
    const date = new Date(this.state.currentDateStart)
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
      currentDateStart: moment(info.event.start).format('YYYY-MM-DD HH:mm'),
      currentDateEnd: moment(info.event.end).format('YYYY-MM-DD HH:mm'),
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
      currentDateStart,
      currentDateEnd,
      editEvent
    } = this.state
    const minDate = moment().format('YYYY-MM-DD HH:mm')
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
            <h2 id="child-modal-title">{`${editEvent ? 'Изменить Мероприятие' : 'Добавить Мероприятие'}`}</h2>
            <div style={{marginTop: 30, marginBottom: 10, display: 'flex', alignItems: 'center'}}>
              <LocalizationProvider locale='ru' dateAdapter={AdapterMoment}>
                <DateTimePicker
                  onError={(reason, value) => {
                    this.setState({
                      onErrorDatePicker: ''
                    })

                    if (reason === 'minTime' || reason === 'minDate') {
                      this.setState({
                        onErrorDatePicker: `Минимальная дата ${minDate}`
                      })
                    }

                    if (reason === 'invalidDate') {
                      this.setState({
                        onErrorDatePicker: `Неверный формат для даты`
                      })
                    }
                  }}
                  minDateTime={moment(minDate)}
                  renderInput={(props) => <TextField {
                    ...props
                  } inputProps = {{...props.inputProps, placeholder: 'дд.мм.гггг чч:мм'}} />}
                  label="Выбрать Дату Начала"
                  value={currentDateStart}
                  onChange={(newValue) => {
                    this.setState({
                      currentDateStart: moment(newValue).format('YYYY-MM-DD HH:mm')
                    })
                  }}
                />
              </LocalizationProvider>
              <span style={{display: 'inline-block', marginLeft: 10, marginRight: 10}}>-</span>
              <LocalizationProvider locale='ru' dateAdapter={AdapterMoment}>
                <DateTimePicker
                  onError={(reason, value) => {
                    this.setState({
                      onErrorDatePicker: ''
                    })

                    if (reason === 'minTime' || reason === 'minDate') {
                      this.setState({
                        onErrorDatePicker: `Минимальная дата ${this.state.currentDateStart}`
                      })
                    }

                    if (reason === 'invalidDate') {
                      this.setState({
                        onErrorDatePicker: `Неверный формат для даты`
                      })
                    }
                  }}
                  minDateTime={moment(this.state.currentDateStart)}
                  renderInput={(props) => <TextField {
                    ...props
                  } inputProps = {{...props.inputProps, placeholder: 'дд.мм.гггг чч:мм'}} />}
                  label="Выбрать Дату Завершения"
                  value={currentDateEnd}
                  onChange={(newValue) => {
                    this.setState({
                      currentDateEnd: moment(newValue).format('YYYY-MM-DD HH:mm')
                    })
                  }}
                />
              </LocalizationProvider>
            </div>
            <p style={{color: '#FF4842'}}>{this.state.onErrorDatePicker}</p>
            <TextField
              margin="normal"
              onChange={(evt) => {
                this.setState({
                  eventName: evt.target.value
                })
              }}
              value={eventName}
              required
              fullWidth
              id="name"
              label="Тема"
              name="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={2}
              id="desription"
              label="Описание"
              name="description"
              autoFocus
            />

            <InputLabel style={{ marginTop: 16, marginBottom: 5 }}>
              Свободных мест
            </InputLabel>
            <FilledInput type='number'></FilledInput>
            <InputLabel style={{ marginTop: 16, marginBottom: 5 }}>Формат обучения</InputLabel>
            <Select
              displayEmpty
              input={<OutlinedInput />}
              value={this.state.educationFormValue}
              onChange={(evt) => {
                this.setState({
                  educationFormValue: evt.target.value
                })
              }}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {Object.values(educationForm).map((el, index) => (
                <MenuItem value={index}>
                  {el}
                </MenuItem>
              ))}
            </Select>
            <InputLabel style={{ marginTop: 16, marginBottom: 5 }}>Вид обучения</InputLabel>
            <Select
              displayEmpty
              input={<OutlinedInput />}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem>
                Функциональные программы
              </MenuItem>
              <MenuItem>
                Развитие профессиональных навыков 
              </MenuItem>
              <MenuItem>
                Развитие управленческих навыков
              </MenuItem>
              <MenuItem>
                Другие Soft Skills
              </MenuItem>
              <MenuItem>
                *Прочее
              </MenuItem>
            </Select>
            <InputLabel style={{ marginTop: 16, marginBottom: 5 }}>Проекты</InputLabel>
            <Select
              displayEmpty
              input={<OutlinedInput />}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem>
                Индивидуальная потребность дирекции
              </MenuItem>
              <MenuItem>
                Мероприятия для ТОП-команды 
              </MenuItem>
              <MenuItem>
                Особая СРЕДА, Потребность дирекции
              </MenuItem>
              <MenuItem>
                Адаптация
              </MenuItem>
              <MenuItem>
                Управленческая программа для СЕО-3
              </MenuItem>
            </Select>
            <div style={{ display: 'flex', marginTop: 16 }}>
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
