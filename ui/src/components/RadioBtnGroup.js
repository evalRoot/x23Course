import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

RadioButtonsGroup.propTypes = {
  items: PropTypes.array,
  getItem: PropTypes.func,
  setBy: PropTypes.string,
  labelText: PropTypes.func,
  title: PropTypes.string,
};

export default function RadioButtonsGroup(props) {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(Number(event.target.value));
    props.getItem(Number(event.target.value))
  }

  useEffect(() => {
    if (props.items.map(item => item.id).indexOf(value) === -1) {
      setValue(null);
    }
  }, [props.items])

  return (
    <Box>
      <FormControl>
        <Typography variant="h6">{props.title}</Typography>
        <RadioGroup
          value={value}
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          onChange={handleChange}
        >
          {props.items.map((item, index) => (
            <FormControlLabel
              style={{paddingLeft: 16}}
              key={index} 
              value={item[props.setBy]} 
              control={<Radio />} 
              label={props.labelText(item)} />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
}
