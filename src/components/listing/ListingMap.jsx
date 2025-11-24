import { useTranslation } from 'react-i18next';

export default function ListingMap({ hoveredOfferId }) {
  const { t } = useTranslation();

  return (
    <aside className="listing-map card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="map-placeholder d-flex flex-column align-items-center justify-content-center">
          {t('map.title')}
          {hoveredOfferId && (
            <div className="mt-2 small text-muted">
              {/* временная заглушка, потом будет реальный маркер */}
              {t('map.hoverMock', { id: hoveredOfferId })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
