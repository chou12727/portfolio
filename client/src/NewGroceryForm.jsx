
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { useState } from "react";

export default function NewGroceryForm({ addGrocery }) {
    const [formData, setFormData] = useState({ name: "", quantity: "" });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        addGrocery(formData);
        setFormData({ name: "", quantity: "" })
    }

    return (
        <>
            <form onSubmit={handleCreate} >
                <label htmlFor="name">商品名</label>
                <input type="text" id="name" name="name" placeholder="商品名" value={formData.name} onChange={handleChange} />
                <label htmlFor="quantity">数量</label>
                <input type="number" id="quantity" name="quantity" placeholder="0" min="1" value={formData.quantity} onChange={handleChange} />
                <Tooltip title="Add">
                <IconButton type='submit' >
                    <AddIcon />
                </IconButton>
            </Tooltip>
            </form>
        </>
    )
}