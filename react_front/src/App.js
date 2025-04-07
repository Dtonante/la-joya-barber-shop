import { BrowserRouter, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import PrivateRoute from './components/PrivateRoute.js';
import CompShowUser from './user/ShowUsers.js';
import Login from './login/LoginUser.js';
import CreateUsers from './login/CreateUser.js';
import CreateQuotes from './quotes/CreateQuotes.js';
import CompShowQuotes from './quotes/CompShowQuotes.js';
import QuotesCalendar from './quotes/QuotesCalendar.js';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/createUser" element={<CreateUsers />} />
        <Route path="/createQuote" element={<CreateQuotes />} />
        <Route path="/listUsers" element={<PrivateRoute><CompShowUser /></PrivateRoute>} />
        <Route path="/listQuotes" element={<PrivateRoute><CompShowQuotes /></PrivateRoute>} />
        <Route path="/quotesCalendar" element={<PrivateRoute><QuotesCalendar /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
