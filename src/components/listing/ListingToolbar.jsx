import { useTranslation } from 'react-i18next';

export default function ListingToolbar() {
  const { t } = useTranslation();

  return (
    <section className="listing-toolbar">
      <div className="container-xxl py-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="small">
          {t('listingToolbar.found')} <span className="fw-bold">1250</span>{t('listingToolbar.foundNum')}
        </div>

        <div className="d-flex align-items-center gap-2">
          <details className="sort-details">
            <summary className="sort-summary d-inline-flex align-items-center gap-1">
              <span className="small text-muted">
                {t('listingToolbar.sortLabel')}
              </span>
              <i className="bi bi-chevron-down small"></i>
            </summary>

            <div className="sort-menu shadow-sm">
              <button type="button" className="sort-option is-active">
                {t('listingToolbar.sortDefault')}
              </button>
              <button type="button" className="sort-option">
                {t('listingToolbar.sortPrice')}
              </button>
              <button type="button" className="sort-option">
                {t('listingToolbar.sortRating')}
              </button>
              <button type="button" className="sort-option">
                {t('listingToolbar.sortNew')}
              </button>
              <button type="button" className="sort-option">
                {t('listingToolbar.sortPopular')}
              </button>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
