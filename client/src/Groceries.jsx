import { useState, useEffect } from "react";
import api from './api/api';
import { useNavigate } from 'react-router-dom';

export default function Groceries() {
    const [groceries, setGroceries] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchGroceries = async () => {
            const res = await api.get('api/groceries');
            setGroceries(res.data);
        };
        fetchGroceries();
    }, []);
    const handleLogout = async () => {
        try {
            await api.post('/api/logout');
            navigate('/login');
        } catch (err) {
            console.error("ログアウト失敗", err);
            alert("ログアウトに失敗しました");
        }
    };
    return (
        <div>
            <h1>商品一覧</h1>
            <ul>
                {groceries.map(g => <li key={g._id}>{g.name}-{g.quantity}</li>)}
            </ul>
            <button onClick={handleLogout}>ログアウト</button>
        </div>
    )
}