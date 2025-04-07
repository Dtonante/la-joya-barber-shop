import { BrowserRouter, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import PrivateRoute from './components/PrivateRoute.js';
import CompShowEps from './user/ShowUsers.js';
import Login from './login/LoginUser.js';
import CreateUsers from './login/CreateUser.js';
import CreateQuotes from './quotes/CreateQuotes.js';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/createUser" element={<CreateUsers />} />
        <Route path="/createQuote" element={<CreateQuotes />} />
        <Route path="/dashboard" element={<PrivateRoute><CompShowEps /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
