import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import { useEffect, useRef, useState } from 'react';
import { Container } from '@mui/system';
import { Alert, AlertTitle, LinearProgress, Snackbar, TextField, Typography } from '@mui/material';
import Editor from '../components/Editor/Editor';
import request from '../helpers/request';
import { useNavigate, useParams } from 'react-router-dom';
import AddQuiz from '../components/AddQuiz';

let labels = []

export default function CourseUpdate() {
  const {id = -1} = useParams()
  const [courseName, setCourseName] = useState('')
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [steps, setStep] = useState([])
  const editorStateRefs = useRef([])
  const navigate = useNavigate()
  const [isTestFinish, setTestFinish] = useState(false)
  const [questions, setQuestions] = useState([])
  const [notify, notifySet] = useState({
    errorIsOpen: false,
    successIsOpen: false,
    errorText: '',
    successText: '',
  })

  useEffect(() => {
    (async () => {
      if (id !== -1) {
        labels = []
        const responseCourse = await request('course', 'POST', {id})
        const responseModules = JSON.parse(responseCourse.modules)
        setCourseName(responseCourse.name)
        setStep(responseModules)
        if (labels.length === 0) {
          labels.push(...responseModules.map(step => step.name))
        }
      } else {
        setCourseName('')
        setStep([])
      }
    })()
  }, [id])

  useEffect(() => {
    labels = []
  }, [])

  const addStep = () => {
    const stepClone = [...steps]
    stepClone.push({
      label: '',
      description: ''
    })
    setStep(stepClone)
    if (stepClone.length > 1) {
      setActiveStep(stepClone.length - 1)
    }
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const handleStep = (step) => () => {
    setActiveStep(step);
  }

  const handleSave = async (edit = false) => {
    try {
      const course = {
        name: '',
        modules: []
      }
      let response = {}
      let requestData = {}
  
      if (courseName.length === 0) {
        notifySet({
          errorIsOpen: true,
          successIsOpen: false,
          errorText: 'Название Курса пустое',
          successText: '',
        })
        return
      }

      if (edit) {
        for (let j = 0; j < editorStateRefs.current.length; j++) {
          if (editorStateRefs.current[j] === undefined) {
            editorStateRefs.current[j] = JSON.parse(steps[j].description)
          }
        }
      } else {
        if (steps.length !== editorStateRefs.current.length || steps.length !== labels.length) {
          notifySet({
            errorIsOpen: true,
            successIsOpen: false,
            errorText: 'Один из модулей не завершен до конца',
            successText: '',
          })
          return
        }
      }
  
      steps.forEach((step, index) => {
        course.modules[index] = {
          name: labels[index],
          description: JSON.stringify(editorStateRefs.current[index])
        }
      })
  
      course.name = courseName

      setLoading(true)
      
      if (edit) {
        requestData = {
          course,
          questions,
          id
        }
        response = await request('editCourse', 'POST', requestData)
      } else {
        requestData = {
          course,
          questions
        }
        response = await request('addCouse', 'POST', requestData)
      }

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
      
      setLoading(false)

      if (edit) {
        navigate(`/courses/${id}`)
      } else {
        navigate(`/courses/${response.id}`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        {id === -1 ? 'Добавление Курса' : 'Редактирование Курса'}
      </Typography>
      <TextField
        autoComplete="fname"
        name="firstName"
        variant="outlined"
        required
        fullWidth
        value={courseName}
        onChange={evt => {
          setCourseName(evt.target.value)
        }}
        id="courseName"
        label="Название Курса"
      />
      <Button
        style={{
          marginTop: 20
        }}
        onClick={addStep}
        variant="contained"
      >
        Добавить Модуль
      </Button>
      <Box style={{
        marginTop: 20
      }}>
        <Stepper nonLinear activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step disabled={loading} key={index}>
              <StepButton
                onClick={handleStep(index)}
              >
                Модуль {labels.length !== 0 ? labels[index] : ''}
              </StepButton>
              <StepContent>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="courseName"
                  defaultValue={labels[index]}
                  label="Название Модуля"
                  onChange={evt => {
                    labels[index] = evt.target.value
                  }}
                  style={{
                    marginTop: 15,
                    marginBottom: 20
                  }}
                  />
                <Editor config={step.description} onChange={editorState => editorStateRefs.current[index] = editorState} readOnly={activeStep !== index} key={index}/>
                <Box style={{marginTop: 15}} sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Завершить Добавление Модулей' : 'Следующий Модуль'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Назад
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        <AddQuiz loading={loading} handleFinish={(questions, value) => {
          setQuestions(questions)
          setTestFinish(value)
        }} />
        {(isTestFinish && activeStep === steps.length && steps.length !== 0) &&
          <Button variant="contained" onClick={() => handleSave(id !== -1)} sx={{ mt: 1, mr: 1 }}>
            {id === -1 ? 'Сохранить Курс' : 'Изменить Курс'}
          </Button>
        }
        {loading &&
          <>
          <Alert style={{ marginTop: 15 }} severity="info">
            <AlertTitle>Загрузка</AlertTitle>
            <span style={{fontSize: 16}}>{`${id === -1 ? 'Идет добавление курса': 'Идет изменение курса'}`}</span>
          </Alert>
            <LinearProgress />
          </>
        }
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
  );
}
