import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
// material
import {
  Card,
  Table,
  OutlinedInput,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
  InputAdornment,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// components
import SearchNotFound from './SearchNotFound';
import TableHeadComponent from './TableHeadComponent';


// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.sortBy.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
  margin: '16px 0 16px 16px'
}));

export default function TableComponent(props) {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');
  
  const {header = []} = props

  const rowsProps = props.rows || []

  const [rows, setRows] = useState(rowsProps)

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('orderBy');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [filterBySelectVal, setValueFilterSelect] = useState('')

  const {onSelectCheckbox} = props

  useEffect(() => {
    if (onSelectCheckbox) {
      onSelectCheckbox(selected)
    }
  }, [selected, onSelectCheckbox])

  useEffect(() => {
    setPage(0)
    const rowsCopy = rowsProps
    let filteredItems = rowsCopy

    if (props.selectFilter && filterBySelectVal !== '' && rows.length !== 0) {
      filteredItems = rowsCopy.filter(item => item[props.filterBySelect] === filterBySelectVal)
    }

    setRows(filteredItems)

  }, [filterBySelectVal])

  const handleRequestSort = (evt, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (evt, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (evt) => {
    setRowsPerPage(parseInt(evt.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (evt) => {
    setFilterName(evt.target.value);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, row) => {
    const selectedIndex = selected.map(select => select.id).indexOf(row.id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, {id: row.id, name: row.name, grade: row.grade,});
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
  const filteredItems = rows.length !== 0 ? applySortFilter(rows, getComparator(order, orderBy), filterName) : []

  const isDataNotFount = filteredItems.length === 0;

  const isSelected = (id) => {
    return selected.map(select => select.id).indexOf(id) !== -1
  };

  return (
    <Container>
      <Card>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <SearchStyle
            value={filterName}
            onChange={handleFilterByName}
            placeholder="Поиск..."
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon fontSize='medium'/>
              </InputAdornment>
            }
          />
          {props.selectFilter &&
            <div>
              <InputLabel>Фильтровать:</InputLabel>
              <Select
                displayEmpty
                onChange={(evt) => setValueFilterSelect(evt.target.value)}
                value={filterBySelectVal}
              >
                <MenuItem disabled value="">
                  <em>Не выбрано</em>
                </MenuItem>
                {props.selectFilterItems.map(item => (
                  <MenuItem value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
          </div>
          }
        </div>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHeadComponent
              onSelectAllClick={handleSelectAllClick}
              order={order}
              withCheckbox={props.withCheckbox}
              orderBy={orderBy}
              headLabel={header}
              numSelected={selected.length}
              rowCount={rows.length}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
                {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                   const isItemSelected = isSelected(row.id)
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      key={index}
                      tabIndex={-1}
                    >

                      {props.withCheckbox &&
                        <TableCell padding="checkbox" key={index} align='left'>
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                          />
                        </TableCell>
                      } 

                      {Object.keys(row).map((key, index) => {
                        if (key === 'sortBy' || key === 'orderBy' || key === 'id') {
                          return ''
                        }

                        if (row[key].linkTo) {
                          return (
                            <TableCell key={index} align='left'>
                              <a href={row[key].linkTo}>
                                {row[key].title}
                              </a>
                            </TableCell>
                          )
                        }

                        return (
                          <TableCell key={index} align='left'>
                            {row[key]}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ) 
                })}
                {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                </TableRow>
                )}
            </TableBody>

            {isDataNotFount && (
              <TableBody>
                <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <SearchNotFound searchQuery={filterName} columns={rows} />
                    </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>

        <TablePagination
          labelRowsPerPage='Строк на странице'
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Card>
    </Container>
  );
}
