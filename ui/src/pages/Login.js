import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import request from '../helpers/request';
import { useContext, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Context } from '..';
import jwtDecode from 'jwt-decode';


export default function Login() {
  
  const [isNotify, notifyShow] = useState(false)
  const [notifyText, setNotifyText] = useState('')
  const { user } = useContext(Context)
  let token = {}
  const navigate = useNavigate()

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const data = new FormData(evt.currentTarget);
      let response = await request('login', 'POST', {
          login: data.get('login'),
          password: data.get('password')
      })
  
      if (response.hasOwnProperty('error')) {
        setNotifyText(response.error)
        notifyShow(true)
        return
      }
      token = jwtDecode(response.token)
      user.setUser(token)
      user.setIsAuth(true)
      localStorage.setItem('token', response.token)
      navigate('/dashboard')
    } catch (error) {
      setNotifyText('Неизвестная ошибка сервера')
      notifyShow(true)
      console.log(error)
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Вход
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="login"
            label="Логин"
            name="login"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </Button>
        </Box>
      </Box>
      <Snackbar 
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}  
        open={isNotify} autoHideDuration={6000} 
        onClose={() => notifyShow(false)}>
        <Alert severity="error">
          {notifyText}
        </Alert>
      </Snackbar>
    </Container>
  );
}