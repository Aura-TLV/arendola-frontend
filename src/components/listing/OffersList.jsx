import { useTranslation } from 'react-i18next';
import img1 from '../../assets/img/ar-img-1.png';
import img1b from '../../assets/img/ar-img-1b.png';
import img1c from '../../assets/img/ar-img-1c.png';

import { useNavigate } from "react-router-dom";

export default function OffersList({ onCardHover }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      {/* Карточка 1 */}
      <article
        className="offer-card card border-0 shadow-sm mb-3"
        onMouseEnter={() => onCardHover && onCardHover(1)}
        onMouseLeave={() => onCardHover && onCardHover(null)}
        onClick={() =>
          navigate("/object/1", {
            state: {
              initialBooking: {
                tariffId: "2_5m",
                stayDays: 60,
              },
              objectData: {
                min_stay: 60,
                max_stay: 365,
                available_from: "1 января 2026",
              },
            },
          })
        }
        style={{ cursor: "pointer" }}
      >
        <div className="card-body p-3 d-flex gap-3">
          {/* Фото + карусель */}
          <div className="offer-card-photo position-relative flex-shrink-0">
            <div
              id="offerCarousel1"
              className="offer-carousel carousel slide"
              data-bs-ride="false"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={img1} className="d-block w-100" alt="Фото объекта 1" />
                </div>
                <div className="carousel-item">
                  <img src={img1b} className="d-block w-100" alt="Фото объекта 2" />
                </div>
                <div className="carousel-item">
                  <img src={img1c} className="d-block w-100" alt="Фото объекта 3" />
                </div>
              </div>

              {/* Индикаторы */}
              <div className="offer-carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#offerCarousel1"
                  data-bs-slide-to="0"
                  className="active"
                  onClick={(e) => e.stopPropagation()}
                ></button>
                <button
                  type="button"
                  data-bs-target="#offerCarousel1"
                  data-bs-slide-to="1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#offerCarousel1"
                  data-bs-slide-to="2"
                ></button>
              </div>

              {/* Стрелки */}
              <button
                className="offer-carousel-control offer-carousel-control-prev"
                type="button"
                data-bs-target="#offerCarousel1"
                data-bs-slide="prev"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="offer-carousel-control offer-carousel-control-next"
                type="button"
                data-bs-target="#offerCarousel1"
                data-bs-slide="next"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>

            <button
              className="offer-fav-btn"
              type="button"
              aria-label={t('header.favAria')}
              onClick={(e) => e.stopPropagation()}
            >
              <i className="bi bi-heart"></i>
            </button>
          </div>

          {/* Центральный блок */}
          <div className="offer-card-main flex-grow-1 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <div className="offer-type-pill">
                {t('offersCard.typeFlat1')}
              </div>

              <div className="offer-rating d-flex align-items-center gap-1">
                <i className="bi bi-star-fill"></i>
                <span className="fw-semibold">9,3</span>
                <span className="text-muted">
                  {t('offersCard.ratingReviews')}
                </span>
                <span>·</span>
                <span className="d-inline-flex align-items-center">
                  <i className="bi bi-leaf-fill offer-eco-icon"></i>
                </span>
              </div>
            </div>

            <h2 className="offer-title mb-1">
              {t('offersCard.title1')}
            </h2>

            {/* эти строки пока как заглушка-данные */}
            <div className="offer-meta mb-1">
              48 м² · 2 гостя · 4 этаж из 9
            </div>

            <div className="offer-meta mb-1">
              <i className="bi bi-geo-alt me-1"></i>
              Москва, Ленинский пр-т, 25
            </div>

            <div className="offer-meta mb-1">
              <i className="bi bi-train-front me-1"></i>
              м. Сокол · 7 мин пешком
            </div>

            <div className="offer-meta mb-2">
              <i className="bi bi-calendar-check me-1"></i>
              {t('offersCard.availableFrom')}
            </div>
          </div>

          {/* Правая колонка карточки 1 */}
          <div className="offer-card-side ms-2">
            <div className="offer-card-side-content text-end">
              <div className="offer-price mb-2">
                40 000 ₽
                <span className="offer-price-note offer-price-note-with-tooltip">
                  {t('offersCard.priceNote')}
                  <span className="offer-tooltip-trigger">
                    <i className="bi bi-lightning-charge-fill offer-tooltip-icon"></i>
                    <span className="offer-tooltip-bubble">
                      {t('offersCard.priceTooltip')}
                    </span>
                  </span>
                </span>
              </div>

              {/* Чипы сроков аренды */}
              <div className="offer-term-chips d-flex gap-2 mb-1">
                <button
                  type="button"
                  className="offer-chip offer-chip-locked btn btn-sm"
                  data-tooltip={t('offersCard.chipLockedTooltip')}
                >
                  <span className="offer-chip-text">
                    <span className="offer-chip-value">1</span>
                    <span className="offer-chip-label">{t('offersCard.monthShort')}</span>
                  </span>
                  <i className="bi bi-lock-fill offer-chip-lock"></i>
                </button>

                <button
                  type="button"
                  className="offer-chip offer-chip-active btn btn-sm"
                  data-tooltip={t('offersCard.chipMidTooltip')}
                >
                  <span className="offer-chip-text">
                    <span className="offer-chip-value">2-5</span>
                    <span className="offer-chip-label">{t('offersCard.monthShort')}</span>
                  </span>
                </button>

                <button
                  type="button"
                  className="offer-chip btn btn-sm"
                  data-tooltip={t('offersCard.chipLongTooltip')}
                >
                  <span className="offer-chip-text">
                    <span className="offer-chip-value">6+</span>
                    <span className="offer-chip-label">{t('offersCard.monthShort')}</span>
                  </span>
                </button>
              </div>

              <div className="offer-meta offer-max-term">
                {t('offersCard.maxTerm')}
              </div>
            </div>

            <button type="button" className="btn btn-request" onClick={(e) => e.stopPropagation()}>
              {t('offersCard.onRequest')}
            </button>
          </div>
        </div>
      </article>

      {/* Карточка 2 */}
      <article
        className="offer-card card border-0 shadow-sm mb-3"
        onMouseEnter={() => onCardHover && onCardHover(2)}
        onMouseLeave={() => onCardHover && onCardHover(null)}
        onClick={() =>
          navigate("/object/2", {
            state: {
              initialBooking: {
                tariffId: "1m",
                stayDays: 30,
              },
              objectData: {
                min_stay: 30,
                max_stay: 365,
                available_from: "1 января 2026",
              },
            },
          })
        }
        style={{ cursor: "pointer" }}
      >
        <div className="card-body p-3 d-flex gap-3">
          <div className="offer-card-photo position-relative flex-shrink-0">
            <div
              id="offerCarousel2"
              className="offer-carousel carousel slide"
              data-bs-ride="false"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={img1} className="d-block w-100" alt="Фото объекта 1" />
                </div>
                <div className="carousel-item">
                  <img src={img1b} className="d-block w-100" alt="Фото объекта 2" />
                </div>
                <div className="carousel-item">
                  <img src={img1c} className="d-block w-100" alt="Фото объекта 3" />
                </div>
              </div>

              <div className="offer-carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#offerCarousel2"
                  data-bs-slide-to="0"
                  className="active"
                  onClick={(e) => e.stopPropagation()}
                ></button>

                <button
                  type="button"
                  data-bs-target="#offerCarousel2"
                  data-bs-slide-to="1"
                  onClick={(e) => e.stopPropagation()}
                ></button>

                <button
                  type="button"
                  data-bs-target="#offerCarousel2"
                  data-bs-slide-to="2"
                  onClick={(e) => e.stopPropagation()}
                ></button>
              </div>

              <button
                className="offer-carousel-control offer-carousel-control-prev"
                type="button"
                data-bs-target="#offerCarousel2"
                data-bs-slide="prev"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="offer-carousel-control offer-carousel-control-next"
                type="button"
                data-bs-target="#offerCarousel2"
                data-bs-slide="next"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>

            <button
              className="offer-fav-btn"
              type="button"
              aria-label={t('header.favAria')}
              onClick={(e) => e.stopPropagation()}
            >
              <i className="bi bi-heart"></i>
            </button>
          </div>

          <div className="offer-card-main flex-grow-1 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <div className="offer-type-pill">
                {t('offersCard.typeApartHotel')}
              </div>

              <div className="offer-rating d-flex align-items-center gap-1">
                <i className="bi bi-stars offer-new-icon"></i>
                <span className="offer-new-label">
                  {t('offersCard.newLabel')}
                </span>
              </div>
            </div>

            <h2 className="offer-title mb-1">
              {t('offersCard.title2')}
            </h2>

            <div className="offer-meta mb-1">
              30 м² · 2 гостя · 2 комнаты
            </div>

            <div className="offer-meta mb-1">
              <i className="bi bi-geo-alt me-1"></i>
              Геленджик, Южная улица, 35/1 · Море ~ 200 м
            </div>

            <div className="offer-meta mb-2">
              <i className="bi bi-calendar-check me-1"></i>
              {t('offersCard.availableFrom')}
            </div>
          </div>

          <div className="offer-card-side ms-2">
            <div className="offer-card-side-content text-end">
              <div className="offer-price mb-2">
                40 000 ₽
                <span className="offer-price-note offer-price-note-with-tooltip">
                  {t('offersCard.priceNote')}
                  <span className="offer-tooltip-trigger">
                    <i className="bi bi-lightning-charge-fill offer-tooltip-icon"></i>
                    <span className="offer-tooltip-bubble">
                      {t('offersCard.priceTooltip')}
                    </span>
                  </span>
                </span>
              </div>

              <div className="offer-term-chips d-flex gap-2 mb-1">
                <button
                  type="button"
                  className="offer-chip offer-chip-active btn btn-sm"
                  data-tooltip={t('offersCard.chipShortTooltip')}
                >
                  <span className="offer-chip-text">
                    <span className="offer-chip-value">1+</span>
                    <span className="offer-chip-label">{t('offersCard.monthShort')}</span>
                  </span>
                </button>

                <button
                  type="button"
                  className="offer-chip btn btn-sm"
                  data-tooltip={t('offersCard.chipMidTooltip')}
                >
                  <span className="offer-chip-text">
                    <span className="offer-chip-value">2-5</span>
                    <span className="offer-chip-label">{t('offersCard.monthShort')}</span>
                  </span>
                </button>

                <button
                  type="button"
                  className="offer-chip btn btn-sm"
                  data-tooltip={t('offersCard.chipLongTooltip')}
                >
                  <span className="offer-chip-text">
                    <span className="offer-chip-value">6+</span>
                    <span className="offer-chip-label">{t('offersCard.monthShort')}</span>
                  </span>
                </button>
              </div>

              <div className="offer-meta offer-max-term">
                {t('offersCard.maxTerm')}
              </div>
            </div>

            <button type="button" className="btn btn-request" onClick={(e) => e.stopPropagation()}>
              {t('offersCard.onRequest')}
            </button>
          </div>
        </div>
      </article>

      {/* Карточка 3 */}
      <article
        className="offer-card card border-0 shadow-sm mb-3"
        onMouseEnter={() => onCardHover && onCardHover(3)}
        onMouseLeave={() => onCardHover && onCardHover(null)}
        onClick={() =>
          navigate("/object/3", {
            state: {
              initialBooking: {
                tariffId: "6m_plus",
                stayDays: 180,
              },
              objectData: {
                min_stay: 60,
                max_stay: 365,
                available_from: "1 января 2026",
              },
            },
          })
        }
        style={{ cursor: "pointer" }}
      >
        <div className="card-body p-3 d-flex gap-3">
          <div className="offer-card-photo position-relative flex-shrink-0">
            <div
              id="offerCarousel3"
              className="offer-carousel carousel slide"
              data-bs-ride="false"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={img1} className="d-block w-100" alt="Фото объекта 1" />
                </div>
                <div className="carousel-item">
                  <img src={img1b} className="d-block w-100" alt="Фото объекта 2" />
                </div>
                <div className="carousel-item">
                  <img src={img1c} className="d-block w-100" alt="Фото объекта 3" />
                </div>
              </div>

              <div className="offer-carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#offerCarousel3"
                  data-bs-slide-to="0"
                  className="active"
                  onClick={(e) => e.stopPropagation()}
                ></button>

                <button
                  type="button"
                  data-bs-target="#offerCarousel3"
                  data-bs-slide-to="1"
                  onClick={(e) => e.stopPropagation()}
                ></button>

                <button
                  type="button"
                  data-bs-target="#offerCarousel3"
                  data-bs-slide-to="2"
                  onClick={(e) => e.stopPropagation()}
                ></button>
              </div>

              <button
                className="offer-carousel-control offer-carousel-control-prev"
                type="button"
                data-bs-target="#offerCarousel3"
                data-bs-slide="prev"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="offer-carousel-control offer-carousel-control-next"
                type="button"
                data-bs-target="#offerCarousel3"
                data-bs-slide="next"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>

            <button
              className="offer-fav-btn"
              type="button"
              aria-label={t('header.favAria')}
              onClick={(e) => e.stopPropagation()}
            >
              <i className="bi bi-heart"></i>
            </button>
          </div>

          <div className="offer-card-main flex-grow-1 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <div className="offer-type-pill">
                {t('offersCard.typeFlat1')}
              </div>

              <div className="offer-rating d-flex align-items-center gap-1">
                <i className="bi bi-star-fill"></i>
                <span className="fw-semibold">9,3</span>
                <span className="text-muted">
                  {t('offersCard.ratingReviews')}
                </span>
                <span>·</span>
                <span className="d-inline-flex align-items-center">
                  <i className="bi bi-leaf-fill offer-eco-icon"></i>
                </span>
              </div>
            </div>

            <h2 className="offer-title mb-1">
              {t('offersCard.title1')}
            </h2>

            <div className="offer-meta mb-1">
              48 м² · 2 гостя · 4 этаж из 9
            </div>

            <div className="offer-meta mb-1">
              <i className="bi bi-geo-alt me-1"></i>
              Москва, Ленинский пр-т, 25
            </div>

            <div className="offer-meta mb-1">
              <i className="bi bi-train-front me-1"></i>
              м. Сокол · 7 мин пешком
            </div>

            <div className="offer-meta mb-2">
              <i className="bi bi-calendar-check me-1"></i>
              {t('offersCard.availableFrom')}
            </div>
          </div>

          {/* Правая колонка карточки 3 */}
          <div className="offer-card-side ms-2">
            <div className="offer-card-side-content text-end">
              <div className="offer-price mb-2">
                40 000 ₽
                <span className="offer-price-note offer-price-note-with-tooltip">
                  {t('offersCard.priceNote')}
                  <span className="offer-tooltip-trigger">
                    <i className="bi bi-lightning-charge-fill offer-tooltip-icon"></i>
                    <span className="offer-tooltip-bubble">
                      {t('offersCard.priceTooltip')}
                    </span>
                  </span>
                </span>
              </div>

              {/* Чипы сроков аренды */}
              <div className="offer-term-chips d-flex gap-2 mb-1">
                <button
                  type="button"
                  className="offer-chip offer-chip-locked btn btn-sm"
                  data-tooltip={t('offersCard.chipLockedTooltip')}
                >
                  <span className="offer-chip-text">
                    <span className="offer-chip-value">1</span>
                    <span className="offer-chip-label">{t('offersCard.monthShort')}</span>
                  </span>
                  <i className="bi bi-lock-fill offer-chip-lock"></i>
                </button>

                <button
                  type="button"
                  className="offer-chip offer-chip-active btn btn-sm"
                  data-tooltip={t('offersCard.chipMidTooltip')}
                >
                  <span className="offer-chip-text">
                    <span className="offer-chip-value">2-5</span>
                    <span className="offer-chip-label">{t('offersCard.monthShort')}</span>
                  </span>
                </button>

                <button
                  type="button"
                  className="offer-chip btn btn-sm"
                  data-tooltip={t('offersCard.chipLongTooltip')}
                >
                  <span className="offer-chip-text">
                    <span className="offer-chip-value">6+</span>
                    <span className="offer-chip-label">{t('offersCard.monthShort')}</span>
                  </span>
                </button>
              </div>

              <div className="offer-meta offer-max-term">
                {t('offersCard.maxTerm')}
              </div>
            </div>

            <button type="button" className="btn btn-request" onClick={(e) => e.stopPropagation()}>
              {t('offersCard.onRequest')}
            </button>
          </div>
        </div>
      </article>

      {/* Карточка 4 */}
      <article
        className="offer-card card border-0 shadow-sm mb-3"
        onMouseEnter={() => onCardHover && onCardHover(4)}
        onMouseLeave={() => onCardHover && onCardHover(null)}
        onClick={() =>
          navigate("/object/4", {
            state: {
              initialBooking: {
                tariffId: "1m",
                stayDays: 30,
              },
              objectData: {
                min_stay: 30,
                max_stay: 365,
                available_from: "1 января 2026",
              },
            },
          })
        }
        style={{ cursor: "pointer" }}
      >
        <div className="card-body p-3 d-flex gap-3">
          <div className="offer-card-photo position-relative flex-shrink-0">
            <div
              id="offerCarousel4"
              className="offer-carousel carousel slide"
              data-bs-ride="false"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={img1} className="d-block w-100" alt="Фото объекта 1" />
                </div>
                <div className="carousel-item">
                  <img src={img1b} className="d-block w-100" alt="Фото объекта 2" />
                </div>
                <div className="carousel-item">
                  <img src={img1c} className="d-block w-100" alt="Фото объекта 3" />
                </div>
              </div>

              <div className="offer-carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#offerCarousel4"
                  data-bs-slide-to="0"
                  className="active"
                  onClick={(e) => e.stopPropagation()}
                ></button>
                <button
                  type="button"
                  data-bs-target="#offerCarousel4"
                  data-bs-slide-to="1"
                  onClick={(e) => e.stopPropagation()}
                ></button>
                <button
                  type="button"
                  data-bs-target="#offerCarousel4"
                  data-bs-slide-to="2"
                  onClick={(e) => e.stopPropagation()}
                ></button>
              </div>

              <button
                className="offer-carousel-control offer-carousel-control-prev"
                type="button"
                data-bs-target="#offerCarousel4"
                data-bs-slide="prev"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="offer-carousel-control offer-carousel-control-next"
                type="button"
                data-bs-target="#offerCarousel4"
                data-bs-slide="next"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>

            <button
              className="offer-fav-btn"
              type="button"
              aria-label={t('header.favAria')}
              onClick={(e) => e.stopPropagation()}
            >
              <i className="bi bi-heart"></i>
            </button>
          </div>

          <div className="offer-card-main flex-grow-1 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <div className="offer-type-pill">
                {t('offersCard.typeApartHotel')}
              </div>

              <div className="offer-rating d-flex align-items-center gap-1">
                <i className="bi bi-stars offer-new-icon"></i>
                <span className="offer-new-label">
                  {t('offersCard.newLabel')}
                </span>
              </div>
            </div>

            <h2 className="offer-title mb-1">
              {t('offersCard.title2')}
            </h2>

            <div className="offer-meta mb-1">
              30 м² · 2 гостя · 2 комнаты
            </div>

            <div className="offer-meta mb-1">
              <i className="bi bi-geo-alt me-1"></i>
              Геленджик, Южная улица, 35/1 · Море ~ 200 м
            </div>

            <div className="offer-meta mb-2">
              <i className="bi bi-calendar-check me-1"></i>
              {t('offersCard.availableFrom')}
            </div>
          </div>

          <div className="offer-card-side ms-2">
            <div className="offer-card-side-content text-end">
              <div className="offer-price mb-2">
                40 000 ₽
                <span className="offer-price-note offer-price-note-with-tooltip">
                  {t('offersCard.priceNote')}
                  <span className="offer-tooltip-trigger">
                    <i className="bi bi-lightning-charge-fill offer-tooltip-icon"></i>
                    <span className="offer-tooltip-bubble">
                      {t('offersCard.priceTooltip')}
                    </span>
                  </span>
                </span>
              </div>

              <div className="offer-term-chips d-flex gap-2 mb-1">
                <button
                  type="button"
                  className="offer-chip offer-chip-active btn btn-sm"
                  data-tooltip={t('offersCard.chipShortTooltip')}
                >
                  <span className="offer-chip-text">
                    <span className="offer-chip-value">1+</span>
                    <span className="offer-chip-label">{t('offersCard.monthShort')}</span>
                  </span>
                </button>

                <button
                  type="button"
                  className="offer-chip btn btn-sm"
                  data-tooltip={t('offersCard.chipMidTooltip')}
                >
                  <span className="offer-chip-text">
                    <span className="offer-chip-value">2-5</span>
                    <span className="offer-chip-label">{t('offersCard.monthShort')}</span>
                  </span>
                </button>

                <button
                  type="button"
                  className="offer-chip btn btn-sm"
                  data-tooltip={t('offersCard.chipLongTooltip')}
                >
                  <span className="offer-chip-text">
                    <span className="offer-chip-value">6+</span>
                    <span className="offer-chip-label">{t('offersCard.monthShort')}</span>
                  </span>
                </button>
              </div>

              <div className="offer-meta offer-max-term">
                {t('offersCard.maxTerm')}
              </div>
            </div>

            <button type="button" className="btn btn-request" onClick={(e) => e.stopPropagation()}>
              {t('offersCard.onRequest')}
            </button>
          </div>
        </div>
      </article>
    </>
  );
}
