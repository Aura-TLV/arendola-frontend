import { Routes, Route } from 'react-router-dom'
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import Restore from './pages/Auth/Restore.jsx'
import CheckEmail from './pages/Auth/CheckEmail.jsx'
import ConfirmEmail from './pages/Auth/ConfirmEmail.jsx'
import NewPassword from './pages/Auth/NewPassword.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />         {/* временно, пока нет главной */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/restore" element={<Restore />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/confirm-email" element={<ConfirmEmail />} />
      <Route path="/new-password" element={<NewPassword />} />
    </Routes>
  )
}
