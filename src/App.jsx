import { Routes, Route, useNavigate } from 'react-router-dom';

import AuthModalShell from './components/auth/AuthModalShell.jsx';

import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Restore from './pages/Auth/Restore.jsx';
import CheckEmail from './pages/Auth/CheckEmail.jsx';
import ConfirmEmail from './pages/Auth/ConfirmEmail.jsx';
import NewPassword from './pages/Auth/NewPassword.jsx';

import ListingPage from './pages/Listing/ListingPage.jsx';

export default function App() {
  const navigate = useNavigate();

  const handleCloseAuth = () => {
    // просто возвращаемся на главную со списком
    navigate('/');
  };

  return (
    <Routes>
      {/* Главная страница временно */}
      <Route path="/" element={<ListingPage />} />

      {/* Войти */}
      <Route
        path="/login"
        element={
          <>
            <ListingPage />
            <AuthModalShell onClose={handleCloseAuth}>
              <Login />
            </AuthModalShell>
          </>
        }
      />

      {/* Зарегистрироваться */}
      <Route
        path="/register"
        element={
          <>
            <ListingPage />
            <AuthModalShell onClose={handleCloseAuth}>
              <Register />
            </AuthModalShell>
          </>
        }
      />

      {/* Забыли пароль */}
      <Route
        path="/restore"
        element={
          <>
            <ListingPage />
            <AuthModalShell onClose={handleCloseAuth}>
              <Restore />
            </AuthModalShell>
          </>
        }
      />

      {/* Проверить почту */}
      <Route
        path="/check-email"
        element={
          <>
            <ListingPage />
            <AuthModalShell onClose={handleCloseAuth}>
              <CheckEmail />
            </AuthModalShell>
          </>
        }
      />

      {/* Подтверждение почты */}
      <Route
        path="/confirm-email"
        element={
          <>
            <ListingPage />
            <AuthModalShell onClose={handleCloseAuth}>
              <ConfirmEmail />
            </AuthModalShell>
          </>
        }
      />

      {/* Новый пароль */}
      <Route
        path="/new-password"
        element={
          <>
            <ListingPage />
            <AuthModalShell onClose={handleCloseAuth}>
              <NewPassword />
            </AuthModalShell>
          </>
        }
      />
    </Routes>
  );
}
