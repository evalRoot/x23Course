import ThemeProvider from "./theme";
import RouteComponent from "./routes/RouteComponent";
import { useContext, useEffect, useState } from "react";
import { Context } from ".";
import isAuthRequest from "./helpers/checkAuth";
import jwtDecode from "jwt-decode";
import { observer } from "mobx-react"
import { Box, CircularProgress, Typography } from "@mui/material";

export default observer(function App() {
  const {user} = useContext(Context)
  const [loading, setLoading] = useState(true)

  useEffect(() => {    
    (async () => {
      const response = await isAuthRequest()
      let decode = {}

      if (response && response.status === 200) {
        decode = jwtDecode(localStorage.getItem('token'))
        user.setIsAuth(true)
        user.setUser(decode)
      }
      setLoading(false)
    })()
  }, [user])

  if (loading) {
    return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh'
    }}>
      <CircularProgress size={100} />
      <Typography style={{
        color: '#1976d2',
        marginTop: 20
      }} variant="h6">Loading...</Typography>
    </Box>
    )
  }

  return (
    <ThemeProvider>
      <RouteComponent/>
    </ThemeProvider>
  )
})