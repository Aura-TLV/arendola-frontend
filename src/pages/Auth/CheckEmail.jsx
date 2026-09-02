import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
//import LanguageSwitcher from '../../components/LanguageSwitcher.jsx'

export default function CheckEmail() {
  const { t } = useTranslation()
  const [search] = useSearchParams()
  const location = useLocation()
  const email =
    search.get('email') ||
    (location.state && location.state.email) ||
    'name@example.com'

  const [countdown, setCountdown] = useState(60)
  const canResend = countdown === 0

  useEffect(() => {
    if (countdown === 0) return
    const t = setInterval(() => setCountdown((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [countdown])

  const handleResend = (e) => {
    e.preventDefault()
    if (!canResend) return
    setCountdown(60)
  }

  return (
    <main className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="auth card shadow-sm border-0 rounded-4 w-100" style={{ maxWidth: '560px' }}>
        <div className="card-body p-4 p-md-5">

        

          <h1 className="auth-title mb-1">{t('checkEmail.title')}</h1>
          <p className="auth-subtitle mb-4">
            {t('checkEmail.subtitle')}
            <span className="fw-semibold">{email}</span>
          </p>

          {!canResend ? (
            <p className="text-muted mb-4">
              {t('checkEmail.resendIn')}
              <span className="fw-semibold">{countdown} {t('checkEmail.sec')}</span>
            </p>
          ) : (
            <div className="d-grid mb-4">
              <button className="btn btn-outline-secondary" onClick={handleResend}>
                {t('checkEmail.resend')}
              </button>
            </div>
          )}

          <a href={`mailto:${email}`} className="btn btn-brand w-100 py-2">
            {t('checkEmail.openClient')}
          </a>
        </div>
      </div>
    </main>
  )
}
