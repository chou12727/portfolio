import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/api";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function LoginForm({ setUser }) {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/login", formData);
            setUser(response.data.user);
            navigate("/groceries");
        } catch (err) {
            console.error(err);
            alert("ログインに失敗しました：" + (err.response?.data?.error || err.message));
        }
    };

    return (
        <>
            <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', width: '100%', mt: 10, mb: -10 }}>
                ログイン
            </Typography>
            <Box component="form" onSubmit={handleLogin} sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                mt: 15
            }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* <label htmlFor="username">ユーザ名:</label> */}
                    <TextField
                        required
                        id="username-required"
                        label="ユーザ名"
                        onChange={handleChange}
                        type="text"
                        name="username"
                        value={formData.username}
                    />
                    {/* <input
                        onChange={handleChange}
                        type="text"
                        name="username"
                        value={formData.username}
                        required
                    /> */}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* <label htmlFor="password">パスワード:</label> */}
                    <TextField
                        required
                        id="password-required"
                        label="パスワード"
                        onChange={handleChange}
                        type="password"
                        name="password"
                        value={formData.password}
                    />
                    {/* <input
                        onChange={handleChange}
                        type="password"
                        name="password"
                        value={formData.password}
                        required
                    /> */}
                </Box>
                <Button variant="contained" type="submit">ログイン</Button>
            </Box>
        </>
    );
}
