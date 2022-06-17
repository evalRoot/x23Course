import { CircularProgress, Container, Typography, Button, Modal, Snackbar, Alert, Card, Link } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import request from "../helpers/request";
import Page404 from "./Page404";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CheckboxList from "../components/Checkbox.List";
import { Context } from "..";
import { ADMIN_ROLE, LEADER_ROLE, USER_ROLE } from "../const";
import moment from "moment";

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
  const {id = -1} = useParams()
  const [courseName, setCourseName] = useState('')
  const [loading, setLoading] = useState(true)
  const [status404, setFlag404] = useState(false)
  const [modules, setModules] = useState([])
  const [users, setUsers] = useState([])
  const [checked, setCheckedUsers] = useState([])
  const {user} = useContext(Context)
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()
  const [assign, setAssign] = useState(false)
  const [assignFailed, setAssignFailed] = useState(false)
  const [assignMessage, setAssignMessage] = useState('')
  const [assignFailedMessage, setAssignFailedMessage] = useState('')
  const [isCourseAccsess, setCourseAccess] = useState(false)

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
        const isAssigned = await request('isAssignedCourse', 'POST', {
          userId: user.getUser.id,
          courseId: id
        })
        
        setCourseAccess(isAssigned.access)


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

  const assignToCourse = async (evt, selfAssign = false) => {
    const response = await request('assignCourse', 'POST', {
      courseId: id,
      usersIds: selfAssign ? [user.getUser.id] : checked,
      activationDate: moment()
    })
    setShowModal(false)
    if (response.successAssign.length !== 0) {
      setAssignMessage(response.successAssign.join(', '))
      setAssign(true)
      if (selfAssign) {
        window.location.reload();
      }
    }
    if (response.failesAssign.length !== 0) {
      setAssignFailedMessage(response.failesAssign.join(', '))
      setAssignFailed(true)
    }

  }

  const handleDeleteCourse = async () => {
    try {
      await request('deleteCourse', 'POST', { id })
      navigate('/courses')
    } catch (error) {
      console.log(error.message)
      alert('Не удалось Удалить')
    }
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
          }} variant="h7">Загрузка...</Typography>
        </Box>
        )
    }

    if (status404) {
      return (
        <Page404 title={'Такого курса нет'}/>
      )
    }

    const getControls = () => {
      if (user.getUser.role !== USER_ROLE) {
        return (
          <>
            <Button onClick={handleModalOpen} variant="contained" size="large">
              Назначить сотрудникам
            </Button>
            <p></p>
            {!isCourseAccsess &&
              <Button onClick={(evt) => assignToCourse(evt, true)} style={{marginTop: 20}} variant="contained" size="large">
                Записаться на курс
              </Button>
            }
            {isCourseAccsess &&
              <Alert style={{ width: 300, marginTop: 15 }} severity="info">Вы записаны на курс</Alert>
            }
          </>
        )
      }

      if (user.getUser.role === USER_ROLE && !isCourseAccsess) {
        return (
          <Button onClick={(evt) => assignToCourse(evt, true)} variant="contained" size="large">
            Записаться на курс
          </Button>
        )
      }

      if (user.getUser.role === USER_ROLE && isCourseAccsess) {
        return (
          <Alert style={{ width: 300, marginTop: 15 }} severity="info">Вы записаны на курс</Alert>
        )
      }
    }


    return (
      <Container>
        <div>
          <Typography variant="h5" sx={{ mb: 3 }}>Название курса: {courseName}</Typography>
          <Box style={{marginBottom: 20}}>
            {getControls()}
          </Box>
          {user.getUser.role === ADMIN_ROLE &&
            <Box style={{marginBottom: 20}}>
              <Button onClick={() => navigate('update')} variant="contained" size="medium">
                Редактировать курс
              </Button>
              <Button style={{ marginLeft: 10 }} color="error" onClick={handleDeleteCourse} variant="contained" size="medium">
                Удалить курс
              </Button>
            </Box>
          }
          <Container>
            <Typography variant="h6" sx={{ mb: 3 }} style={{display: 'inline-flex', alignItems: 'center'}}>
              Карта Курса
              <AccountTreeIcon style={{marginLeft: 10}} fontSize="medium"/>
            </Typography>
            <ol>
              {modules.map((moduleCurr, index) => (
                <li key={index}>
                  <Card style={{ padding: '6px 12px', width: 300, marginBottom: 10 }}>
                    <p> Модуль: </p>
                    <Link
                      component="button"
                      variant="body2"
                      style={{ cursor: isCourseAccsess ? 'pointer' : 'default' }}
                      underline={isCourseAccsess ? 'always' : 'none'}
                      disabled={!isCourseAccsess}
                      onClick={() => {
                        toModule(index)
                      }}
                    >
                      {moduleCurr.name}
                    </Link>
                  </Card>
                </li>
              ))}
              <li className="">
                <Card style={{ padding: '6px 12px', width: 300, marginBottom: 10 }}>
                  <p>Модуль:</p>
                  <Link
                      component="button"
                      disabled={!isCourseAccsess}
                      style={{ cursor: isCourseAccsess ? 'pointer' : 'default' }}
                      underline={isCourseAccsess ? 'always' : 'none'}
                      variant={'body2'}
                      onClick={() => {
                        navigate('quiz')
                      }}
                    >
                      Тест Курса
                    </Link>
                </Card>
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
        <Snackbar open={assign} autoHideDuration={10000} onClose={() => setAssign(false)}>
          <Alert onClose={() => setAssign(false)} severity="success" sx={{ width: '100%' }}>
            {assignMessage}
          </Alert>
        </Snackbar>
        <Snackbar open={assignFailed} autoHideDuration={10000} onClose={() => setAssignFailed(false)}>
          <Alert onClose={() => setAssignFailed(false)} severity="error" sx={{ width: '100%'}}>
            {assignFailedMessage}
          </Alert>
        </Snackbar>
      </Container>
    )
  }

  return (
    renderComponent()
  )
}