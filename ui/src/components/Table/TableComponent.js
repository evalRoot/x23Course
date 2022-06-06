import { filter } from 'lodash';
import { useState } from 'react';
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
    return filter(array, (_user) => _user.value.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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

  const {rows = []} = props

  const [orderBy, setOrderBy] = useState('value');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const filteredItems = rows.length !== 0 ? applySortFilter(rows, getComparator(order, orderBy), filterName) : []

  const isDataNotFount = filteredItems.length === 0;

  filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
    
  })

  filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
    console.log(row)
  })

  return (
    <Container>
      <Card>
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
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHeadComponent
              order={order}
              orderBy={orderBy}
              headLabel={header}
              rowCount={header.length}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
                {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow
                    hover
                    key={index}
                    tabIndex={-1}
                  >
                    {Object.keys(row).map((key, index) => {
                      console.log(row[key])
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
                ))}
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
