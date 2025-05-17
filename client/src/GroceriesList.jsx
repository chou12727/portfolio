import { useState, useEffect } from "react";
import api from './api/api';
import { useNavigate } from 'react-router-dom';
import Grocery from "./Grocery";
import NewGroceryForm from './NewGroceryForm';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';

export default function GroceriesList() {
    const [groceries, setGroceries] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchGroceries = async () => {
            try {
                const res = await api.get('api/groceries');
                setGroceries(res.data);
            } catch (error) {
                const message = error.response?.data?.error || "データ取得失敗"
                alert(message);
                navigate('/login')
            }
        };
        fetchGroceries();
    }, []);

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
            const res = await api.post('/api/groceries', { name: formData.name, quantity: formData.quantity });
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


    return (
        <div>
            <h1>商品一覧</h1>
            <ul>
                {groceries.map(g => (
                    <Grocery key={g._id} g={g} removeGrocery={() => removeGrocery(g._id)} updateGrocery={updateGrocery} />
                )
                )}
            </ul>
            
        </div>
    )
};
