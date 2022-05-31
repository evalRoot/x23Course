import { Typography } from "@mui/material"
import PropTypes from 'prop-types';

Page404.propTypes = {
  readOnly: PropTypes.bool
}

export default function Page404(props) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <Typography>
        404
      </Typography>
      <Typography>
        {props.title}
      </Typography>
    </div>
  )
}