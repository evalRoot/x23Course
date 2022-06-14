import { Box, Container, Tab, Tabs, Typography } from "@mui/material"
import { useContext, useState } from "react";
import { Context } from "..";
import EventsList from "../components/EventsList";
import TabPanel from "../components/TabPanel"


function EventsView() {
  const [value, setValue] = useState(0);
  const {user} = useContext(Context)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return(
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
          Мероприятия
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Все мероприятия" />
            <Tab label="Мои мероприятия" />
            <Tab label="Подчиненных" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <EventsList />
        </TabPanel>
        <TabPanel value={value} index={1}>
        <EventsList assign userId={user.getUser.id}/>
          </TabPanel>
        <TabPanel value={value} index={2}>
          <EventsList leaderAssign userId={user.getUser.id}/>
        </TabPanel>
      </Box>
    </Container>
  )
}

export default EventsView