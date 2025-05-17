import { useState } from "react";
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';


export default function Grocery({ row, removeGrocery, updateGrocery, handleClick, labelId, isItemSelected }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: row.name, quantity: row.quantity });
    const startEdit = () => {
        setIsEditing(true);
        setEditData({ name: row.name, quantity: row.quantity });
    };

    const cancelEdit = () => {
        setIsEditing(false);
    };

    const saveEdit = () => {
        updateGrocery(row.id, editData);
        setIsEditing(false);
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
                {isEditing ? (
                    <>
                        <TableCell colSpan={5}>
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                            />
                            <input
                                type="number"
                                value={editData.quantity}
                                onChange={(e) => setEditData(prev => ({ ...prev, quantity: e.target.value }))}
                            />
                            <button onClick={saveEdit}>保存</button>
                            <button onClick={cancelEdit}>キャンセル</button>
                        </TableCell>
                    </>
                ) : (
                    <>
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
                            onClick={startEdit}
                        >
                            {row.name}
                        </TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                        <TableCell align="right">{row.carbs}</TableCell>
                        <TableCell align="right">{row.protein} </TableCell>
                        <TableCell align="right"> <button onClick={removeGrocery}>削除</button></TableCell>
                    </>
                )}
            </TableRow>

        </>
    )
}