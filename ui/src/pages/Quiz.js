import { Button, Card, Checkbox, FormControlLabel, Typography } from "@mui/material"
import { Container } from "@mui/system";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import request from "../helpers/request";
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

Quiz.propTypes = {
}

export default function Quiz(props) {
  const { pathname } = useLocation()
  const [questions, setQuestions] = useState([])
  const courseId = pathname.split('/')[pathname.split('/').length - 2]
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = questions.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleUserAnswer = (value, index) => {
    const questionsCopy = [...questions]
    questionsCopy[activeStep].answerOptions[index].userAnswer = value
    setQuestions(questionsCopy)
  }

  const handleFinishTest = () => {
    console.log(questions)
  }

  useEffect(() => {
    (async () => {
      const response = await request('courseQuiz', 'POST', {
        id: courseId
      })
      const questions = JSON.parse(response.quiz.questions)
      for (let i = 0; i < questions.length; i++) {
        for (let j = 0; j < questions[i].answerOptions.length; j++) {
          questions[i].answerOptions[j].userAnswer = false
        }
      }

      setQuestions(questions)
    })()

  }, [courseId]) 



  return (
    <Container>
      <Typography variant="h6" style={{marginBottom: 15}}>Тест:</Typography>
      <Card style={{ padding: 16 }}>
        {questions.length !== 0 &&
          <>
            <Typography>{questions[activeStep].name}</Typography>
            <ul style={{ padding: 16 }}>
              {questions[activeStep].answerOptions.map((option, index) => (
                <li key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox color="primary" onClick={(evt) => handleUserAnswer(evt.target.checked, index)} checked={option.userAnswer}/>
                    }
                    label={`${option.answerText}`} />
                </li> ))
              }
            </ul>
        </>
        }
      </Card>
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Следующий Вопрос
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Предыдущий Вопрос
          </Button>
        }
      />
      <Button
        style={{
          marginTop: 15
        }}
        onClick={handleFinishTest}
        variant="contained"
        color="primary">
        Завершить тест
      </Button>
    </Container>
  )
}
