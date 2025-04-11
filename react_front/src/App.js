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
import CompHome from './homeClients/HomeClients.js';
import HorasDisponibles from './quotes/HorasDisponibles.js';
import CompShowCitasUsuario from './user/quoteUser.js';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/createUser" element={<CreateUsers />} />
        <Route path="/createQuote" element={<CreateQuotes />} />
        <Route path="/listUsers" element={<PrivateRoute><CompShowUser /></PrivateRoute>} />
        <Route path="/homeClients" element={<PrivateRoute><CompHome /></PrivateRoute>} />
        <Route path="/listQuotes" element={<PrivateRoute><CompShowQuotes /></PrivateRoute>} />
        <Route path="/quotesCalendar" element={<PrivateRoute><QuotesCalendar /></PrivateRoute>} />
        <Route path="/horas-disponibles" element={<PrivateRoute><HorasDisponibles /></PrivateRoute>} />
        <Route path="/quoteUser" element={<PrivateRoute><CompShowCitasUsuario /></PrivateRoute>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
