import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from './api/api';

export default function RegisterForm({setUser}) {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" })
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/register", formData);
            alert(response.data.message);
            setUser(response.data.user);
            navigate("/groceries");
        } catch (err) {
            console.error(err)
            alert("登録に失敗しました：" + err.response?.data?.error || err.message);
        }
    };
    return (
        <>
            <form onSubmit={handleRegister} >
                <label htmlFor="username">ユーザ名:</label>
                <input onChange={handleChange} type="text" name="username" value={formData.username} />
                <label htmlFor="email">メールアドレス:</label>
                <input onChange={handleChange} type="email" name="email" value={formData.email} />
                <label htmlFor="password">パスワード:</label>
                <input onChange={handleChange} type="password" name="password" value={formData.password} />
                <button type="submit" >ユーザ登録</button>

            </form>


        </>
    )
}