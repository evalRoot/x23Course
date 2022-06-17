import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { Container } from '@mui/system'
import { Box, Button, FilledInput, InputLabel, MenuItem, Modal, OutlinedInput, Select, TextField } from '@mui/material'
import moment from 'moment'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import "moment/locale/ru";
import request from '../helpers/request'

moment.locale("ru");

const educationForm = {
    0 : 'Онлайн',
    1: 'Оффлайн'
}

const educationFormToValue = {
  'Онлайн' : 0,
  'Оффлайн': 1
}


const educationType = {
  0 : 'Функциональные программы',
  1 : 'Развитие профессиональных навыков',
  2 : 'Развитие управленческих навыков',
  3 : 'Другие Soft Skills',
  4 : '*Прочее'
}

const educationTypeToValue = {
  'Функциональные программы' : 0,
  'Развитие профессиональных навыков' : 1,
  'Развитие управленческих навыков' : 2,
  'Другие Soft Skills' : 3,
  '*Прочее': 4
}

const projects = {
  0 : 'Индивидуальная потребность дирекции',
  1 : 'Мероприятия для ТОП-команды',
  2 : 'Особая СРЕДА, Потребность дирекции',
  3 : 'Адаптация',
  4 : 'Управленческая программа для СЕО-3'
}

const projectsToValue = {
  'Индивидуальная потребность дирекции': 0,
  'Мероприятия для ТОП-команды': 1,
  'Особая СРЕДА, Потребность дирекции': 2,
  'Адаптация': 3,
  'Управленческая программа для СЕО-3': 4
}


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
      educationFormValue: 0,
      educationTypeValue: 0,
      projectValue: 0,
      vacancies: '',
      place: ''
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
      description: '',
      currentDateStart: moment().format('YYYY-MM-DD HH:mm'),
      currentDateEnd:  moment().format('YYYY-MM-DD HH:mm'),
      editEvent: false,
      educationFormValue: 0,
      educationType: 0,
      projectValue: 0,
      vacancies: Number(0)
    })
  }

  onEventAdd = () => {
    this.showModal()
    this.setState({
      currentDateStart: moment().format('YYYY-MM-DD HH:mm'),
      currentDateEnd: moment().add(1, 'hours').format('YYYY-MM-DD HH:mm')
    })
  }

  onEventUpdate = async (evt) => {
    evt.preventDefault()
    try {
      const {
        eventName,
        educationFormValue,
        educationTypeValue,
        description,
        projectValue,
        vacancies,
        currentEvent,
        currentDateStart,
        currentDateEnd,
        place
      } = this.state
      const startDate = new Date(currentDateStart)
      const endDate = new Date(currentDateEnd)
      let requestData = {}
      let response = {}

      if (!isNaN(startDate.valueOf()) && !isNaN(endDate.valueOf())) {
        requestData = {
          title: eventName,
          description: description,
          start: startDate,
          end: endDate,
          educationForm: educationForm[educationFormValue],
          educationType: educationType[educationTypeValue],
          projects: projects[projectValue],
          vacancies: Number(vacancies),
          place
        }
  
        if (this.state.editEvent) {
          currentEvent.setProp('title', this.state.eventName)
          currentEvent.setStart(startDate)
          currentEvent.setEnd(endDate)
          currentEvent.setExtendedProp('description', description)
          currentEvent.setExtendedProp('educationForm', educationForm)
          currentEvent.setExtendedProp('educationType', educationType)
          currentEvent.setExtendedProp('projects', projects)
          currentEvent.setExtendedProp('vacancies', vacancies)

          response = await request('editEvent', 'POST', {
            ...requestData,
            eventId: Number(currentEvent._def.publicId)
          })

        } else {    
          response = await request('addEvent', 'POST', requestData)
          this.props.loadEvents()
        }
  
        alert(response.message)
        this.closeModal()
      } else {
        alert('Дата невалидна');
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  onEventClick = (info) => {
    this.setState({
      eventName: info.event.title,
      description: info.event.extendedProps.description,
      currentDateStart: info.event.start,
      currentDateEnd: info.event.end,
      editEvent: true,
      currentEvent: info.event,
      educationFormValue: educationFormToValue[info.event.extendedProps.educationForm],
      educationType: educationTypeToValue[info.event.extendedProps.educationType],
      projects: projectsToValue[info.event.extendedProps.projects],
      vacancies: Number(info.event.extendedProps.vacancies),
      place: info.event.extendedProps.place
    })
    this.showModal()
  }

  onEventRemove = async () => {
    try {
      const response = await request('deleteEvent', 'POST', {
        eventId: Number(this.state.currentEvent._def.publicId)
      })
      alert(response.message)
      this.state.currentEvent.remove()
      this.setState({
        currentEvent: ''
      })
      this.closeModal()
    } catch(error) {
      console.log(error.message)
      this.closeModal()
    }
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
        <Button onClick={this.onEventAdd} style={{
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
        <Modal
        closeAfterTransition
        open={modalShow}
        onClose={this.closeModal}
        >
          <Box component="form" onSubmit={this.onEventUpdate} style={{ ...style }}>
            <h2 id="child-modal-title">{`${editEvent ? 'Изменить Мероприятие' : 'Добавить Мероприятие'}`}</h2>
            <div style={{marginTop: 30, marginBottom: 10, display: 'flex', alignItems: 'center'}}>
              <LocalizationProvider adapterLocale='ru' dateAdapter={AdapterMoment}>
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
              <LocalizationProvider adapterLocale='ru' dateAdapter={AdapterMoment}>
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
                  minDateTime={moment(this.state.currentDateStart).add(1, 'minutes')}
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
            { this.state.educationFormValue === 1 && 
              <TextField
                margin="normal"
                required
                onChange={(evt) => {
                  this.setState({
                    place: evt.target.value
                  })
                }}
                value={this.state.place}
                fullWidth
                id="place"
                label="Место проведения"
                name="place"
                autoFocus
              />
            }
            <InputLabel style={{ marginTop: 16, marginBottom: 5 }}>
              Свободных мест
            </InputLabel>
            <FilledInput 
              style={{ width: 280 }}
              value={this.state.vacancies}
              disabled={this.state.educationFormValue === 0}
              placeholder={`${this.state.educationFormValue === 0 ? 'Количество мест не ограничено' : 'Введите число мест'}`}
              onChange={(evt) => this.setState({ vacancies: evt.target.value })} 
              type='number' />
            <InputLabel style={{ marginTop: 16, marginBottom: 5 }}>Вид обучения</InputLabel>
            <Select
              displayEmpty
              value={this.state.educationTypeValue}
              input={<OutlinedInput />}
              onChange={(evt) => {
                this.setState({
                  educationTypeValue: evt.target.value
                })
              }}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {Object.values(educationType).map((el, index) => (
                <MenuItem value={index}>
                  {el}
                </MenuItem>
              ))}
            </Select>
            <InputLabel style={{ marginTop: 16, marginBottom: 5 }}>Проекты</InputLabel>
            <Select
              displayEmpty
              value={this.state.projectValue}
              onChange={(evt) => {
                this.setState({
                  projectValue: evt.target.value
                })
              }}
              input={<OutlinedInput />}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {Object.values(projects).map((el, index) => (
                <MenuItem value={index}>
                  {el}
                </MenuItem>
              ))}
            </Select>
            <TextField
              margin="normal"
              required
              onChange={(evt) => {
                this.setState({
                  description: evt.target.value
                })
              }}
              value={this.state.description}
              fullWidth
              multiline
              rows={2}
              id="desription"
              label="Описание"
              name="description"
              autoFocus
            />
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
