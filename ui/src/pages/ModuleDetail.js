import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Editor from "../components/Editor/Editor";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

export default function ModuleDetail () {
  const location = useLocation();
  const navigate = useNavigate()
  const {modules, currModule} = location.state
  let moduleName = modules[currModule].name
  let editorState = modules[currModule].description
  const [show, setShow]= useState(false)
  
  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 100)
  }, [])

  const toCourse = () => {
    const locationArray = location.pathname.split('/')
    locationArray.pop()
    const coursePath = locationArray.join('/')
    navigate(coursePath)
  }

  const toCourseTest = () => {
    const locationArray = location.pathname.split('/')
    locationArray.pop()
    const coursePath = locationArray.join('/')
    navigate(`${coursePath}/quiz`)
  }

 const handleNavigatePrev = () => {
    navigate('', {
      state: { 
        currModule: currModule - 1,
        modules: modules,
      }
    })
  }

  const handleNavigateNext = () => {
    navigate('', {
      state: { 
        currModule: currModule + 1,
        modules: modules,
      }
    })
  }

  return (
  <Container>
    <Button variant="contained" onClick={toCourse} style={{ marginBottom: 15 }} fontSize='large'>
      К курсу
    </Button>
    <Box style={{position:'relative', width: '100%', display: 'flex', height: 36, marginTop: 15, marginBottom: 15}}>
      {currModule !== 0 &&
        <Button
          color='info'
          variant="outlined"
          style={{
            position: 'absolute',
            left: 0
          }}
          onClick={handleNavigatePrev}
        >
          <KeyboardArrowLeft />
          Модуль {`${currModule} ${modules[currModule - 1].name}`}
        </Button>
      }
      {currModule !== modules.length - 1 &&
        <Button
          color='info'
          variant="outlined"
          onClick={handleNavigateNext}
          style={{
            position: 'absolute',
            right: 0
          }}>
            Модуль {`${currModule + 2} ${modules[currModule + 1].name}`}
          <KeyboardArrowRight /> 
        </Button>
      }
      {currModule === modules.length - 1 &&
        <Button
          onClick={toCourseTest}
          variant="contained"
          style={{
            position: 'absolute',
            right: 0
          }}>
            Пройти тест
      </Button>
      }
    </Box> 
    <div>
      <Typography variant="h5" sx={{ mb: 3 }}>{moduleName}</Typography>
      {show &&
        <Editor readOnly config={editorState} />
      }
    </div>
  </Container>
  )
}