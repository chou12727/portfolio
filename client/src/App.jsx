import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm'
import GroceriesList from './GroceriesList';
import Appbar from './Appbar';
import api from './api/api';
import { useState, useEffect } from 'react';
import EnhancedTable from './GroceryTable';
import Toolbar from '@mui/material/Toolbar';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/api/check-auth');
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);
  return (
    <Router>
      <Appbar user={user} setUser={setUser} />
      <Toolbar />
      <main style={{ paddingTop: '45px', height: 'calc(100vh - 45px)' }}>
        <Routes>
          <Route path='/' element={<EnhancedTable user={user} />} />
          <Route path='/groceries' element={<EnhancedTable user={user} />} />
          <Route path='/login' element={<LoginForm setUser={setUser} />} />
          <Route path='/register' element={<RegisterForm setUser={setUser} />} />
          <Route path='/table' element={<EnhancedTable />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
