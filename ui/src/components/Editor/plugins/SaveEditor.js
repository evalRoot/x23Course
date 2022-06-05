import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Alert, Button, Snackbar } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import request from "../../../helpers/request";

export default function SaveEditor() {
  const [editor] = useLexicalComposerContext();
  const navigate = useNavigate()
  const [notify, notifySet] = useState({
    errorIsOpen: false,
    successIsOpen: false,
    errorText: '',
    successText: '',
  })
  
  const saveCourse = async (data) => {
    const courseName = document.getElementById('courseName').value
    let description = data

    if (document.querySelector('.editor-placeholder')) {
      description = ''
    }

    const response = await request('addCouse', 'POST', {
      name: courseName,
      description
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

    navigate(`courses/${response.id}`)
  }

  return (
    <>
      {/* <Button
        style={{
          marginTop: 20
        }}
        size="large"
        variant="contained"
        onClick={() => {
          const editorState = editor.getEditorState();
          const json = {
            editorState: editorState,
            source: 'Lexical'
          }
          const data = JSON.stringify(json)
          saveCourse(data)
      }}>Сохранить</Button> */}
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
    </>
  )
}