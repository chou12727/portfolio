import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from "react";
const today = new Date().toISOString().slice(0, 10);

export default function NewGroceryForm({ addGrocery }) {
    const [formData, setFormData] = useState({ name: "", quantity: "", expirationDate: today });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        addGrocery(formData);
        setFormData({ name: "", quantity: "", expirationDate: today })
    }

    return (
        <>
            <Box component="form"
                onSubmit={handleCreate}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1,
                    flexDirection: { xs: 'column', sm: 'row' }
                }}
            >
                <label htmlFor="name">商品名</label>
                <input type="text" id="name" name="name" placeholder="商品名" value={formData.name} onChange={handleChange} />
                <label htmlFor="quantity">数量</label>
                <input type="number" id="quantity" name="quantity" placeholder="0" min="1" value={formData.quantity} onChange={handleChange} />
                <label htmlFor="expirationDate">期限</label>
                <input type="date" id="expirationDate" name="expirationDate" value={formData.expirationDate} onChange={handleChange} />
                {/* <Tooltip title="Add">
                    <IconButton type='submit' >
                        <AddIcon />
                    </IconButton>
                </Tooltip> */}

                <Button variant="contained" type="submit" sx={{
                    fontSize: '0.7rem',
                    padding: '2px 10px',
                    minWidth: 'auto'
                }}>追加</Button>
            </Box>
        </>
    )
}