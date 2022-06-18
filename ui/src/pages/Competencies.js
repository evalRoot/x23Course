import { Container, Typography, Box, Tabs, Tab, Button, Checkbox, Modal, Select, MenuItem, OutlinedInput, InputLabel, TextField } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TabPanel from '../components/TabPanel';
import { Chart as ChartJS, ArcElement, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Context } from "..";
import { ADMIN_ROLE, LEADER_ROLE } from "../const";
import request from "../helpers/request";
import TableComponent from "../components/Table/TableComponent";
import gradeDecode from "../helpers/gradeDecode";

ChartJS.register(ArcElement, Legend);

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const option = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (tooltipItem) => {
          const currentValue = tooltipItem.parsed;
          let total = 0;
          for (let i = 0; i < tooltipItem.dataset.data.length; i++) {
            total += tooltipItem.dataset.data[i];
          }
          const percentage = (currentValue / total * 100).toFixed(0);
          return `${currentValue} (${percentage}%)`;
        },
      }
    }
  } 
}

export default function Competencies () {
  const [value, setValue] = useState(0);
  const {user} = useContext(Context)
  const [modalCreate, setModalCreate] = useState(false)
  const [modalAdd, setModalAdd] = useState(false)
  const [grades, setGrades] = useState([])
  const [grade, setGrade] = useState('')
  const [competenceName, competenceSetName] = useState('')
  const [selected, setSelected] = useState([])
  const [competencies, setCompetencies] = useState([])
  const [rows, setRows] = useState([])
  const [users, setUsers] = useState([])
  const [userValue, setUserValue] = useState('')
  const [userCompetencies, setUserCompetencies] = useState([])
  const [chartData, setChartData] = useState({
    labels: ['Соответствие', 'Развитие'],
    datasets: [{}]
  })


  const createCompetence = async () => {
    if (!grade) {
      alert('Компетенция не выбрана')
      return
    }

    if (!competenceName) {
      alert('Пустое имя компетенции')
      return
    }

    try {
      const response = await request('createCompetence', 'POST', {
        name: competenceName,
        gradeId: grade
      })
  
      alert(response.message)

      setModalCreate(false)
      setGrade('')
      competenceSetName('')
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getGrades = async () => {
    try {
      let response = await request('gradesList', 'GET', {})
      setGrades(response.grades)
    } catch (error) {
      console.log(error)
    }
  }

  const getCompetencies = async () => {
    try {
      let response = await request('competences', 'GET', {})
      let rows = []
      const competencies = response.competencies

      competencies.forEach((competence, index) => {
        rows.push({
          id: index,
          name: competence.name,
          grade: gradeDecode(competence.GradeId),
          sortBy: competence.name,
          orderBy: competence.gradeId
        })
      })

      setCompetencies(rows)

    } catch (error) {
      console.log(error)
    }
  }

  const getAssignedCompetences = async (merge = false) => {
    try {
      let response = await request('assignCompetencesList', 'POST', {
        id: user.getUser.id,
        gradeId: user.getUser.GradeId
      })
      let grade = ''
      const competencies = response.competencies


      competencies.forEach((competence, index) => {
        console.log(competence)
        grade = gradeDecode(competence.gradeId)
        competence.gradeId = grade
        if (rows.length !== 0 && index < rows.length && merge) {
          competence.isGrowth = rows[index].isGrowth
          competence.isDeserved = rows[index].isDeserved
        }
      })
      setRows(response.competencies)
      updateChartData(response.competencies)
    } catch(error) {
      console.log(error)
    }
  }
  
  const assignCompetences = async () => {
    try {
      let response = await request('assignCompetences', 'POST', {
        userId: user.getUser.id,
        selected
      })

      alert(response.message)
      setModalAdd(false)
      getAssignedCompetences(true)
    } catch (error) {
      console.log(error)
    }
  }

  const usersFromLeader = async () => {
    try {
      const response = await request('assignUsers', 'POST', {
        id: user.getUser.id,

      })

      setUsers(response.users)
      
    } catch(error) {
      console.log(error)
    }
  }

  const handleDeserve = (value, index) => {
    const rowsCopy = rows.slice()
    rowsCopy[index].isDeserved = value

    if (value) {
      rowsCopy[index].isGrowth = false
    }

    setRows(rowsCopy)

    updateChartData()
  }

  const handleGrowth = (value, index) => {
    const rowsCopy = rows.slice()
    rowsCopy[index].isGrowth = value

    if (value) {
      rowsCopy[index].isDeserved = false
    }

    setRows(rowsCopy)

    updateChartData()
  }

  const saveCompetence = async () => {    
    try {
      let response = await request('saveCompetence', 'POST', {
        userId: user.getUser.id,
        competencies: rows
      })

      alert(response.message)
    } catch (error) {
      console.log(error)
    }
  }

  const updateChartData = (response = null) => {
    let deservedCheckLength = 0
    let growthCheckedLength = 0
    const rowsCopy = response ? response : rows.slice()
    const mapped = rowsCopy.map(row => ({ isDeserved: row.isDeserved, isGrowth: row.isGrowth }))

    mapped.forEach(row => {
      if (row.isDeserved) {
        deservedCheckLength++
      }

      if (row.isGrowth) {
        growthCheckedLength++
      }
    })


    setChartData({
      labels: ['Соответствие', 'Развитие'],
      datasets: [{
        data: [deservedCheckLength, growthCheckedLength],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      }]
    })

  }

  const handleChangeUser = async (evt) => {
    try {
      let user = users.find(user => user.id === evt.target.value)
      let response = await request('assignCompetencesList', 'POST', {
        id: user.id,
        gradeId: user.GradeId
      })
      setUserValue(evt.target.value)
      response.competencies.forEach(competence => {
        competence.gradeId = gradeDecode(competence.gradeId)
      })
      setUserCompetencies(response.competencies)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getGrades()
    getCompetencies()
    usersFromLeader()
    getAssignedCompetences()
  }, [])

  useEffect(() => {
    console.log(rows)
  }, [rows])

  return (
  <Container>
    <Typography style={{ display: 'flex', alignItems: 'center' }} variant="h4" sx={{ mb: 5 }}>
      Компетенции
    </Typography>
    {user.getUser.role === ADMIN_ROLE &&
      <p>
        <Button style={{marginBottom: 20}} onClick={() => setModalCreate(true)} variant="contained" color="primary"> Создать Компетенцию</Button> 
      </p>
    }
    <Button style={{marginBottom: 20}} onClick={() => setModalAdd(true)} variant="contained" color="primary"> Добавить Компетенцию </Button>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Мои Компетенции" />
          {user.getUser.role === LEADER_ROLE &&
            <Tab label="Компетенции подчиненных" />
          }
        </Tabs>
      </Box>
      

      
      <TabPanel value={value} index={0}>
        <div style={{ display: 'flex' }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Название Компетенции</TableCell>
                  <TableCell align="left">Освоено</TableCell>
                  <TableCell align="left">Обучение</TableCell>
                  <TableCell align="left">Уровень</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">
                      <Checkbox onClick={(evt) => handleDeserve(evt.target.checked, index)} checked={row.isDeserved} />
                    </TableCell>
                    <TableCell align="left">
                      <Checkbox onClick={(evt) => handleGrowth(evt.target.checked, index)} checked={row.isGrowth} />
                    </TableCell>
                    <TableCell align="left">
                      {row.gradeId}
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 &&
                  <TableRow style={{ height: 53 }}>
                      <TableCell colSpan={6}><h4>Компетенции пока нет</h4></TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ width: 280, height: 280, marginLeft: 20}}>
            <p>Диаграмма соответсвия</p>
            <Pie options={option} data={chartData} />
          </div>
        </div>
        <Button style={{marginTop: 20}} variant="contained" onClick={saveCompetence} color="primary">Сохранить</Button> 
      </TabPanel>
      <TabPanel value={value} index={1}>
        <InputLabel>Сотрудник</InputLabel>
        <Select style={{marginBottom: 20}}
          displayEmpty
          value={userValue}
          onChange={handleChangeUser}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Не выбрано</em>;
            }

            const user = users.find(user => user.id === selected)

            return `${user.firstName} ${user.lastName} ${user.middleName}`
          }}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem disabled value="">
            <em>Не выбрано</em>
          </MenuItem>
          {users.map((user, index) => (
            <MenuItem
              key={index}
              value={user.id}
            >
              {`${user.firstName} ${user.lastName} ${user.middleName}`}
            </MenuItem>
          ))}
        </Select>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Название Компетенции</TableCell>
                  <TableCell align="left">Освоено</TableCell>
                  <TableCell align="left">Обучение </TableCell>
                  <TableCell align="left">Уровень</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userCompetencies.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">
                      <Checkbox disabled checked={row.isDeserved} />
                    </TableCell>
                    <TableCell align="left">
                      <Checkbox disabled  checked={row.isGrowth} />
                    </TableCell>
                    <TableCell align="left">
                      {row.gradeId}
                    </TableCell>
                  </TableRow>
                ))}
                {userCompetencies.length === 0 &&
                  <TableRow style={{ height: 53 }}>
                      <TableCell colSpan={6}><h4>Компетенции пока нет</h4></TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
      </TabPanel>
    </Box>
    <Modal
      open={modalCreate}
      onClose={() => setModalCreate(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography style={{marginBottom: 30}} id="modal-modal-title" variant="h6" component="h2">
          Создать Компетенцию
        </Typography>
        <InputLabel>Компетенция</InputLabel>
        <Select
          displayEmpty
          value={grade}
          onChange={(evt) => setGrade(evt.target.value)}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Не выбрано</em>;
            }

            return grades.find(grade => grade.id === selected).name;
          }}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem disabled value="">
            <em>Не выбрано</em>
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
        <TextField
          margin="normal"
          required
          fullWidth
          multiline
          onChange={evt => competenceSetName(evt.target.value)}
          rows={2}
          id="name"
          label="Название компетенций"
          name="name"
          autoFocus
        />
        <Button style={{marginTop: 20}} variant="contained" color="primary" onClick={createCompetence}> Создать компетенцию </Button>
      </Box>
    </Modal>
    <Modal
      open={modalAdd}
      onClose={() => {
        setModalAdd(false)
        setSelected([])
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{...style, width: 1000, height: 600, overflowY: 'auto'}}>
        <TableComponent onSelectCheckbox={(selected) => {
            setSelected(selected)
          }}
          selectFilter
          selectFilterItems={
            grades.map(grade => ({ name: grade.name, value: grade.name }))
          }
          filterBySelect='grade'
          withCheckbox 
          header={[{label: 'Компетенция'}, {label: 'Уровень'}]}  
          rows={competencies}/>
        <Container>
          <Button style={{marginTop: 20}} variant="contained" color="primary" onClick={assignCompetences}> Добавить </Button>
        </Container>
      </Box>
    </Modal>
  </Container>
  )
}