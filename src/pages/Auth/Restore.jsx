import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
//import LanguageSwitcher from '../../components/LanguageSwitcher.jsx'

export default function Restore() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const navigate = useNavigate()              

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: axios.post('/api/auth/password/reset/', { email })
    navigate(`/check-email?email=${encodeURIComponent(email)}`)
  }

  return (
    <main className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="auth card shadow-sm border-0 rounded-4 w-100" style={{ maxWidth: '560px' }}>
        <div className="card-body p-4 p-md-5">

          <h1 className="auth-title mb-1">{t('auth.restore.title')}</h1>
          <p className="auth-subtitle mb-4">{t('auth.restore.subtitle')}</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">{t('auth.restore.email')}</label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="user@example.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <button type="submit" className="btn btn-brand w-100 py-2">{t('auth.restore.submit')}</button>

            <p className="text-muted mt-3 mb-0">{t('auth.restore.spamNote')}</p>

            <div className="mt-3">
              <Link to="/login" className="link-brand">{t('auth.restore.returnLogin')}</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
