import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";
import request from "../helpers/request";

AddTest.propTypes = {
  handleFinish: PropTypes.func,
  loading: PropTypes.bool,
};


export default function AddTest(props) {
  const [active, setActive] = useState(false)
  const [questions, setQuestions] = useState([])
  const [expanded, setExpanded] = useState(true)
  const [isFinish, setFinish] = useState(false)
  const {id = -1} = useParams()

  useEffect(() => {
    if (id !== -1) {
      getQuiz()
    } else {
      setQuestions([])
      setActive(false)
    }
    props.handleFinish(questions, isFinish)
    if (!isFinish) {
      setExpanded(true)
    }
  }, [isFinish, id])

  const getQuiz = async () => {
    const response = await request('courseQuiz', 'POST', {
      id
    })
    const questions = JSON.parse(response.quiz.questions)
    setQuestions(questions)
    setActive(true)
  }

  const addQuestion = () => {
    const questionsCopy = [...questions]
    questionsCopy.push({
      name: '',
      answerOptions: []
    })
    setQuestions(questionsCopy)
  }

  const AddAnswerOption = (index) => {
    const questionsCopy = [...questions]
    questionsCopy[index].answerOptions.push({ answerText: '', isCorrect: false })
    setQuestions(questionsCopy)
  }

  const setCorrectOption = (questionIndex, index) => {
    const questionsCopy = [...questions]
    questionsCopy[questionIndex].answerOptions[index].isCorrect = !questionsCopy[questionIndex].answerOptions[index].isCorrect
    setQuestions(questionsCopy)
  }

  return (
    <Box style={{ marginTop: 15 }}>
      {!active &&
        <Button variant="contained" style={{ marginBottom: 15 }} onClick={() => {
          setActive(true)
        }}> 
        Добавить Тест 
        </Button>
      }
      {active &&
        <>
          <Accordion disabled={isFinish} expanded={expanded} onChange={() => setExpanded(!expanded)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography variant='h6'>
                Тест:
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <>
                {questions.map((question, questionIndex) => (
                  <Box style={{ marginTop: 20, marginBottom: 20 }} key={questionIndex}>
                    <Typography style={{marginBottom: 10}} variant="h6">Вопрос {questionIndex + 1}:</Typography>
                    <TextField
                      key={questionIndex}
                      name="question"
                      variant="outlined"
                      defaultValue={question.name}
                      required
                      fullWidth
                      onChange={(evt) => question.name = evt.target.value }
                      id={`question-${questionIndex}`}
                      label="Название Вопроса"
                    />
                    {question.answerOptions.map((answerOption, index) => (
                      <Box style={{ marginTop: 15, paddingLeft: 15 }} key={index}>
                        <Typography style={{marginBottom: 15}} variant="h6">Варианты Ответов:</Typography>
                        <TextField
                          key={index}
                          name="option"
                          variant="outlined"
                          defaultValue={answerOption.answerText}
                          required
                          fullWidth
                          onChange={(evt) => answerOption.answerText = evt.target.value }
                          id={`option-${index}`}
                          label="Название Ответа"
                        />
                        <FormControlLabel style={{paddingLeft: 15}} label='Правильный ответ' control={<Checkbox value={answerOption.isCorrect} checked={answerOption.isCorrect} onChange={() => {setCorrectOption(questionIndex, index)}} />}  />
                      </Box>
                    ))}
                    <Button style={{ marginTop: 15, marginLeft: 15 }} onClick={() => AddAnswerOption(questionIndex)}>
                      Добавить вариант ответа
                    </Button>

                  </Box>
                ))}
                
                <Button onClick={addQuestion} style={{ marginTop: 10 }}>Добавить Вопрос</Button>
              </>
            </AccordionDetails>
          </Accordion>
        </>
      }
      {questions.length > 1 &&
        <Box>
          <Button onClick={() => {
            for (let i = 0; i < questions.length; i++) {
              if (questions[i].name.length === 0) {
                alert('Есть незаполненные поля название тестов')
                return
              }
              if (questions[i].answerOptions.every(option => !option.isCorrect)) {
                alert('В одном или нескольких вопросах нету правильных ответов')
                return
              }
              if (questions[i].answerOptions.length === 0) {
                alert('Нету вариантов ответов в одном или несколько тестах')
                return
              }
              for (let j = 0; j < questions[i].answerOptions.length; j++) {
                if (questions[i].answerOptions[j].answerText.length === 0) {
                  alert('Есть незаполненные поля ответы тестов')
                  return
                }
              }
            }

            setFinish(!isFinish)
            if (expanded) {
              setExpanded(false)
            }

          }} variant="contained" style={{ marginTop: 15 }}>
            {isFinish ? 'Редактировать Тест' : 'Закончить Тест'}
          </Button>
        </Box>
      } 
    </Box>
  )
}