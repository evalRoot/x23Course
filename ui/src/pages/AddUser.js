import styled from "@emotion/styled";
import { 
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  InputLabel,
  Select,
  OutlinedInput,
 } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import CheckboxList from "../components/Checkbox.List";
import RadioButtonsGroup from "../components/RadioBtnGroup";
import { LEADER_ROLE } from "../const";
import request from "../helpers/request";

const TextFieldStyled = styled((props) => <TextField {...props} />)(({ theme }) => ({
  marginBottom: 30
}))

export default function AddUser() {
  const [notify, notifySet] = useState({
      errorIsOpen: false,
      successIsOpen: false,
      errorText: '',
      successText: '',
  })

  const [isLeader, setIsLeader] = useState(false)

  const [users, setUsers] = useState([])

  const [checkedUsers, setCheckedUsers] = useState([])

  const [isSetLeader, setLeaderFlag] = useState(false)

  const [leaderId, setLeader] = useState(null)

  const [grades, setGrades] = useState([{id: -1}])

  const [grade, setGrade] = useState('')

  const handleChange = (evt) => {

    if (evt.target.value === grades[grades.length - 1].id) {
      setIsLeader(true)
    }
    
    if (isLeader && evt.target.value !== grades[grades.length - 1].id) {
      setIsLeader(false)
    }

    setGrade(evt.target.value)
  };

  const checkRelations = () => {
    if (users.length === 0) {
      return []
    }

    let current = {}
    let forFilter = []
    let leaders = users.filter(user => {
      return (user.role === LEADER_ROLE)
    })
    let result = {}

    for (let i = 0; i < checkedUsers.length; i++) {
      current = leaders.find(leader => leader.UserId === checkedUsers[i])
      while(current !== undefined) {
        forFilter.push(current.id)
        current = leaders.find(leader => leader.UserId === current.id)
      }
    }
    result = leaders.filter(leader => forFilter.indexOf(leader.id) === -1 && checkedUsers.indexOf(leader.id) === -1).map(leader => leader.id)
    return result || []
  }

  let leaders = users.filter(user => {
    return (user.role === LEADER_ROLE && checkRelations().indexOf(user.id) !== -1)
  })

  const getUsers = async () => {
    try {
      let response = await request('allUsers', 'GET', {})
      setUsers(response.users)
    } catch (error) {
      console.log(error)
    }
  }

  const getGrades = async () => {
    try {
      let response = await request('gradesList', 'GET', {})
      setGrades(response.grades)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const data = new FormData(evt.currentTarget)


      if (grade.length === 0) {
        notifySet({
          errorIsOpen: true,
          successIsOpen: false,
          errorText: '???? ?????????????? ??????????????????????',
          successText: '',
        })
        return
      }


      if (!isLeader && !leaderId) {
        notifySet({
          errorIsOpen: true,
          successIsOpen: false,
          errorText: '???????????????? ?????? ???????????????? ????????????????????????',
          successText: '',
        })
        return
      }

      let response = await request('registration', 'POST', {
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        middleName: data.get('middleName'),
        login: data.get('login'),
        password: data.get('password'),
        isLeader: isLeader,
        userIds: checkedUsers,
        leaderId,
        GradeId: grade
      })

      if (response.hasOwnProperty('error')) {
        notifySet({
          errorIsOpen: true,
          successIsOpen: false,
          errorText: response.error,
          successText: '',
        })
        return
      }
      
      notifySet({
        errorIsOpen: false,
        successIsOpen: true,
        errorText: '',
        successText: response.message,
      })
      evt.target.reset()
      setIsLeader(false)
      setLeaderFlag(false)
      setCheckedUsers([])
      getUsers()
      setGrade('')
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    getUsers()
    getGrades()
  }, [])

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        ???????????????? ????????????????????/????????????????????????
      </Typography>
        <Box onSubmit={handleSubmit} component="form">
          <TextFieldStyled
            autoComplete="fname"
            name="firstName"
            variant="outlined"
            required
            fullWidth
            id="firstName"
            label="??????"
            />
          <TextFieldStyled
            variant="outlined"
            required
            fullWidth
            id="lastName"
            label="??????????????"
            name="lastName"
            autoComplete="lname"
          />
          <TextFieldStyled
            variant="outlined"
            required
            fullWidth
            id="middleName"
            label="????????????????"
            name="middleName"
            autoComplete="lname"
          />
          <TextFieldStyled
            variant="outlined"
            required
            fullWidth
            id="login"
            label="??????????"
            name="login"
            autoComplete="username"
          />
          <TextFieldStyled
            variant="outlined"
            required
            fullWidth
            name="password"
            label="????????????"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <InputLabel>??????????????????????</InputLabel>
          <Select
            displayEmpty
            value={grade}
            onChange={handleChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>???? ??????????????</em>;
              }

              return grades.find(grade => grade.id === selected).name;
            }}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem disabled value="">
              <em>???? ??????????????</em>
            </MenuItem>
            {grades.map((grade, index) => (
              <MenuItem
                key={index}
                value={grade.id}
              >
                {grade.name}
              </MenuItem>
            ))}
          </Select>
          <Box>
            <FormControlLabel
              control={
              <Checkbox disabled={grade !== grades[grades.length - 1].id} onClick={() => setIsLeader(!isLeader)} checked={isLeader} color="primary" />
            }
              label="????????????????????????"
            />
            {isLeader && users.length !== 0 &&
              <CheckboxList 
                title={'?????????????????? ??????????????????????:'}
                getCheckedItems={(checked) => {
                  setCheckedUsers(checked)
                  if (checked.indexOf(leaderId) !== -1) {
                    setLeader(null)
                  }
                }}
                checkingBy='id'
                primaryText={(item) => `${item.lastName} ${item.firstName} ${item.middleName}`}
                items={users.slice().filter(user => user.UserId === null)} />
            }
            {isLeader && users.length === 0 &&
              <Typography variant="h6">
                ?????? ??????????????????????
              </Typography>
            }
          </Box>
          <Box>
            <FormControlLabel
              control={
              <Checkbox 
                onClick={() => {
                  setLeaderFlag(!isSetLeader)
                  if (isSetLeader) {
                    setLeader(null)
                  }
                }
              } 
              checked={isSetLeader}
              disabled={leaders.length === 0}
              color="primary" />
            }
              label="?????????????????? ????????????????????????"
            />
              {leaders.length === 0 &&
              <Typography variant="h6">
                ?????? ??????????????????????????
              </Typography>
            }
            {isSetLeader &&
              <RadioButtonsGroup
                getItem={(value) => setLeader(value)}
                title="????????????????????????:"
                items={leaders}
                setBy='id'
                labelText={(item) => `${item.lastName} ${item.firstName} ${item.middleName}`}
              />
            }
          </Box>
          <Button 
            style={{
              marginTop: 15
            }}
            type="submit"
            variant="contained"
            color="primary"
          >
            ????????????????
          </Button>
        </Box>
      <Snackbar 
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}  
        open={notify.successIsOpen} autoHideDuration={6000} 
        onClose={() => notifySet(prevState => ({
          ...prevState,
          successIsOpen: false
        }))}>
        <Alert severity='success'>
          {notify.successText}
        </Alert>
      </Snackbar>
      <Snackbar 
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}  
        open={notify.errorIsOpen} autoHideDuration={6000} 
        onClose={() => notifySet(prevState => ({
          ...prevState,
          errorIsOpen: false
        }))}>
          <Alert severity='error'>
            {notify.errorText}
          </Alert>
      </Snackbar>
    </Container>
  )
}