import { styled } from '@mui/material/styles';
import { Box, Drawer } from '@mui/material';
import NavSection from './NavSection';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { ADMIN_ROLE, DRAWER_WIDTH } from '../const';
import { useContext } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import PieChartIcon from '@mui/icons-material/PieChart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddBoxIcon from '@mui/icons-material/AddBox';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    flexShrink: 0,
    maxWidth: DRAWER_WIDTH,
    zIndex: 998
}));

// ----------------------------------------------------------------------

export default observer(function Sidebar() {
  const {user} = useContext(Context)
  const allAccess = true

  return (
    <RootStyle>
      <Drawer
        open
        variant="persistent"
      >
        <Box/>
          <NavSection navConfig={[
            {
              title: 'Главная',
              path: '/dashboard',
              icon: <PieChartIcon fontSize='medium'/>,
              permission: allAccess
            },
            {
              title: 'Добавить Сотрудника/Руководителя',
              path: '/add-user',
              icon: <PersonAddIcon fontSize='medium'/>,
              permission: user.getUser.role === ADMIN_ROLE
            },
            {
              title: 'Добавить Курс',
              path: '/course-update',
              icon: <AddBoxIcon fontSize='medium'/>,
              permission: user.getUser.role === ADMIN_ROLE
            },
            {
              title: 'Курсы',
              path: '/courses',
              icon: <AssignmentIcon fontSize='medium'/>,
              permission: allAccess
            }
          ]} />
      </Drawer>
    </RootStyle>
  );
})
