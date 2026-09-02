import { useState } from 'react'
// Если токены в ссылке (например /new-password/:uid/:token), раскомментирую:
// import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
//import LanguageSwitcher from '../../components/LanguageSwitcher.jsx'

export default function NewPassword() {
  const { t } = useTranslation()
  // const { uid, token } = useParams() // если используется роут с параметрами
  const [pwd, setPwd] = useState('')
  const [pwd2, setPwd2] = useState('')
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (pwd.length < 10 || pwd2.length < 10) {
      setError('Пароль должен быть не короче 10 символов')
      return
    }
    if (pwd !== pwd2) {
      setError('Пароли не совпадают')
      return
    }

    try {
      setLoading(true)
      setSuccess('Пароль изменен')
      setPwd('')
      setPwd2('')
    } catch {
      setError('Не удалось изменить пароль. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }

  }

  return (
    <main className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="auth card shadow-sm border-0 rounded-4 w-100" style={{ maxWidth: '560px' }}>
        <div className="card-body p-4 p-md-5">

          
          <h1 className="auth-title mb-1">{t('newPassword.title')}</h1>
          <p className="auth-subtitle mb-4">{t('newPassword.subtitle')}</p>

          <form onSubmit={handleSubmit}>
            {/* Новый пароль */}
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">{t('newPassword.new')}</label>
              <div className="position-relative">
                <input
                  id="newPassword"
                  type={show1 ? 'text' : 'password'}
                  className="form-control pe-5"
                  placeholder="**********"
                  minLength={10}
                  value={pwd}
                  onChange={(e) => { setPwd(e.target.value); setError(''); setSuccess('') }}
                  required
                />
                <button
                  type="button"
                  className="eye-toggle"
                  aria-label={show1 ? 'Скрыть пароль' : 'Показать пароль'}
                  onClick={() => setShow1(v => v ? false : true)}
                >
                  <i className={`bi ${show1 ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Повторите пароль */}
            <div className="mb-2">
              <label htmlFor="repeatPassword" className="form-label">{t('newPassword.repeat')}</label>
              <div className="position-relative">
                <input
                  id="repeatPassword"
                  type={show2 ? 'text' : 'password'}
                  className="form-control pe-5"
                  placeholder="**********"
                  minLength={10}
                  value={pwd2}
                  onChange={(e) => { setPwd2(e.target.value); setError(''); setSuccess('') }}
                  required
                />
                <button
                  type="button"
                  className="eye-toggle"
                  aria-label={show2 ? 'Скрыть пароль' : 'Показать пароль'}
                  onClick={() => setShow2(v => v ? false : true)}
                >
                  <i className={`bi ${show2 ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Ошибка */}
            {error && <div className="form-error mb-3">{error}</div>}

            <button type="submit" className="btn btn-brand w-100 py-2" disabled={loading}>
              {loading ? t('newPassword.saving') : t('newPassword.save')}
            </button>

            {/* Успех */}
            {success && <div className="form-success mt-3">{success}</div>}
          </form>
        </div>
      </div>
    </main>
  )
}
