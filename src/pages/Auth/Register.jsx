import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
//import LanguageSwitcher from '../../components/LanguageSwitcher.jsx'

export default function Register() {
  const { t } = useTranslation()
  const [showPwd, setShowPwd] = useState(false)

  return (
    <main className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="auth card shadow-sm border-0 rounded-4 w-100" style={{ maxWidth: '560px' }}>
        <div className="card-body p-4 p-md-5">


          <h1 className="auth-title mb-3">{t('auth.register.title')}</h1>

          <form>
            {/* Имя */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">{t('auth.register.name')}</label>
              <input id="name" type="text" className="form-control" placeholder="Владимир" />
            </div>

            {/* E-mail */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">{t('auth.login.email')}</label>
              <input id="email" type="email" className="form-control" placeholder="user@example.ru" />
            </div>

            {/* Пароль */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                {t('auth.login.password')} <span className="form-hint">{t('auth.register.passwordHint')}</span>
              </label>

              <div className="position-relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  className="form-control pe-5"
                  placeholder="**********"
                />
                {/* Иконка глаза внутри поля */}
                <button
                  type="button"
                  className="eye-toggle"
                  aria-label={showPwd ? 'Скрыть пароль' : 'Показать пароль'}
                  onClick={() => setShowPwd(v => !v)}
                >
                  <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Согласие */}
            <div className="form-check mb-4">
              <input id="agree" className="form-check-input" type="checkbox" />
              <label className="form-check-label" htmlFor="agree">
                {t('auth.register.agree')}{' '}
                <a href="/terms" target="_blank" rel="noreferrer">{t('auth.register.terms')}</a>
                {' '}&{' '}
                <a href="/privacy" target="_blank" rel="noreferrer">{t('auth.register.privacy')}</a>
              </label>
            </div>

            {/* CTA */}
            <button type="submit" className="btn btn-brand w-100 py-2">{t('auth.register.submit')}</button>
          </form>

          <div className="mt-3">
            <span className="text-muted">{t('auth.register.haveAccount')}</span>{' '}
            <Link to="/login" className="fw-medium">{t('auth.register.login')}</Link>
          </div>

        </div>
      </div>
    </main>
  )
}
