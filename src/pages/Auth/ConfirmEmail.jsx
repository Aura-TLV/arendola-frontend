import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
//import LanguageSwitcher from '../../components/LanguageSwitcher.jsx'

export default function ConfirmEmail() {
  const { t } = useTranslation()
  const [search] = useSearchParams()
  const next = search.get('next') || '/account'

  return (
    <main className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="auth card shadow-sm border-0 rounded-4 w-100" style={{ maxWidth: '560px' }}>
        <div className="card-body p-4 p-md-5">

          

          <h1 className="auth-title mb-1">{t('confirmEmail.title')}</h1>
          <p className="auth-subtitle mb-4">{t('confirmEmail.subtitle')}</p>

          <div className="d-grid gap-2">
            <Link to={next} className="btn btn-brand w-100 py-2">{t('confirmEmail.toAccount')}</Link>
            <Link to="/login" className="btn btn-outline-secondary w-100 py-2">{t('confirmEmail.login')}</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
