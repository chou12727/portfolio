import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm'
import GroceriesList from './GroceriesList';


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/groceries' element={<GroceriesList />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/register' element={<RegisterForm />} />

      </Routes>
    </Router>
  )
}

export default App
