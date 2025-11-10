import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../../components/LanguageSwitcher.jsx'

export default function Login() {
  const { t } = useTranslation()
  const [showPwd, setShowPwd] = useState(false)

  return (
    <main className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="auth card shadow-sm border-0 rounded-4 w-100" style={{ maxWidth: '560px' }}>
        <div className="card-body p-4 p-md-5">

          {/* переключатель языков справа сверху временно, когда будет готов компонент меню, перенесу туда */}
          <div className="d-flex justify-content-end mb-2">
            <LanguageSwitcher />
          </div>


          <h1 className="auth-title mb-3">{t('auth.login.title')}</h1>

          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">{t('auth.login.email')}</label>
              <input id="email" type="email" className="form-control" placeholder="user@example.ru" />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">{t('auth.login.password')}</label>
              <div className="position-relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  className="form-control pe-5"
                  placeholder="**********"
                />
                <button
                  type="button"
                  className="eye-toggle"
                  aria-label="Показать пароль"
                  onClick={() => setShowPwd(v => !v)}
                >
                  <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check m-0">
                <input className="form-check-input" type="checkbox" id="remember" />
                <label className="form-check-label" htmlFor="remember">{t('auth.login.remember')}</label>
              </div>
              <Link className="link-brand" to="/restore">{t('auth.login.forgot')}</Link>
            </div>

            <button type="submit" className="btn btn-brand w-100 py-2">{t('auth.login.title')}</button>

            <div className="mt-4">
              <p className="form-help-heading mb-2">{t('auth.login.errorsTitle')}</p>
              <ul className="error-list mb-0">
                <li>{t('auth.login.errInvalidEmail')}</li>
                <li>{t('auth.login.errWrongCreds')}</li>
                <li>{t('auth.login.errNotConfirmed')}</li>
              </ul>
            </div>
          </form>

        </div>
      </div>
    </main>
  )
}
