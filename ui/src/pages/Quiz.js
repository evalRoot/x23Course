import { Alert, Button, Card, Checkbox, FormControlLabel, Typography } from "@mui/material"
import { Container } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import request from "../helpers/request";
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import moment from "moment";
import { Context } from "..";

const startDate = moment()

export default function Quiz(props) {
  const { pathname } = useLocation()
  const [questions, setQuestions] = useState([])
  const courseId = pathname.split('/')[pathname.split('/').length - 2]
  const {user} = useContext(Context)
  const [activeStep, setActiveStep] = useState(0);
  const [score, setScore] = useState(0)
  const [isPassed, setPassed] = useState(false)
  const [isFinish, setFinish] = useState(false)
  const maxSteps = questions.length;
  
  const navigate = useNavigate()

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

  const handleFinishTest = async () => {
    let userCorrectAnswers = 0
    let response = {}
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].answerOptions.every(option => option.isCorrect === option.userAnswer)) {
        userCorrectAnswers++
      }
    }

    const score = Math.ceil(userCorrectAnswers / questions.length * 100)
    setScore(score)

    if (score > 70) {
      setPassed(true)
    }

    response = await request('finishQuiz', 'POST', {
      courseId: Number(courseId),
      userId: user.getUser.id,
      startDate: startDate,
      endDate: moment(),
      score,
      status: score > 70 ? 'Пройден' : 'Тест Не Пройден'
    })

    setFinish(true)
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
      {isFinish ? (
        <>
          <Card style={{ padding: 16 }}>
            {isPassed ? (
              <Alert severity="success">Баллов набранно {score}. Тест Пройден!</Alert>
            ) : (
              <Alert severity="error">Баллов набранно {score}. Тест НЕ ПРОЙДЕН! Давай заново</Alert>
            )}
          </Card>
          <Button style={{marginTop: 16}}  onClick={() => {
            navigate('/courses')
          }}>
            К курсам
          </Button>
        </>
      ) : (
        <>
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
        </>
      )}
    </Container>
  )
}
