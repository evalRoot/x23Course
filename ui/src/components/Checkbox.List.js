import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { Typography} from "@mui/material";
import { useState } from 'react';
import PropTypes from 'prop-types';

CheckboxList.propTypes = {
  items: PropTypes.array,
  getCheckedItems: PropTypes.func,
  primaryText: PropTypes.func,
  checkingBy: PropTypes.string,
  title: PropTypes.string
};


export default function CheckboxList(props) {
  const [checked, setChecked] = useState([])

  const selectAll = () => {
    if (props.items.length === checked.length) {
      setChecked([])
      props.getCheckedItems([])
      return
    }
    const newChecked = [...props.items.map(user => user.id)]
    setChecked(newChecked)
    props.getCheckedItems(newChecked)
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
    props.getCheckedItems(newChecked)
  };

  return (
    <>
      <Typography variant="h6">{props.title}</Typography>
      <List sx={{ width: '100%', maxWidth: 360 }}>
        <ListItem
          disablePadding
        >
          <ListItemButton
            onClick={selectAll}
          >
            <Checkbox
              edge="start"
              checked={props.items.length === checked.length && props.items.length !== 0} 
              tabIndex={-1}
              disableRipple
            />
            <ListItemText primary={`Выбрать всех`} />
          </ListItemButton>
        </ListItem>
        {props.items.map((item, index) => {
          const labelId = `checkbox-list-label-${item[props.checkingBy]}`;
          return (
            <ListItem
              key={index}
            >
              <ListItemButton onClick={handleToggle(item[props.checkingBy])} dense>
                <Checkbox
                    edge="start"
                    checked={checked.indexOf(item.id) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                />
                <ListItemText id={labelId} primary={props.primaryText(item)} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}

