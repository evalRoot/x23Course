import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, Typography, Avatar, Button } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { Context } from '..';
import { ADMIN_ROLE, APPBAR_DESKTOP, DRAWER_WIDTH } from '../const';

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_DESKTOP,
  borderBottom: '1px solid rgba(145, 158, 171, 0.24)'
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

function getUserName(user) {
  if (user.getUser.role === ADMIN_ROLE) {
    return(
      <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
        Администратор
      </Typography>
    )
  }

  return(
    <React.Fragment>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {user.getUser.firstName}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary' }}>
        {user.getUser.lastName}
      </Typography>
    </React.Fragment>
  )
}

export default observer(function NavBar() {
  const {user} = useContext(Context)

  const logOut = () => {
    user.setIsAuth(false)
    user.setUser({})
    localStorage.removeItem('token')
  }

  return (
    <RootStyle>
      <ToolbarStyle>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <AccountStyle>
            <Avatar sx={{ bgcolor: 'rgb(255, 87, 34)' }}>{user.getUser.firstName[0].toUpperCase()}</Avatar>
            <Box sx={{ ml: 2 }}>
              {getUserName(user)}
            </Box>
          </AccountStyle>
        </Stack>
        <Button onClick={logOut} style={{marginLeft: '15px'}} size="large" variant="contained">Выйти</Button>
      </ToolbarStyle>
    </RootStyle>
  );
})
