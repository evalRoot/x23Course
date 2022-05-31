import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import { useRef, useState } from 'react';
import { Container } from '@mui/system';
import { Alert, Snackbar, TextField } from '@mui/material';
import Editor from '../components/Editor/Editor';
import request from '../helpers/request';
import { useNavigate } from 'react-router-dom';
import AddTest from '../components/AddTest';

const labels = []

export default function VerticalLinearStepper() {
  const [courseName, setCourseName] = useState('')
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState()
  const [steps, setStep] = useState([])
  const editorStateRefs = useRef([])
  const navigate = useNavigate()
  const [notify, notifySet] = useState({
    errorIsOpen: false,
    successIsOpen: false,
    errorText: '',
    successText: '',
})

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
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSave = async () => {
    try {
      const course = {
        name: '',
        modules: []
      }
      let response = {}
  
      if (courseName.length === 0) {
        notifySet({
          errorIsOpen: true,
          successIsOpen: false,
          errorText: 'Название Курса пустое',
          successText: '',
        })
        return
      }
  
      if (steps.length !== editorStateRefs.current.length || steps.length !== labels.length) {
        notifySet({
          errorIsOpen: true,
          successIsOpen: false,
          errorText: 'Один из модулей не завершен до конца',
          successText: '',
        })
        return
      }
  
      steps.forEach((step, index) => {
        course.modules[index] = {
          name: labels[index],
          description: JSON.stringify(editorStateRefs.current[index])
        }
      })
  
      course.name = courseName
      
      response = await request('addCouse', 'POST', {
        course
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

      navigate(`/course/${response.id}`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container>
      <TextField
        autoComplete="fname"
        name="firstName"
        variant="outlined"
        required
        fullWidth
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
            <Step key={index}>
              <StepButton
                onClick={handleStep(index)}
              >
                Модуль
              </StepButton>
              <StepContent TransitionProps={{ unmountOnExit: false }}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="courseName"
                  label="Название Модуля"
                  onChange={evt => {
                    labels[index] = evt.target.value
                  }}
                  style={{
                    marginTop: 15,
                    marginBottom: 20
                  }}
                  />
                <Editor onChange={editorState => editorStateRefs.current[index] = editorState} readOnly={activeStep !== index} key={index}/>
                <Box style={{marginTop: 15}} sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Завершить курс' : 'Следующий Модуль'}
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
        <AddTest/>
        {(activeStep === steps.length && steps.length !== 0) &&
          <>
            <Button onClick={handleSave} sx={{ mt: 1, mr: 1 }}>
              Сохранить Курс
            </Button>
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
