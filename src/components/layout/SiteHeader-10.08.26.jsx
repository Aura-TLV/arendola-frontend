// SiteHeader.jsx (твой компонент)
import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DateRangePanel from '../listing/DateRangePanel.jsx';
import logo from '../../assets/img/Logo-Arendola.png';

const RU_MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

function formatMonthsShort(selectedSet) {
  const values = Array.from(selectedSet || []);
  if (values.length === 0) return null;

  const items = values
    .map((v) => {
      const [y, m] = v.split('-').map(Number);
      return { y, m };
    })
    .sort((a, b) => (a.y - b.y) || (a.m - b.m));

  const byYear = new Map();
  for (const it of items) {
    if (!byYear.has(it.y)) byYear.set(it.y, []);
    byYear.get(it.y).push(it.m);
  }

  const yearParts = [];

  for (const [year, months] of byYear.entries()) {
    const uniq = Array.from(new Set(months)).sort((a, b) => a - b);

    const chunks = [];
    let start = uniq[0];
    let prev = uniq[0];

    for (let i = 1; i < uniq.length; i++) {
      const cur = uniq[i];
      if (cur === prev + 1) {
        prev = cur;
      } else {
        chunks.push([start, prev]);
        start = cur;
        prev = cur;
      }
    }
    chunks.push([start, prev]);

    const chunkText = chunks.map(([a, b]) => {
      if (a === b) return RU_MONTHS_SHORT[a - 1];
      return `${RU_MONTHS_SHORT[a - 1]}–${RU_MONTHS_SHORT[b - 1]}`;
    });

    yearParts.push(`${chunkText.join(', ')} ${year}`);
  }

  return yearParts.join(' · ');
}

