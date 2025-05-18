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


const toDateInputValue = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
};

export default function Grocery({ row, removeGrocery, updateGrocery, handleClick, labelId, isItemSelected }) {
    const [hoverField, setHoverField] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [editData, setEditData] = useState({ name: row.name, quantity: row.quantity, expirationDate: toDateInputValue(row.expirationDate) });

    const saveField = async (field) => {
        await updateGrocery(row.id, editData);
        setEditingField(null);
    };
    const cancelEdit = () => {
        setEditData({
            name: row.name,
            quantity: row.quantity,
            expirationDate: toDateInputValue(row.expirationDate),
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
                hover
                role="checkbox"

                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.id}
                selected={isItemSelected}
                sx={{ cursor: 'pointer' }}
            >
                <TableCell padding="checkbox">
                    <Checkbox
                        onClick={(event) => handleClick(event, row.id)}
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                            'aria-labelledby': labelId,
                        }}
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
                        minWidth: 150,
                        maxWidth: 150,
                        whiteSpace: 'nowrap',
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
                                {row.name}
                                <IconButton onClick={() => setEditingField('name')} size="small"
                                    sx={{
                                        opacity: hoverField === 'name' ? 1 : 0,
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
                    align="center"
                    onMouseEnter={() => setHoverField('quantity')}
                    onMouseLeave={() => setHoverField(null)}
                    sx={{
                        color: 'blue',
                        backgroundColor: '#f5f2a2',
                        minWidth: 120,
                        maxWidth: 120,
                        whiteSpace: 'nowrap',

                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {editingField === 'quantity' ? (
                            <>
                                <IconButton onClick={() => handleQuantityChange(-1)} size="small">
                                    <RemoveIcon fontSize="small" />
                                </IconButton>
                                {editData.quantity}
                                <IconButton onClick={() => handleQuantityChange(1)} size="small">
                                    <AddIcon fontSize="small" />
                                </IconButton>
                                <IconButton onClick={() => saveField('quantity')} size="small">
                                    <CheckIcon fontSize="small" />
                                </IconButton>
                                <IconButton onClick={cancelEdit} size="small">
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                {row.quantity}
                                <IconButton onClick={() => setEditingField('quantity')} size="small"
                                    sx={{
                                        opacity: hoverField === 'quantity' ? 1 : 0,
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
                    align="center"
                    onMouseEnter={() => setHoverField('expirationDate')}
                    onMouseLeave={() => setHoverField(null)}
                    sx={{
                        color: 'blue',
                        backgroundColor: '#f5f5f5',
                        minWidth: 160,
                        maxWidth: 160,
                        whiteSpace: 'nowrap',

                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {editingField === 'expirationDate' ? (
                            <>
                                <IconButton onClick={() => handleDateChange(-1)} size="small">
                                    <RemoveIcon fontSize="small" />
                                </IconButton>
                                <input
                                    type="date"
                                    value={editData.expirationDate}
                                    onChange={(e) => setEditData({ ...editData, expirationDate: e.target.value })}
                                />
                                <IconButton onClick={() => handleDateChange(1)} size="small">
                                    <AddIcon fontSize="small" />
                                </IconButton>
                                <IconButton onClick={() => saveField('expirationDate')} size="small">
                                    <CheckIcon fontSize="small" />
                                </IconButton>
                                <IconButton onClick={cancelEdit} size="small">
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                {row.expirationDate ? new Date(row.expirationDate).toLocaleDateString('ja-JP', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                }) : ''}

                                <IconButton onClick={() => setEditingField('expirationDate')} size="small"
                                    sx={{
                                        opacity: hoverField === 'expirationDate' ? 1 : 0,
                                        transition: 'opacity 0.2s ease-in-out',
                                        ml: 1,
                                    }}>
                                    <EditIcon fontSize="small" />
                                </IconButton>

                            </>
                        )}
                    </Box>
                </TableCell>
                <TableCell align="right">{row.protein}</TableCell>
                <TableCell align="right"><button onClick={removeGrocery}>削除</button></TableCell>
            </TableRow>
        </>
    )
}
