import { 
    Alert,
    Card,
    Container, 
    InputLabel, 
    MenuItem, 
    OutlinedInput, 
    Select, 
    Typography
  } from '@mui/material';
  import { useEffect, useState } from 'react'
  import request from '../helpers/request';
  import EventNoteIcon from '@mui/icons-material/EventNote';
  import moment from 'moment';
  import Pagination from '@mui/material/Pagination';
  import Stack from '@mui/material/Stack';
  import usePagination from '../components/Pagination';
  
  function EventsList(props) {
    const [events, setEvents] = useState([])
    const itemPerPage = 5
    let [page, setPage] = useState(1)
    let count = Math.ceil(events.length / itemPerPage)
    const dataEvents = usePagination(events, itemPerPage)
    const [usersLeaderMapped, setUsersLeaderMapped] = useState([])
    const [usersLeader, setUsersLeader] = useState([])
    const [userLeaderValue, setUserLeaderValue] = useState('')
  
    useEffect(() => {
      loadEvents()
    }, [])
  
    const loadEvents = async () => {
      let response = {}
      if (props.assign) {
        response = await request('assignEvents', 'POST', {
          id: props.userId
        })
      } else if (props.leaderAssign) {
        response = await request('leaderAssignEvents', 'POST', {
          id: props.userId
        })
      } else {
        response = await request('events', "GET")
      }

      if (props.leaderAssign) {
        const users = response.leaderUserEvents.map(event => event.user)
        if (users.length === 0) {
          return
        }

        setUsersLeader(response.leaderUserEvents)
        setUsersLeaderMapped(users)
        setUserLeaderValue(users[0].id)
        setEvents(response.leaderUserEvents[0].events)
      } else {
        setEvents(response.events.reverse())
      }
    }
  
    const handleChange = (e, p) => {
      setPage(p);
      dataEvents.jump(p);
    };
  
    const getStatus = (event) => {
      if (moment().unix() > moment(event.start).unix() && moment().unix() < moment(event.end).unix() ) {
        return (
          <Alert style={{ display: 'inline-flex', padding: '0 6px' }} variant="filled" severity="info">
            Проводится
          </Alert>
        )
      }
  
      if (moment(event.start).unix() > moment().unix()) {
        return (
          <Alert style={{ display: 'inline-flex', padding: '0 6px' }} variant="filled" severity="warning">
          Планируется
        </Alert>
        )
      }
  
      if (moment(event.start).unix() < moment().unix()) {
        return (
          <Alert style={{ display: 'inline-flex', padding: '0 6px' }} variant="filled" severity="success">
            Завершено
          </Alert>
        )
      }
    }
  
    return(
      <Container>
          {props.leaderAssign && usersLeaderMapped.length !== 0  &&
            <>
              <InputLabel>Сотрудник</InputLabel>
              <Select
                style={{margin: '15px 0'}}
                displayEmpty
                value={userLeaderValue}
                onChange={(evt) => {
                  setUserLeaderValue(evt.target.value)
                  const events = usersLeader.find(event => event.user.id === evt.target.value)
                  setEvents(events.events)
                }}
                input={<OutlinedInput />}
              >
                {usersLeaderMapped.map((user, index) => (
                  <MenuItem
                    key={index}
                    value={user.id}
                  >
                    {user.user}
                  </MenuItem>
                ))}
              </Select>
            </>
          }
          {dataEvents.currentData().map((event, index) => (
            <Card key={index} style={{width: 700, padding: 15, marginBottom: 20}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <EventNoteIcon />
                <div style={{ marginLeft: 15}}>
                  <a href={`meeting/${event.id}`}>
                    {event.title}
                  </a>
                  <div>
                    <strong>
                      {moment(event.start).format('DD.MM.YYYY HH:mm')}
                    </strong>
                    <span style={{ display: 'inline-block', margin: '0 5px'}}>-</span>
                    <strong>
                      {moment(event.end).format('DD.MM.YYYY HH:mm')}
                    </strong>
                  </div>
                </div>
                </div>
                <div style={{marginTop: 10}}>
                { getStatus(event) }
              </div>
            </Card>
          ))}

          {events.length === 0 &&
            <Typography style={{ display: 'flex', alignItems: 'center' }} variant="h6" sx={{ mb: 5 }}>
              Мероприятий пока нет
            </Typography>
          }
  
          <Stack spacing={2}>
            <Pagination 
              count={count}
              page={page}
              showFirstButton 
              showLastButton
              onChange={handleChange}
            />
          </Stack>
      </Container>
    )
  }
  
  export default EventsList