import { 
  Container, 
  Typography, 
  Box,
  Tab,
  Tabs
} from '@mui/material';
import { useContext, useState } from 'react';
import CoursesList from '../components/CoursesList';
import TabPanel from '../components/TabPanel';
import { Context } from '..';

function Courses() {
  const [value, setValue] = useState(0);
  const {user} = useContext(Context)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return(
    <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
            Курсы
        </Typography>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Назначенные курсы" />
              <Tab label="Пройденные курсы" />
              <Tab label="Курсы в свободном доступе" />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <CoursesList userId={user.getUser.id} assign/>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CoursesList userId={user.getUser.id} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <CoursesList all />
          </TabPanel>
        </Box>
    </Container>
  )
}

export default Courses