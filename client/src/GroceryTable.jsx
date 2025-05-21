import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';




import { useState, useEffect, useMemo } from "react";
import api from './api/api';
import { useNavigate } from 'react-router-dom';
import Grocery from "./Grocery";

function descendingComparator(a, b, orderBy) {
    if (orderBy === 'expirationDate') {
        const dateA = new Date(a[orderBy]).getTime();
        const dateB = new Date(b[orderBy]).getTime();

        if (dateB < dateA) {
            return -1;
        }
        if (dateB > dateA) {
            return 1;
        }
        return 0;
    };

    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
};

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
};

export default function EnhancedTable({ user }) {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('quantity');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    const [groceries, setGroceries] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchGroceries = async () => {
            try {
                const res = await api.get('/api/groceries');
                setGroceries(res.data);
            } catch (error) {
                const message = error.response?.data?.error || "データ取得失敗"
                alert(message);
                navigate('/login')
            }
        };
        fetchGroceries();
    }, []);

    const rows = groceries.map((g) => ({
        id: g._id,
        name: g.name,
        quantity: g.quantity,
        expirationDate: g.expirationDate,
        note: g.note
    }));

    const removeGrocery = async (id) => {
        try {
            await api.delete(`/api/groceries/${id}`);
            setGroceries(groceries.filter((g) => g._id != id));
        } catch (error) {
            const message = error.response?.data?.error || "データ取得失敗"
            alert(message);
        }
    };

    const addGrocery = async (formData) => {
        try {
            const res = await api.post('/api/groceries', { name: formData.name, quantity: formData.quantity, expirationDate: formData.expirationDate });
            setGroceries([...groceries, res.data.grocery]);
        } catch (error) {
            const message = error.response?.data?.error || '作成に失敗しました'
            alert(message);
        }
    };

    const updateGrocery = async (id, updatedData) => {
        try {
            const res = await api.put(`/api/groceries/${id}`, updatedData);
            setGroceries(groceries.map(g => (g._id === id ? res.data.grocery : g)));
        } catch (error) {
            const message = error.response?.data?.error || '更新に失敗しました'
            alert(message);
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
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
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = useMemo(
        () =>
            [...rows]
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, rows],
    );

    return (
        <Box sx={{ width: '95%', height: '90%', display: 'flex', flexDirection: 'column', pt: 3, mx: 'auto' }}>
            <Paper sx={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <EnhancedTableToolbar numSelected={selected.length} addGrocery={addGrocery} />
                <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                    <Table
                        sx={{ width: '100%', tableLayout: 'fixed' }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody >
                            {visibleRows.map((row, index) => {
                                const isItemSelected = selected.includes(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <Grocery key={row.id} row={row} removeGrocery={() => removeGrocery(row.id)} updateGrocery={updateGrocery} handleClick={handleClick} isItemSelected={isItemSelected} labelId={labelId} />
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </Box>
    );
}
