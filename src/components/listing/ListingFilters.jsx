import { useTranslation } from 'react-i18next';

export default function ListingFilters() {
  const { t } = useTranslation();

  return (
    <section className="listing-filters">
      <div className="container-xxl py-3 d-flex align-items-center gap-2 flex-wrap">

        <button type="button" className="btn btn-filter btn-md">
          {t('filters.price')}
        </button>

        <button
          type="button"
          className="btn btn-filter btn-filter-active btn-md"
        >
          {t('filters.houseTypes')}{' '}
          <span className="btn-filter-count">3</span>
        </button>

        <button type="button" className="btn btn-filter btn-md">
          {t('filters.districtMetro')}
        </button>

        <button
          type="button"
          className="btn btn-filter btn-md rounded-pill d-flex align-items-center gap-1"
        >
          <i className="bi bi-sliders"></i>
          <span>{t('filters.allFilters')}</span>
        </button>

        <div className="ms-auto d-flex align-items-center">
          <button
            type="button"
            className="btn btn-filter btn-md btn-clear d-flex align-items-center gap-1"
          >
            <i className="bi bi-trash3"></i>
            <span>{t('filters.clear')}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
