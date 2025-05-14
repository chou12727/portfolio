import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/api";

export default function LoginForm() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/login", formData, {
            });
            navigate("/groceries");
        } catch (err) {
            console.error(err);
            alert("ログインに失敗しました：" + (err.response?.data?.error || err.message));
        }
    };

    return (
        <>
            <form onSubmit={handleLogin}>
                <label htmlFor="username">ユーザ名:</label>
                <input
                    onChange={handleChange}
                    type="text"
                    name="username"
                    value={formData.username}
                    required
                />

                <label htmlFor="password">パスワード:</label>
                <input
                    onChange={handleChange}
                    type="password"
                    name="password"
                    value={formData.password}
                    required
                />

                <button type="submit">ログイン</button>
            </form>
        </>
    );
}
