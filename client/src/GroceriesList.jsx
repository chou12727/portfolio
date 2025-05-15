import { useState, useEffect } from "react";
import api from './api/api';
import { useNavigate } from 'react-router-dom';
import Grocery from "./Grocery";
import NewGroceryForm from './NewGroceryForm';

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

    const handleLogout = async () => {
        try {
            await api.post('/api/logout');
            navigate('/login');
        } catch (error) {
            const message = error.response?.data?.error || "ログアウトに失敗しました"
            alert(message);
        }
    };

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
    }

    return (
        <div>
            <h1>商品一覧</h1>
            <ul>
                {groceries.map(g => (
                    <Grocery key={g._id} g={g} removeGrocery={() => removeGrocery(g._id)} updateGrocery={updateGrocery} />
                )
                )}
            </ul>
            <NewGroceryForm addGrocery={addGrocery} />
            <button onClick={handleLogout}>ログアウト</button>
        </div>
    )
};
