import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FooterLink({ to, children }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className="footer-link">
      {children}
    </a>
  );
}

export default function Footer() {
  // для мобильных аккордеонов
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (key) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  return (
    <footer className="site-footer border-top mt-auto">
      <div className="container-xxl py-4">

        {/* ===== DESKTOP: 4 колонки ===== */}
        <div className="footer-columns d-none d-md-flex justify-content-between gap-4">
          {/* Колонка 1 — Компания */}
          <div className="footer-column">
            <h5 className="footer-title">Компания</h5>
            <ul className="list-unstyled footer-list">
              <li><FooterLink to="/about">О платформе</FooterLink></li>
              <li><FooterLink to="/legal">Правовая информация</FooterLink></li>
              <li><FooterLink to="/eco">Экологическая инициатива</FooterLink></li>
              <li><FooterLink to="/sitemap">Карта сайта</FooterLink></li>
              <li><FooterLink to="/referral">Реферальная программа</FooterLink></li>
            </ul>
          </div>

          {/* Колонка 2 - Гостям */}
          <div className="footer-column">
            <h5 className="footer-title">Гостям</h5>
            <ul className="list-unstyled footer-list">
              <li>
                <FooterLink to="/help/guests/how-to-book">
                  Как бронировать жильё
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/help/guests/guarantees">
                  Гарантии
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/help/guests">
                  Помощь гостям
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/blog/guests">
                  Блог для гостей
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* Колонка 3 - Хозяевам */}
          <div className="footer-column">
            <h5 className="footer-title">Хозяевам</h5>
            <ul className="list-unstyled footer-list">
              <li>
                <FooterLink to="/host/new">
                  Разместить объявление
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/help/hosts/payments">
                  Выплаты и комиссии
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/help/hosts">
                  Помощь хозяевам
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/legal/host-offer">
                  Оферта для хозяев
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/promo">
                  Акции
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/blog/hosts">
                  Блог для хозяев
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* Колонка 4 - Поддержка и безопасность */}
          <div className="footer-column">
            <h5 className="footer-title">Поддержка и безопасность</h5>

            <div className="mb-2">
              <div className="footer-subtitle">Поддержка</div>
              <ul className="list-unstyled footer-list">
                <li><FooterLink to="/help">Помощь</FooterLink></li>
                <li><FooterLink to="/feedback">Обратная связь</FooterLink></li>
              </ul>
            </div>

            <div className="mb-2">
              <div className="footer-subtitle">Безопасность</div>
              <p className="footer-text">
                Ваши данные защищены ведущими платёжными системами.
              </p>
            </div>

            <div>
              <div className="footer-subtitle">Соцсети</div>
              <ul className="list-unstyled footer-list footer-social-list">
                <li>
                    <a
                    href="https://vk.com"
                    className="footer-social-link footer-social-link-vk"
                    target="_blank"
                    rel="noreferrer"
                    >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.84 17.5c-4.76 0-7.45-3.25-7.56-8.7h2.39c.08 4.03 1.86 5.78 3.3 6.13V8.8h2.26v3.5c1.42-.15 2.91-1.8 3.42-3.5h2.26c-.39 2-1.97 3.65-3.07 4.25 1.1.45 2.9 1.9 3.59 4.45h-2.46c-.56-1.73-1.97-3.03-3.74-3.2v3.2h-.79z"/>
                    </svg>
                    </a>
                </li>
                <li>
                    <a
                    href="https://t.me"
                    className="footer-social-link footer-social-link-tg"
                    target="_blank"
                    rel="noreferrer"
                    >
                    <i className="bi bi-telegram"></i>
                    </a>
                </li>
                <li>
                    <a
                    href="https://youtube.com"
                    className="footer-social-link footer-social-link-yt"
                    target="_blank"
                    rel="noreferrer"
                    >
                    <i className="bi bi-youtube"></i>
                    </a>
                </li>
                </ul>


            </div>
          </div>
        </div>

        {/* ===== MOBILE: аккордеоны ===== */}
        <div className="footer-accordions d-md-none">
          {/* Компания */}
          <div className="footer-accordion">
            <button
              type="button"
              className="footer-accordion-toggle"
              onClick={() => toggleSection('company')}
            >
              Компания
            </button>
            {openSection === 'company' && (
              <ul className="list-unstyled footer-list mt-2">
                <li><FooterLink to="/about">О платформе</FooterLink></li>
                <li><FooterLink to="/legal">Правовая информация</FooterLink></li>
                <li><FooterLink to="/eco">Экологическая инициатива</FooterLink></li>
                <li><FooterLink to="/sitemap">Карта сайта</FooterLink></li>
                <li><FooterLink to="/referral">Реферальная программа</FooterLink></li>
              </ul>
            )}
          </div>

          {/* Гостям */}
          <div className="footer-accordion">
            <button
              type="button"
              className="footer-accordion-toggle"
              onClick={() => toggleSection('guests')}
            >
              Гостям
            </button>
            {openSection === 'guests' && (
              <ul className="list-unstyled footer-list mt-2">
                <li>
                  <FooterLink to="/help/guests/how-to-book">
                    Как бронировать жильё
                  </FooterLink>
                </li>
                <li>
                  <FooterLink to="/help/guests/guarantees">
                    Гарантии
                  </FooterLink>
                </li>
                <li>
                  <FooterLink to="/help/guests">
                    Помощь гостям
                  </FooterLink>
                </li>
                <li>
                  <FooterLink to="/blog/guests">
                    Блог для гостей
                  </FooterLink>
                </li>
              </ul>
            )}
          </div>

          {/* Хозяевам */}
          <div className="footer-accordion">
            <button
              type="button"
              className="footer-accordion-toggle"
              onClick={() => toggleSection('hosts')}
            >
              Хозяевам
            </button>
            {openSection === 'hosts' && (
              <ul className="list-unstyled footer-list mt-2">
                <li>
                  <FooterLink to="/host/new">
                    Разместить объявление
                  </FooterLink>
                </li>
                <li>
                  <FooterLink to="/help/hosts/payments">
                    Выплаты и комиссии
                  </FooterLink>
                </li>
                <li>
                  <FooterLink to="/help/hosts">
                    Помощь хозяевам
                  </FooterLink>
                </li>
                <li>
                  <FooterLink to="/legal/host-offer">
                    Оферта для хозяев
                  </FooterLink>
                </li>
                <li>
                  <FooterLink to="/promo">
                    Акции
                  </FooterLink>
                </li>
                <li>
                  <FooterLink to="/blog/hosts">
                    Блог для хозяев
                  </FooterLink>
                </li>
              </ul>
            )}
          </div>

          {/* Поддержка и безопасность */}
          <div className="footer-accordion">
            <button
              type="button"
              className="footer-accordion-toggle"
              onClick={() => toggleSection('support')}
            >
              Поддержка и безопасность
            </button>
            {openSection === 'support' && (
              <div className="mt-2">
                <div className="mb-2">
                  <div className="footer-subtitle">Поддержка</div>
                  <ul className="list-unstyled footer-list">
                    <li><FooterLink to="/help">Помощь</FooterLink></li>
                    <li><FooterLink to="/feedback">Обратная связь</FooterLink></li>
                  </ul>
                </div>

                <div className="mb-2">
                  <div className="footer-subtitle">Безопасность</div>
                  <p className="footer-text">
                    Ваши данные защищены ведущими платёжными системами.
                  </p>
                </div>

                <div>
                  <div className="footer-subtitle">Соцсети</div>
                  <ul className="list-unstyled footer-list footer-social-list">
                    <li>
                        <a
                        href="https://vk.com"
                        className="footer-social-link footer-social-link-vk"
                        target="_blank"
                        rel="noreferrer"
                        >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.84 17.5c-4.76 0-7.45-3.25-7.56-8.7h2.39c.08 4.03 1.86 5.78 3.3 6.13V8.8h2.26v3.5c1.42-.15 2.91-1.8 3.42-3.5h2.26c-.39 2-1.97 3.65-3.07 4.25 1.1.45 2.9 1.9 3.59 4.45h-2.46c-.56-1.73-1.97-3.03-3.74-3.2v3.2h-.79z"/>
                        </svg>
                        </a>
                    </li>
                    <li>
                        <a
                        href="https://t.me"
                        className="footer-social-link footer-social-link-tg"
                        target="_blank"
                        rel="noreferrer"
                        >
                        <i className="bi bi-telegram"></i>
                        </a>
                    </li>
                    <li>
                        <a
                        href="https://youtube.com"
                        className="footer-social-link footer-social-link-yt"
                        target="_blank"
                        rel="noreferrer"
                        >
                        <i className="bi bi-youtube"></i>
                        </a>
                    </li>
                    </ul>


                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Нижняя полоса ===== */}
      {/* Desktop текст */}
      <div className="footer-bottom border-top d-none d-md-block">
        <div className="container-xxl py-3 small text-muted">
          <div>
            © 2025 Арендола - российский сервис аренды жилья от месяца до года.
          </div>
          <div>
            Использование сайта означает согласие с Пользовательским соглашением
            и Политикой обработки персональных данных.
          </div>
        </div>
      </div>

      {/* Mobile текст */}
      <div className="footer-bottom border-top d-md-none">
        <div className="container-xxl py-3 small text-muted">
          <div>
            © 2024 Арендола - российский сервис аренды жилья от месяца до года.
          </div>
          <div>
            Пользовательское соглашение · Обработка персональных данных
          </div>
        </div>
      </div>
    </footer>
  );
}
