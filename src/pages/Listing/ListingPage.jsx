import { useState } from 'react';
import SiteHeader from '../../components/layout/SiteHeader.jsx';
import ListingFilters from '../../components/listing/ListingFilters.jsx';
import ListingToolbar from '../../components/listing/ListingToolbar.jsx';
import OffersList from '../../components/listing/OffersList.jsx';
import ListingMap from '../../components/listing/ListingMap.jsx';
import Footer from '../../components/layout/Footer.jsx';

export default function ListingPage() {
  // id карточки, над которой сейчас ховер
  const [hoveredOfferId, setHoveredOfferId] = useState(null);

  return (
    <div className="listing-page">
      <SiteHeader />

      <ListingFilters />

      <ListingToolbar />

      <main className="listing-main py-3">
        <div className="container-xxl">
          <div className="row g-3">
            {/* Левая колонка — карточки */}
            <div className="col-lg-7 col-xl-8">
              {/* Передаём колбэк в список офферов */}
              <OffersList onCardHover={setHoveredOfferId} />
            </div>

            {/* Правая колонка — карта */}
            <div className="col-lg-5 col-xl-4">
              {/* Карта знает, над какой карточкой ховер */}
              <ListingMap hoveredOfferId={hoveredOfferId} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
