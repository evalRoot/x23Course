import { Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

export default function AddTest(prop) {
  const [active, setActive] = useState(false)
  const [questions, setQuestions] = useState([])

  const handleSubmit = () => {
    console.log(questions)
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
      <Button variant="contained" style={{ marginBottom: 15 }} onClick={() => {
        setActive(true)
      }}> 
        Добавить Тест 
      </Button>
      {active &&
        <>
          <Typography variant="h6">Тест:</Typography>
          <TextField
            style={{
              marginTop: 15
            }}
            autoComplete="fname"
            name="testName"
            variant="outlined"
            required
            fullWidth
            id="testName"
            label="Название Теста"
          />

          {questions.map((question, questionIndex) => (
            <Box style={{ marginTop: 20, marginBottom: 20 }} key={questionIndex}>
              <Typography style={{marginBottom: 10}} variant="h6">Вопрос {questionIndex + 1}:</Typography>
              <TextField
                key={questionIndex}
                name="question"
                variant="outlined"
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
                    required
                    fullWidth
                    onChange={(evt) => answerOption.answerText = evt.target.value }
                    id={`option-${index}`}
                    label="Название Ответа"
                  />
                  <FormControlLabel style={{paddingLeft: 15}} label='Правильный ответ' control={<Checkbox checked={answerOption.isCorrect} onChange={() => {setCorrectOption(questionIndex, index)}} />}  />
                </Box>
              ))}
              <Button style={{ marginTop: 15, marginLeft: 15 }} onClick={() => AddAnswerOption(questionIndex)}>
                Добавить вариант ответа
              </Button>

            </Box>
          ))}
          
          <Button onClick={addQuestion} style={{ marginTop: 10 }}>Добавить Вопрос</Button>
        </>
      }
      {questions.length > 1 &&
        <Box>
          <Button onClick={handleSubmit} variant="contained" style={{ marginTop: 15 }}>
            Закончить Тест
          </Button>
        </Box>
      } 
    </Box>
  )
}