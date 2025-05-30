import { useState } from "react";
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';

const toDateInputValue = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
};

export default function Grocery({ row, removeGrocery, updateGrocery, handleClick, labelId, isItemSelected }) {
    const [hoverField, setHoverField] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [editData, setEditData] = useState({ name: row.name, quantity: row.quantity, expirationDate: toDateInputValue(row.expirationDate), note: row.note });

    const saveField = async (field) => {
        await updateGrocery(row.id, editData);
        setEditingField(null);
    };
    const cancelEdit = () => {
        setEditData({
            name: row.name,
            quantity: row.quantity,
            expirationDate: toDateInputValue(row.expirationDate),
            note: row.note
        });
        setEditingField(null);
    };

    const handleDateChange = (deltaDays) => {
        const currentDate = new Date(editData.expirationDate || new Date());
        currentDate.setDate(currentDate.getDate() + deltaDays);
        const adjustedDateStr = currentDate.toISOString().split('T')[0];
        setEditData(prev => ({ ...prev, expirationDate: adjustedDateStr }));
    };


    const handleQuantityChange = (delta) => {
        setEditData(prev => ({
            ...prev,
            quantity: Math.max(0, parseInt(prev.quantity || 0) + delta)
        }));
    };


    return (
        <>
            <TableRow
                // hover
                // role="checkbox"

                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.id}
                selected={isItemSelected}
                sx={{ cursor: 'auto' }}
            >
                <TableCell padding="checkbox"
                    sx={{
                        backgroundColor: '#f5f5f5',
                    }}>
                    <Checkbox
                        onClick={(event) => handleClick(event, row.id)}
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                            'aria-labelledby': labelId,
                        }}
                        sx={{ cursor: 'pointer' }}
                    />
                </TableCell>
                <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                    onMouseEnter={() => setHoverField('name')}
                    onMouseLeave={() => setHoverField(null)}
                    sx={{
                        color: 'blue',
                        backgroundColor: '#f5f5f5',
                        minWidth: 30,
                        maxWidth: 110,
                        whiteSpace: 'nowrap',
                        fontSize: {
                            xs: 10,
                            sm: 12,
                            md: 14,
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {editingField === 'name' ? (

                            <>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                />
                                <IconButton onClick={() => saveField('name')} size="small">
                                    <CheckIcon fontSize="small" />
                                </IconButton>
                                <IconButton onClick={cancelEdit} size="small">
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <Box onClick={() => setEditingField('name')}>{row.name}</Box>
                                {/* <IconButton onClick={() => setEditingField('name')} size="small"
                                    sx={{
                                        opacity: hoverField === 'name' ? 1 : 0,
                                        transition: 'opacity 0.2s ease-in-out',
                                        ml: 1,
                                    }}>
                                    <EditIcon fontSize="small" />
                                </IconButton> */}

                            </>
                        )}
                    </Box>
                </TableCell>
                <TableCell
                    align="center"
                    onMouseEnter={() => setHoverField('quantity')}
                    onMouseLeave={() => setHoverField(null)}
                    sx={{
                        color: 'blue',
                        backgroundColor: '#f5f5f5',
                        minWidth: 115,
                        maxWidth: 115,
                        whiteSpace: 'nowrap',
                        fontSize: {
                            xs: 10,
                            sm: 12,
                            md: 14,
                        },
                        padding: '0 8px',
                        boxSizing: 'border-box'


                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {editingField === 'quantity' ? (
                            <>
                                {/* <IconButton onClick={() => handleQuantityChange(-1)} size="small">
                                    <RemoveIcon fontSize="small" />
                                </IconButton> */}
                                <TextField
                                    // id="outlined-number"
                                    // label="Number"
                                    type="number"
                                    InputProps={{
                                        sx: { fontSize: '0.8rem' }
                                    }}
                                    value={editData.quantity}
                                    onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
                                    size="small"
                                    sx={{
                                        width: 80,
                                        '& .MuiInputBase-root': {
                                            height: 20,
                                            fontSize: '0.8rem',
                                            padding: '0px',
                                        }
                                    }}
                                />
                                {/* <input
                                    type="text"
                                    value={editData.quantity}
                                    onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
                                /> */}
                                {/* {editData.quantity} */}
                                {/* <IconButton onClick={() => handleQuantityChange(1)} size="small">
                                    <AddIcon fontSize="small" />
                                </IconButton> */}
                                <IconButton onClick={() => saveField('quantity')} size="small"
                                    sx={{
                                        p: { xs: 0.5, sm: 0.7 },
                                        ml: 0.5,
                                    }}
                                >
                                    <CheckIcon fontSize="inherit"
                                        sx={{
                                            fontSize: { xs: '1rem', sm: '1.2rem' }
                                        }}
                                    />
                                </IconButton>
                                <IconButton onClick={cancelEdit} size="small">
                                    <CloseIcon fontSize="small"
                                        sx={{
                                            fontSize: { xs: '1rem', sm: '1.2rem' }
                                        }} />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <Box onClick={() => setEditingField('quantity')}>{row.quantity}</Box>
                                {/* <IconButton onClick={() => setEditingField('quantity')} size="small"
                                    sx={{
                                        opacity: hoverField === 'quantity' ? 1 : 0,
                                        transition: 'opacity 0.2s ease-in-out',
                                        ml: 1,
                                    }}>
                                    <EditIcon fontSize="small" />
                                </IconButton> */}

                            </>
                        )}
                    </Box>
                </TableCell>
                <TableCell
                    align="center"
                    onMouseEnter={() => setHoverField('expirationDate')}
                    onMouseLeave={() => setHoverField(null)}
                    sx={{
                        color: 'blue',
                        backgroundColor: '#f5f5f5',
                        minWidth: 91,
                        maxWidth: 91,
                        whiteSpace: 'nowrap',
                        fontSize: {
                            xs: 10,
                            sm: 12,
                            md: 14,
                        },
                        padding:0

                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {editingField === 'expirationDate' ? (
                            <>
                                {/* <IconButton onClick={() => handleDateChange(-1)} size="small">
                                    <RemoveIcon fontSize="small" />
                                </IconButton> */}
                                <TextField
                                    type="date"
                                    size="small"
                                    value={editData.expirationDate}
                                    onChange={(e) => {
                                        setEditData({ ...editData, expirationDate: e.target.value });

                                    }}
                                    onBlur={() => saveField('expirationDate')}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{
                                        maxWidth: 140,
                                        fontSize: '0.8rem',
                                        '& .MuiInputBase-input': {
                                            padding: '5px 1px',
                                            fontSize: '0.5rem',     
                                            padding: '0px',
                                        }
                                    }}
                                    
                                />
                                {/* <input
                                    type="date"
                                    value={editData.expirationDate}
                                    onChange={(e) => setEditData({ ...editData, expirationDate: e.target.value })}
                                /> */}
                                {/* <IconButton onClick={() => handleDateChange(1)} size="small">
                                    <AddIcon fontSize="small" />
                                </IconButton> */}
                                {/* <IconButton onClick={() => saveField('expirationDate')} size="small">
                                    <CheckIcon fontSize="small"
                                        sx={{
                                            fontSize: { xs: '1rem', sm: '1.2rem' }
                                        }} />
                                </IconButton> */}
                                <IconButton onClick={cancelEdit} size="small">
                                    <CloseIcon fontSize="small"
                                        sx={{
                                            fontSize: { xs: '1rem', sm: '1.2rem' }
                                        }} />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <Box onClick={() => setEditingField('expirationDate')}>{row.expirationDate ? new Date(row.expirationDate).toLocaleDateString('ja-JP', {
                                    // year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                }) : ''}
                                </Box>
                                {/* <IconButton onClick={() => setEditingField('expirationDate')} size="small"
                                    sx={{
                                        opacity: hoverField === 'expirationDate' ? 1 : 0,
                                        transition: 'opacity 0.2s ease-in-out',
                                        ml: 1,
                                    }}>
                                    <EditIcon fontSize="small" />
                                </IconButton> */}

                            </>
                        )}
                    </Box>
                </TableCell>
                <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                    onMouseEnter={() => setHoverField('note')}
                    onMouseLeave={() => setHoverField(null)}
                    sx={{
                        color: 'blue',
                        backgroundColor: '#f5f5f5',
                        minWidth: 60,
                        maxWidth: 150,
                        whiteSpace: 'nowrap',
                        fontSize: {
                            xs: 10,
                            sm: 12,
                            md: 14,
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }} >
                        {editingField === 'note' ? (
                            <>
                                <TextField
                                    type="text"
                                    InputProps={{
                                        sx: { fontSize: '0.8rem' }
                                    }}
                                    value={editData.note}
                                    onChange={(e) => setEditData({ ...editData, note: e.target.value })}
                                    size="small"
                                    sx={{
                                        width: 80,
                                        '& .MuiInputBase-root': {
                                            height: 20,
                                            fontSize: '0.8rem',
                                            padding: '0px',
                                        }
                                    }}
                                />
                                <IconButton onClick={() => saveField('note')} size="small">
                                    <CheckIcon fontSize="small" />
                                </IconButton>
                                <IconButton onClick={cancelEdit} size="small">
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                {row.note}
                                <IconButton onClick={() => setEditingField('note')} size="small"
                                    sx={{
                                        opacity: hoverField === 'note' ? 1 : 0,
                                        transition: 'opacity 0.2s ease-in-out',
                                        ml: 1,
                                    }}>
                                    <EditIcon fontSize="small" />
                                </IconButton>

                            </>
                        )}
                    </Box>
                </TableCell>
                <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                    sx={{
                        color: 'blue',
                        backgroundColor: '#f5f5f5',
                        minWidth: 30,
                        maxWidth: 150,
                        whiteSpace: 'nowrap',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center", width: "10", pt: 1, pr: 2 }} align="right">
                        <IconButton onClick={removeGrocery} size="small">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </TableCell>
            </TableRow>
        </>
    )
}
