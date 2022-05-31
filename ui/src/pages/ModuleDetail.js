import { Button, Container, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Editor from "../components/Editor/Editor";

export default function ModuleDetail () {
  const location = useLocation();
  const navigate = useNavigate()
  const {currModule} = location.state
  let moduleName = currModule.name
  let editorState = currModule.description
  const toCourse = () => {
    const locationArray = location.pathname.split('/')
    locationArray.pop()
    const coursePath = locationArray.join('/')
    navigate(coursePath)
  }

  return (
  <Container>
    <Button onClick={toCourse} style={{ marginBottom: 15 }} fontSize='large'>
      К курсу
    </Button>
    <div>
      <Typography variant="h5" sx={{ mb: 3 }}>{moduleName}</Typography>
      <Editor readOnly onChange={() => {}} config={editorState} />
    </div>
  </Container>
  )
}