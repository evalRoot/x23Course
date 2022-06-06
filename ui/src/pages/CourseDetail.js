import { CircularProgress, Container, Typography, Button, Modal } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import request from "../helpers/request";
import Page404 from "./Page404";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CheckboxList from "../components/Checkbox.List";
import { Context } from "..";
import { ADMIN_ROLE, LEADER_ROLE, USER_ROLE } from "../const";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CourseDetail (props) {
  const {id} = useParams()
  const [courseName, setCourseName] = useState('')
  const [loading, setLoading] = useState(true)
  const [status404, setFlag404] = useState(false)
  const [modules, setModules] = useState([])
  const [users, setUsers] = useState([])
  const [checked, setCheckedUsers] = useState([])
  const {user} = useContext(Context)
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()

  const toModule = (index) => {
    navigate('module-detail', {
      state: { 
        currModule: index,
        modules: modules,
      }
    })
  }
  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  useEffect(() => {
    (async () => {
      try {
        const responseCourse = await request('course', 'POST', {id})
        let responseUsers = []

        if (responseCourse.status === 404) {
          setFlag404(true)
        }
        
        setCourseName(responseCourse.name)
        setModules(JSON.parse(responseCourse.modules))

        if (user.getUser.role === ADMIN_ROLE) {
          responseUsers = await request('allUsers', 'GET', {})
        } else if (user.getUser.role === LEADER_ROLE) {
          responseUsers = await request('assignUsers', 'POST', {
            id: user.getUser.id
          })
        }

        if (responseUsers.length !== 0) {
          setUsers(responseUsers.users)
        }

        setLoading(false)
      } catch (error) {
        console.log(error, 'course detail error')
        setLoading(false)
      }
    })()
  }, [])

  const assignToCourse = async () => {
    const response = await request('assignCourse', 'POST', {
      courseId: id,
      usersIds: checked
    })
    setShowModal(false)
    console.log(response)
  }

  const renderComponent = () => {
    if (loading) {
      return (
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <CircularProgress size={60} />
          <Typography style={{
            color: '#1976d2',
            marginTop: 20
          }} variant="h7">Loading...</Typography>
        </Box>
        )
    }

    if (status404) {
      return (
        <Page404 title={'Такого курса нет'}/>
      )
    }

    return (
      <Container>
        <div>
          <Typography variant="h5" sx={{ mb: 3 }}>Название курса: {courseName}</Typography>
          <Typography variant="h6" sx={{ mb: 3 }} style={{display: 'inline-flex', alignItems: 'center'}}>
            Карта Курса
            <AccountTreeIcon style={{marginLeft: 10}} fontSize="medium"/>
          </Typography>
          <Box style={{marginBottom: 20}}>
            <Button onClick={handleModalOpen} variant="contained" size="large">
              {user.getUser.role === USER_ROLE ? 'Записаться на курс' : 'Назначить сотрудникам'}
            </Button>
          </Box>
          <Container>
            <ol>
              {modules.map((moduleCurr, index) => (
                <li key={index}>
                  <p> Модуль </p>
                  <span style={{
                    cursor: 'pointer',
                    color: '#2065D1',
                    textDecoration: 'underline'
                  }} onClick={() => toModule(index)}>
                    {moduleCurr.name}
                  </span>
                </li>
              ))}
              <li className="">
                <p>Модуль</p>
                <span style={{
                    cursor: 'pointer',
                    color: '#2065D1',
                    textDecoration: 'underline'
                  }} onClick={() => navigate('quiz')}>
                    Тест
                </span>
              </li>
            </ol>
          </Container>
        </div>
        <Modal
          open={showModal}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <CheckboxList
              title={'Назначить сотрудникам:'}
              getCheckedItems={(checked) => {
                 setCheckedUsers(checked)
              }}
              checkingBy='id'
              primaryText={(item) => `${item.lastName} ${item.firstName} ${item.middleName}`}
              items={users} 
            />
            <Button onClick={assignToCourse} variant="contained">
              Назначить
            </Button>
          </Box>
        </Modal>
      </Container>
    )
  }

  return (
    renderComponent()
  )
}