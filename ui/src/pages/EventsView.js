import { 
  Container, 
  Typography
} from '@mui/material';
import { useContext, useState } from 'react';
import { Context } from '..';

function EventsView() {
  const {user} = useContext(Context)

  return(
    <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
            Мероприятия
        </Typography>
    </Container>
  )
}

export default EventsView