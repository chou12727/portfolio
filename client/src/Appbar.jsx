import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import api from './api/api';

export default function Appbar({ user,setUser }) {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await api.post('/api/logout');
            setUser(null)
            navigate('/login');
        } catch (error) {
            const message = error.response?.data?.error || "ログアウトに失敗しました"
            alert(message);
        }
    };
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {user?.username}の冷蔵庫
                    </Typography>
                    {
                        !user && (<><Button color="inherit" onClick={() => navigate("/register")}>Register</Button>
                            <Button color="inherit" onClick={() => navigate("/login")}>Login</Button></>)
                    }
                    {user && <Button color="inherit" onClick={handleLogout}>Logout</Button>}

                </Toolbar>
            </AppBar>
        </Box>
    );
}