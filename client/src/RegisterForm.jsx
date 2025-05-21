import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from './api/api';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function RegisterForm({ setUser }) {
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
            navigate("/");
        } catch (err) {
            console.error(err)
            alert("登録に失敗しました：" + err.response?.data?.error || err.message);
        }
    };
    return (
        <>
            <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', width: '100%', mt: 10, mb: -10 }}>
                ようこそ!
            </Typography>
            <Box component='form' onSubmit={handleRegister}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    mt: 15
                }} >
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* <label htmlFor="username">ユーザ名:</label> */}
                    <TextField
                        required
                        id="outlined-required"
                        label="ユーザ名"
                        defaultValue="Hello World"
                        onChange={handleChange} type="text" name="username" value={formData.username}
                    />
                    {/* <input onChange={handleChange} type="text" name="username" value={formData.username} /> */}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* <label htmlFor="email">メールアドレス:</label> */}
                    <TextField
                        required
                        id="outlined-required"
                        label="メールアドレス"
                        defaultValue="Hello World"
                        onChange={handleChange} type="email" name="email" value={formData.email}
                    />
                    {/* <input onChange={handleChange} type="email" name="email" value={formData.email} /> */}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* <label htmlFor="password">パスワード:</label> */}
                    <TextField
                        required
                        id="outlined-required"
                        label="パスワード"
                        defaultValue="Hello World"
                        onChange={handleChange} type="password" name="password" value={formData.password}
                    />
                    {/* <input onChange={handleChange} type="password" name="password" value={formData.password} /> */}
                </Box>
                <Button variant="contained" type="submit">ユーザ登録</Button>


            </Box>


        </>
    )
}
