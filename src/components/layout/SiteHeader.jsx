import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DateRangePanel from '../listing/DateRangePanel.jsx';
import logo from '../../assets/img/Logo-Arendola.png';

export default function SiteHeader() {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const { i18n, t } = useTranslation();
  const currentLang = (i18n.language || 'ru').startsWith('en') ? 'en' : 'ru';

  const dateToggleRef = useRef(null);
  const panelRef = useRef(null);

  const authToggleRef = useRef(null);
  const authMenuRef = useRef(null);

  const navigate = useNavigate();

  const [guestsCount, setGuestsCount] = useState(5); // пока просто 5


  const handleDateToggleClick = (e) => {
    e.stopPropagation();
    setIsDateOpen((prev) => !prev);
  };

  const handleAuthToggleClick = (e) => {
    e.stopPropagation();
    setIsAuthOpen((prev) => !prev);
  };

  const handleSignIn = () => {
    setIsAuthOpen(false);
    navigate('/login');
  };

  const handleSignUp = () => {
    setIsAuthOpen(false);
    navigate('/register');
  };

  // смена языка
  const handleLangChange = (lng) => {
    if (lng === currentLang) return;
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
  };

  useEffect(() => {
    if (!isDateOpen) return;

    const handleClickOutside = (e) => {
      if (!panelRef.current || !dateToggleRef.current) return;

      const clickedInsidePanel = panelRef.current.contains(e.target);
      const clickedOnToggle = dateToggleRef.current.contains(e.target);

      if (clickedInsidePanel || clickedOnToggle) return;
      setIsDateOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDateOpen]);

  useEffect(() => {
    if (!isAuthOpen) return;

    const handleClickOutsideAuth = (e) => {
      if (!authToggleRef.current || !authMenuRef.current) return;

      const clickedOnToggle = authToggleRef.current.contains(e.target);
      const clickedInsideMenu = authMenuRef.current.contains(e.target);

      if (clickedOnToggle || clickedInsideMenu) return;
      setIsAuthOpen(false);
    };

    document.addEventListener('click', handleClickOutsideAuth);
    return () => document.removeEventListener('click', handleClickOutsideAuth);
  }, [isAuthOpen]);

  return (
    <>
      <header className="listing-header border-bottom">
        <div className="container-xxl d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center me-2">
            <a href="#" className="brand-logo-link">
              <img
                src={logo}
                alt="arendóla"
                className="brand-logo-img"
              />
            </a>
          </div>

          {/* Поисковая строка */}
          <form className="listing-search mx-auto d-flex align-items-center">
            <div className="search-line d-flex align-items-center">
              {/* Поле ввода города / района / адреса */}
              <div className="search-item search-item-input">
                <input
                  type="text"
                  className="search-input"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t('header.regionLabel')}
                  onFocus={(e) => {
                    e.target.placeholder = '';
                  }}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      e.target.placeholder = t('header.regionLabel');
                    }
                  }}
                />
              </div>

              <span className="search-divider d-none d-md-inline-block"></span>

              <div
                className="search-item search-item-dates d-none d-md-flex"
                ref={dateToggleRef}
                onClick={handleDateToggleClick}
              >
                {t('header.datesLabel')}
              </div>

              <span className="search-divider"></span>

              <div className="search-item">
                {guestsCount} {t('header.guestsWord')}
              </div>

            </div>

            <button
              type="submit"
              className="search-submit-btn"
              aria-label={t('header.searchAria')}
            >
              <i className="bi bi-search"></i>
            </button>
          </form>

          {/* Правый блок действий */}
          <div className="listing-header-actions d-flex align-items-center gap-2 flex-wrap justify-content-end">
            {/* Избранное / Мой выбор */}
            <button
              className="btn btn-icon"
              type="button"
              aria-label={t('header.favAria')}
              data-tooltip={t('header.favAria')}
            >
              <i className="bi bi-heart"></i>
            </button>

            {/* Уведомления */}
            <button
              className="btn btn-icon d-none d-md-inline-flex"
              type="button"
              aria-label={t('header.notificationsAria')}
              data-tooltip={t('header.notificationsAria')}
            >
              <i className="bi bi-bell"></i>
            </button>

            {/* CTA */}
            <button className="btn btn-brand listing-cta" type="button">
              {t('header.rentOut')}
            </button>

            {/* переключатель языка */}
            <div className="header-lang-switch">
              <button
                type="button"
                className={`header-lang-btn ${currentLang === 'ru' ? 'header-lang-btn-active' : ''}`}
                onClick={() => handleLangChange('ru')}
              >
                RU
              </button>
              <span className="header-lang-separator">|</span>
              <button
                type="button"
                className={`header-lang-btn ${currentLang === 'en' ? 'header-lang-btn-active' : ''}`}
                onClick={() => handleLangChange('en')}
              >
                EN
              </button>
            </div>

            {/* Профиль */}
            <div className="header-auth-wrapper position-relative">
              <button
                className="btn btn-icon"
                type="button"
                aria-label={t('header.profileAria')}
                data-tooltip={t('header.profileAria')}
                ref={authToggleRef}
                onClick={handleAuthToggleClick}
              >
                <i className="bi bi-person"></i>
              </button>

              {isAuthOpen && (
                <div
                  className="header-auth-menu"
                  ref={authMenuRef}
                >
                  <button
                    type="button"
                    className="header-auth-item"
                    onClick={handleSignIn}
                  >
                    {t('auth.login.title')}
                  </button>
                  <button
                    type="button"
                    className="header-auth-item"
                    onClick={handleSignUp}
                  >
                    {t('auth.register.submit')}
                  </button>
                </div>
              )}
            </div>

            {/* Помощь */}
            <button
              className="btn btn-icon d-none d-md-inline-flex"
              type="button"
              aria-label={t('header.helpAria')}
              data-tooltip={t('header.helpAria')}
            >
              <i className="bi bi-question-circle"></i>
            </button>

            {/* Сообщения */}
            <button
              className="btn btn-icon d-none d-md-inline-flex"
              type="button"
              aria-label={t('header.messagesAria')}
              data-tooltip={t('header.messagesAria')}
            >
              <i className="bi bi-chat-left-text"></i>
            </button>
          </div>
        </div>
      </header>

      {isDateOpen && <DateRangePanel ref={panelRef} />}
    </>
  );
}
