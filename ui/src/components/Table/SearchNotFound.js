import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};

export default function SearchNotFound({ searchQuery = '', columns}) {

  const renderComponent = () => {
    if (columns.length === 0) {
      return (
        <Typography style={{
          padding: 10
        }} gutterBottom align="center" variant="subtitle1">
          Курсов не найдено
        </Typography>
      )
    }
    
    return (
      <>
        <Typography gutterBottom align="center" variant="subtitle1">
          Не нашлось &#128554;
        </Typography>
        <Typography style={{paddingBottom: 15}} variant="body2" align="center">
          По запросу &nbsp;
          <strong>&quot;{searchQuery}&quot;</strong> ничего не нашлось.
        </Typography>
      </>
    )
  }

  return (
    <Paper>
      {renderComponent()}
    </Paper>
  );
}
