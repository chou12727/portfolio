import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Groceries from './Groceries';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/groceries' element={<Groceries />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/register' element={<RegisterForm />} />

      </Routes>
    </Router>
  )
}

export default App