function formatDateShort(iso) {
  // iso: YYYY-MM-DD
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${RU_MONTHS_SHORT[m - 1]}`;
}

function flexSuffix(flexKey) {
  // exact -> пусто, остальные -> " ±1" / " ±2" ...
  if (!flexKey || flexKey === 'exact') return '';
  if (flexKey === 'plus1') return ' ±1';
  if (flexKey === 'plus2') return ' ±2';
  if (flexKey === 'plus3') return ' ±3';
  if (flexKey === 'plus7') return ' ±7';
  if (flexKey === 'plus14') return ' ±14';
  return '';
}

export default function SiteHeader() {
  const [isDateOpen, setIsDateOpen] = useState(false);

  const [when, setWhen] = useState({
    mode: null, // 'dates' | 'months' | null
    flex: 'exact', // ✅ теперь реально используется
    dates: { from: null, to: null }, // ISO YYYY-MM-DD
    months: {
      rentMonths: 1,
      selected: new Set(), // Set<YYYY-MM>
      start: null, // YYYY-MM | null
    },
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const { i18n, t } = useTranslation();
  const currentLang = (i18n.language || 'ru').startsWith('en') ? 'en' : 'ru';

  const dateToggleRef = useRef(null);
  const panelRef = useRef(null);

  const authToggleRef = useRef(null);
  const authMenuRef = useRef(null);

  const helpToggleRef = useRef(null);
  const helpMenuRef = useRef(null);

  const navigate = useNavigate();

  const [guestsCount, setGuestsCount] = useState(5);

  const handleDateToggleClick = (e) => {
    e.stopPropagation();
    setIsDateOpen((prev) => !prev);
  };

  const handleAuthToggleClick = (e) => {
    e.stopPropagation();
    setIsHelpOpen(false);
    setIsAuthOpen((prev) => !prev);
  };

  const handleHelpToggleClick = (e) => {
    e.stopPropagation();
    setIsAuthOpen(false);
    setIsHelpOpen((prev) => !prev);
  };

  const handleSignIn = () => {
    setIsAuthOpen(false);
    navigate('/login');
  };

  const handleSignUp = () => {
    setIsAuthOpen(false);
    navigate('/register');
  };

  const handleFavoritesClick = () => navigate('/favorites');
  const handleNotificationsClick = () => navigate('/notifications');
  const handleRentOutClick = () => navigate('/host/new');

  const handleHelpClick = () => {
    setIsHelpOpen(false);
    navigate('/help');
  };

  const handleFeedbackClick = () => {
    setIsHelpOpen(false);
    navigate('/feedback');
  };

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

  const whenLabel = useMemo(() => {
    if (!when.mode) return t('header.datesLabel');

    if (when.mode === 'dates') {
      const { from, to } = when.dates;
      if (!from || !to) return t('header.datesLabel');

      const base = `${formatDateShort(from)} - ${formatDateShort(to)}`;
      return base + flexSuffix(when.flex);
    }

    if (when.mode === 'months') {
      const size = when.months.selected?.size || 0;
      if (size === 0) return t('header.datesLabel');

      const text = formatMonthsShort(when.months.selected);
      return text || t('header.datesLabel');
    }

    return t('header.datesLabel');
  }, [when, t]);

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

  useEffect(() => {
    if (!isHelpOpen) return;

    const handleClickOutsideHelp = (e) => {
      if (!helpToggleRef.current || !helpMenuRef.current) return;

      const clickedOnToggle = helpToggleRef.current.contains(e.target);
      const clickedInsideMenu = helpMenuRef.current.contains(e.target);

      if (clickedOnToggle || clickedInsideMenu) return;
      setIsHelpOpen(false);
    };

    document.addEventListener('click', handleClickOutsideHelp);
    return () => document.removeEventListener('click', handleClickOutsideHelp);
  }, [isHelpOpen]);

  return (
    <>
      <header className="listing-header border-bottom">
        <div className="container-xxl d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center me-2">
            <a href="#" className="brand-logo-link">
              <img src={logo} alt="arendóla" className="brand-logo-img" />
            </a>
          </div>

          <form className="listing-search mx-auto d-flex align-items-center">
            <div className="search-line d-flex align-items-center">
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
                {whenLabel}
              </div>

              <span className="search-divider"></span>

              <div className="search-item">
                {guestsCount} {t('header.guestsWord')}
              </div>
            </div>

            <button type="submit" className="search-submit-btn" aria-label={t('header.searchAria')}>
              <i className="bi bi-search"></i>
            </button>
          </form>

          <div className="listing-header-actions d-flex align-items-center gap-2 flex-wrap justify-content-end">
            <button
              className="btn btn-icon"
              type="button"
              aria-label={t('header.favAria')}
              data-tooltip={t('header.favAria')}
              onClick={handleFavoritesClick}
            >
              <i className="bi bi-heart"></i>
            </button>

            <button
              className="btn btn-icon d-none d-md-inline-flex"
              type="button"
              aria-label={t('header.notificationsAria')}
              data-tooltip={t('header.notificationsAria')}
              onClick={handleNotificationsClick}
            >
              <i className="bi bi-bell"></i>
            </button>

            <button className="btn btn-brand listing-cta" type="button" onClick={handleRentOutClick}>
              {t('header.rentOut')}
            </button>

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
                <div className="header-auth-menu" ref={authMenuRef}>
                  <div className="header-auth-row d-flex align-items-center justify-content-center gap-1">
                    <button type="button" className="header-auth-link" onClick={handleSignIn}>
                      {t('auth.login.title')}
                    </button>
                    <span className="header-auth-divider">/</span>
                    <button type="button" className="header-auth-link" onClick={handleSignUp}>
                      {t('auth.register.submit')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="header-help-wrapper position-relative d-none d-md-inline-flex">
              <button
                className="btn btn-icon"
                type="button"
                aria-label={t('header.helpAria')}
                data-tooltip={t('header.helpAria')}
                ref={helpToggleRef}
                onClick={handleHelpToggleClick}
              >
                <i className="bi bi-question-circle"></i>
              </button>

              {isHelpOpen && (
                <div className="header-auth-menu rounded-2" ref={helpMenuRef}>
                  <button type="button" className="header-auth-item" onClick={handleHelpClick}>
                    {t('header.helpAria') || 'Помощь'}
                  </button>
                  <button type="button" className="header-auth-item" onClick={handleFeedbackClick}>
                    {t('header.feedbackAria') || 'Обратная связь'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {isDateOpen && (
        <DateRangePanel ref={panelRef} when={when} onWhenChange={setWhen} />
      )}
    </>
  );
}
