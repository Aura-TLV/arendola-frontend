// src/components/listing/ListingFilters.jsx
import { useEffect, useMemo, useState } from 'react';
//import FiltersModal, { HOUSING_TYPES } from '../../pages/Listing/FiltersModal.jsx';
import FiltersModal from '../../pages/Listing/FiltersModal.jsx';

import { HOUSING_TYPES } from '../../pages/Listing/constants/housingTypes.js';
import QuickFilterModal from './QuickFilterModal.jsx';

import useDebouncedValue from '../../hooks/useDebouncedValue';
import { searchOptions } from '../../utils/searchOptions';


/* ====== константы (такие же как в FiltersModal) ====== */
const FILTER_PROFILE = {
  [HOUSING_TYPES.APARTMENT]: {
    label: 'Квартира',
    subtypes: ['Студия', '1-к', '2-к', '3-к', '4-к+'],
  },
  [HOUSING_TYPES.HOUSE]: {
    label: 'Дом',
    subtypes: ['Отдельный', 'Часть дома', 'Коттедж', 'Таунхаус'],
  },
  [HOUSING_TYPES.ROOM]: {
    label: 'Комната',
    subtypes: ['В квартире', 'В доме'],
  },
  [HOUSING_TYPES.APARTHOTEL]: {
    label: 'Апарт-отель',
    subtypes: ['Студия', '1-к', '2-к', '3-к+'],
  },
};

const HOUSING_TYPE_BUTTONS = [
  { type: HOUSING_TYPES.APARTMENT, icon: 'bi-building' },
  { type: HOUSING_TYPES.HOUSE, icon: 'bi-house' },
  { type: HOUSING_TYPES.ROOM, icon: 'bi-door-closed' },
  { type: HOUSING_TYPES.APARTHOTEL, icon: 'bi-building-check' },
];

const PRICE_MAX_LIMIT = 300000;

const DEFAULT_METRO_STATIONS = ['Охотный Ряд', 'Тверская', 'Площадь Революции'];
const DEFAULT_DISTRICTS = ['Центральный', 'Приморский', 'Красногвардейский', 'Советский'];

/* ====== pill-инпут (копия из FiltersModal) ====== */
function FiltersInputPill({
  value,
  onChange,
  placeholder,
  type = 'number',
  className = '',
}) {
  const handleClear = () => onChange('');

  return (
    <div className={`filters-input-pill ${className}`}>
      <input
        type={type}
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className={
          'filters-input-clear' +
          (value === '' || value == null ? ' d-none' : '')
        }
        aria-label="Очистить"
        onClick={handleClear}
      >
        <i className="bi bi-x-lg" />
      </button>
    </div>
  );
}

/* ====== саб-модалки Метро/Район (копия из FiltersModal) ====== */

function SubfiltersBackdrop({ children, onClose }) {
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('subfilters-backdrop')) onClose();
  };

  return (
    <div className="subfilters-backdrop is-open" onClick={handleBackdropClick}>
      <div className="subfilters-panel" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function MetroSubfilterModal({
  onClose,
  selectedStations,
  onStationsChange,
  selectedWalkTime,
  onWalkTimeChange,
  onClear,
  apiUrl,
  allStations = DEFAULT_METRO_STATIONS,
}) {
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search, 250);

  const [stations, setStations] = useState(allStations);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      const { items } = await searchOptions({
        query: debounced,
        localOptions: allStations,
        apiUrl, // пока undefined — будет локально
        queryParam: 'q', // универсально
        limit: 50,
      });

      if (alive) {
        // items могут быть строками или объектами — тут ожидаем строки
        setStations(items.map((x) => (typeof x === 'string' ? x : x.label)).filter(Boolean));
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [debounced, apiUrl, allStations]);

  const toggleStation = (name) => {
    onStationsChange((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const walkOptions = ['до 5 мин', 'до 10 мин', 'до 15 мин', 'до 20 мин', 'до 30 мин'];

  return (
    <SubfiltersBackdrop onClose={onClose}>
      <header className="subfilters-header">
        <h3 className="subfilters-title mb-0">Метро</h3>
        <button type="button" className="subfilters-close-btn" onClick={onClose}>
          <i className="bi bi-x-lg" />
        </button>
      </header>

      <div className="subfilters-body">
        <div className="subfilters-search mb-3">
          <FiltersInputPill
            type="text"
            value={search}
            onChange={setSearch}
            placeholder="Найти станцию метро"
            className="w-100"
          />
          <div className="subfilters-search-hint">
            Введите от 2 букв, чтобы найти станцию
          </div>
        </div>

        <div className="subfilters-subtitle">Станции метро</div>

        {loading && <div className="subfilters-search-hint">Поиск…</div>}

        <div className="subfilters-list">
          {stations.map((name) => (
            <label key={name} className="form-check subfilters-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={selectedStations.includes(name)}
                onChange={() => toggleStation(name)}
              />
              {/* точки линий оставь как хочешь: либо убери, либо сделай маппинг по данным */}
              <span className="form-check-label">{name}</span>
            </label>
          ))}

          {!loading && debounced.trim().length >= 2 && stations.length === 0 && (
            <p className="subfilters-empty">Ничего не найдено.</p>
          )}
        </div>

        <div className="subfilters-subtitle mt-3">До метро пешком</div>
        <div className="chips-row mb-1">
          {walkOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              className={'filter-chip' + (selectedWalkTime === opt ? ' filter-chip-active' : '')}
              onClick={() => onWalkTimeChange(selectedWalkTime === opt ? null : opt)}
            >
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </div>

      <footer className="subfilters-footer">
        <button type="button" className="btn btn-link subfilters-clear" onClick={onClear}>
          Очистить
        </button>
        <button type="button" className="btn btn-brand subfilters-apply" onClick={onClose}>
          Применить
        </button>
      </footer>
    </SubfiltersBackdrop>
  );
}


function DistrictSubfilterModal({
  onClose,
  selectedDistricts,
  onDistrictsChange,
  onClear,
  apiUrl,
  allDistricts = DEFAULT_DISTRICTS,
}) {
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search, 250);

  const [districtList, setDistrictList] = useState(allDistricts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);

      const { items } = await searchOptions({
        query: debounced,
        localOptions: allDistricts,
        apiUrl, // пока undefined — будет локально
        queryParam: 'q',
        limit: 50,
      });

      if (alive) {
        setDistrictList(
          items
            .map((x) => (typeof x === 'string' ? x : x.label))
            .filter(Boolean)
        );
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [debounced, apiUrl, allDistricts]);

  const toggleDistrict = (name) => {
    onDistrictsChange((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]
    );
  };

  return (
    <SubfiltersBackdrop onClose={onClose}>
      <header className="subfilters-header">
        <h3 className="subfilters-title mb-0">Район</h3>
        <button type="button" className="subfilters-close-btn" onClick={onClose}>
          <i className="bi bi-x-lg" />
        </button>
      </header>

      <div className="subfilters-body">
        <div className="subfilters-search mb-3">
          <FiltersInputPill
            type="text"
            value={search}
            onChange={setSearch}
            placeholder="Найти район"
            className="w-100"
          />
        </div>

        <div className="subfilters-subtitle">Районы</div>

        {loading && <div className="subfilters-search-hint">Поиск…</div>}

        <div className="subfilters-list">
          {districtList.map((d) => (
            <label key={d} className="form-check subfilters-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={selectedDistricts.includes(d)}
                onChange={() => toggleDistrict(d)}
              />
              <span className="form-check-label">{d}</span>
            </label>
          ))}

          {!loading && debounced.trim().length >= 2 && districtList.length === 0 && (
            <p className="subfilters-empty">Ничего не найдено.</p>
          )}
        </div>
      </div>

      <footer className="subfilters-footer">
        <button type="button" className="btn btn-link subfilters-clear" onClick={onClear}>
          Очистить
        </button>
        <button type="button" className="btn btn-brand subfilters-apply" onClick={onClose}>
          Применить
        </button>
      </footer>
    </SubfiltersBackdrop>
  );
}


/* ======================= MAIN ======================= */

export default function ListingFilters() {
  // большая модалка
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // маленькие модалки
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isHousingOpen, setIsHousingOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // саб-модалки внутри локации
  const [isMetroOpen, setIsMetroOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);

  // ====== стейт быстрых фильтров (локально) ======
  const [housingType, setHousingType] = useState(HOUSING_TYPES.APARTMENT);
  const [selectedSubtypes, setSelectedSubtypes] = useState(['1-к']);

  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [priceSlider, setPriceSlider] = useState(0);
  const [noDeposit, setNoDeposit] = useState(false);
  const [utilitiesIncluded, setUtilitiesIncluded] = useState(false);

  const [metroStations, setMetroStations] = useState([]);
  const [metroWalkTime, setMetroWalkTime] = useState(null);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    setSelectedSubtypes([]);
  }, [housingType]);

  /* ====== Цена: связь полей и ползунка ====== */
  const clampSlider = (value) => Math.max(0, Math.min(100, Math.round(value)));

  const syncSliderWithPrice = (minStr, maxStr) => {
    const minNum = parseInt(minStr, 10);
    const maxNum = parseInt(maxStr, 10);

    const basis =
      !Number.isNaN(maxNum) && maxNum > 0
        ? maxNum
        : !Number.isNaN(minNum) && minNum > 0
        ? minNum
        : 0;

    const percent = basis <= 0 ? 0 : clampSlider((basis / PRICE_MAX_LIMIT) * 100);
    setPriceSlider(percent);
  };

  const handlePriceMinChange = (value) => {
    setPriceMin(value);
    syncSliderWithPrice(value, priceMax);
  };

  const handlePriceMaxChange = (value) => {
    setPriceMax(value);
    syncSliderWithPrice(priceMin, value);
  };

  const handlePriceSliderChange = (value) => {
    const vNum = Number(value);
    setPriceSlider(vNum);
    const approxMax = Math.round((vNum / 100) * PRICE_MAX_LIMIT);
    setPriceMax(approxMax > 0 ? String(approxMax) : '');
  };

  const priceSliderBg = useMemo(
    () =>
      `linear-gradient(90deg,
        var(--green) 0%,
        var(--green) ${priceSlider}%,
        #d9d9d9 ${priceSlider}%,
        #d9d9d9 100%)`,
    [priceSlider]
  );

  /* ====== Тип жилья ====== */
  const profile =
    FILTER_PROFILE[housingType] || FILTER_PROFILE[HOUSING_TYPES.APARTMENT];

  const toggleSubtype = (subtype) => {
    setSelectedSubtypes((prev) =>
      prev.includes(subtype) ? prev.filter((s) => s !== subtype) : [...prev, subtype]
    );
  };

  const handleHousingTypeChangeQuick = (nextType) => {
    if (nextType === housingType) return;
    setHousingType(nextType);
    setSelectedSubtypes([]); 
  };


  /* ====== подписи чипов ====== */
  const housingChipLabel = useMemo(() => {
    const main = profile.label;
    if (!selectedSubtypes.length) return main;
    return `${main} · ${selectedSubtypes.join(', ')}`;
  }, [profile.label, selectedSubtypes]);

  const priceChipLabel = useMemo(() => {
    if (!priceMin && !priceMax) return 'Цена';

    const parts = [];
    if (priceMin) parts.push(`от ${priceMin}`);
    if (priceMax) parts.push(`до ${priceMax}`);

    return `${parts.join(' ')} ₽`;
  }, [priceMin, priceMax]);


  const locationChipLabel = useMemo(() => {
    const hasMetro = metroStations.length || metroWalkTime;
    const hasDistrict = districts.length;
    if (!hasMetro && !hasDistrict) return 'Район / Метро';

    const parts = [];
    if (metroStations.length) {
      parts.push(
        metroStations[0] +
          (metroStations.length > 1 ? ` + ещё ${metroStations.length - 1}` : '')
      );
    } else if (metroWalkTime) {
      parts.push(metroWalkTime);
    }
    if (districts.length) {
      parts.push(
        districts[0] + (districts.length > 1 ? ` + ещё ${districts.length - 1}` : '')
      );
    }

    return `Район / Метро · ${parts.join(' • ')}`;
  }, [metroStations, metroWalkTime, districts]);

  /* ====== тексты для пиллов в Location (как в большой) ====== */
  const metroPillHasValue = metroStations.length > 0 || !!metroWalkTime;
  const metroPillText = metroPillHasValue
    ? metroStations.length
      ? metroStations[0] + (metroStations.length > 1 ? ` + ещё ${metroStations.length - 1}` : '')
      : metroWalkTime
    : 'Не выбрано';

  const districtPillHasValue = districts.length > 0;
  const districtPillText = districtPillHasValue
    ? districts[0] + (districts.length > 1 ? ` + ещё ${districts.length - 1}` : '')
    : 'Не выбрано';


  /* ====== очистка ====== */
  const clearPrice = () => {
    setPriceMin('');
    setPriceMax('');
    setPriceSlider(0);
    setNoDeposit(false);
    setUtilitiesIncluded(false);
  };

  const clearHousing = () => {
    setSelectedSubtypes([]);
  };

  const clearLocation = () => {
    setMetroStations([]);
    setMetroWalkTime(null);
    setDistricts([]);
  };

  const clearAllQuick = () => {
    clearPrice();
    clearHousing();
    clearLocation();
  };

  return (
    <>
      {/* Верхняя полоска с чипами */}
      <section className="listing-filters">
        <div className="container-xxl py-3 d-flex align-items-center gap-2 flex-wrap">
          <button
            type="button"
            className={
              'btn btn-filter btn-md' +
              (priceMin || priceMax ? ' btn-filter-active' : '')
            }
            onClick={() => setIsPriceOpen(true)}
          >
            {priceChipLabel}
          </button>


          <button
            type="button"
            className={
              'btn btn-filter btn-md' + (selectedSubtypes.length ? ' btn-filter-active' : '')
            }
            onClick={() => setIsHousingOpen(true)}
          >
            {housingChipLabel}
          </button>

          <button
            type="button"
            className={
              'btn btn-filter btn-md' +
              (locationChipLabel !== 'Район / Метро' ? ' btn-filter-active' : '')
            }
            onClick={() => setIsLocationOpen(true)}
          >
            {locationChipLabel}
          </button>

          <button
            type="button"
            className="btn btn-filter btn-md rounded-pill d-flex align-items-center gap-1"
            onClick={() => setIsFiltersOpen(true)}
          >
            <i className="bi bi-sliders" />
            <span>Все фильтры</span>
          </button>

          <div className="ms-auto d-flex align-items-center">
            <button
              type="button"
              className="btn btn-filter btn-md btn-clear d-flex align-items-center gap-1"
              onClick={clearAllQuick}
            >
              <i className="bi bi-trash3" />
              <span>Очистить</span>
            </button>
          </div>
        </div>
      </section>

      {/* ====== Маленькая модалка: Цена ====== */}
      <QuickFilterModal
        open={isPriceOpen}
        onClose={() => setIsPriceOpen(false)}
        title="Цена"
        onClear={clearPrice}
      >
        <section className="filter-section">
          <div className="filter-section-header">
            <div className="filter-section-title">Цена в месяц</div>
            <button type="button" className="filter-clear-link" onClick={clearPrice}>
              Очистить
            </button>
          </div>

          <div className="filters-inline-inputs mb-2">
            <FiltersInputPill
              className="filters-input-min"
              value={priceMin}
              onChange={handlePriceMinChange}
              placeholder="от, ₽"
            />
            <FiltersInputPill
              className="filters-input-max"
              value={priceMax}
              onChange={handlePriceMaxChange}
              placeholder="до, ₽"
            />
          </div>

          <div className="filters-range">
            <input
              type="range"
              min="0"
              max="100"
              value={priceSlider}
              onChange={(e) => handlePriceSliderChange(e.target.value)}
              style={{ background: priceSliderBg }}
            />
          </div>

          
        </section>
      </QuickFilterModal>

      {/* ====== Маленькая модалка: Тип жилья ====== */}
      <QuickFilterModal
        open={isHousingOpen}
        onClose={() => setIsHousingOpen(false)}
        title="Тип жилья"
        onClear={clearHousing}
      >
        <section className="filter-section">
          <div className="filter-section-header">
            <div className="filter-section-title">Тип жилья</div>
            <div className="filter-section-note d-none d-md-inline">
              Выберите один вариант
            </div>
          </div>

          <div className="segment-control mb-3">
            {HOUSING_TYPE_BUTTONS.map(({ type, icon }) => (
              <button
                key={type}
                type="button"
                className={
                  'segment-btn' + (type === housingType ? ' segment-btn-active' : '')
                }
                onClick={() => handleHousingTypeChangeQuick(type)}
              >
                <i className={`bi ${icon}`} />
                <span>{FILTER_PROFILE[type].label}</span>
              </button>
            ))}
          </div>

          <div className="d-flex align-items-center justify-content-between mb-1">
            <div className="filter-subtitle-muted d-none d-md-block">
              Подтипы <span className="text-muted">(можно несколько)</span>
            </div>
            <div className="filter-subtitle-muted d-md-none ms-auto">Можно несколько</div>
          </div>

          <div className="chips-row">
            {profile.subtypes.map((subtype) => (
              <button
                key={subtype}
                type="button"
                className={
                  'filter-chip' +
                  (selectedSubtypes.includes(subtype) ? ' filter-chip-active' : '')
                }
                onClick={() => toggleSubtype(subtype)}
              >
                <span>{subtype}</span>
              </button>
            ))}
          </div>
        </section>
      </QuickFilterModal>

      {/* ====== Маленькая модалка: Район / Метро ====== */}
      <QuickFilterModal
        open={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        title="Район / Метро"
        onClear={clearLocation}
      >
        <section className="filter-section">
          <div className="filter-section-header">
            <div className="filter-section-title">Расположение</div>
            <button type="button" className="filter-clear-link" onClick={clearLocation}>
              Очистить
            </button>
          </div>

          <div className="filters-field-pills mb-2">
            {/* Метро */}
            <button
              type="button"
              className={
                'filters-field-pill flex-fill ' +
                (metroPillHasValue
                  ? 'filters-field-pill-has-value'
                  : 'filters-field-pill-empty')
              }
              onClick={() => setIsMetroOpen(true)}
            >
              <div className="filters-field-pill-left">
                <i className="bi bi-train-front filters-field-pill-icon" />
                <span className="filters-field-pill-label">Метро</span>
              </div>
              <div className="filters-field-pill-right">
                <span className="filters-field-pill-value">{metroPillText}</span>
                <i className="bi bi-chevron-down filters-field-pill-arrow" />
              </div>
            </button>

            {/* Район */}
            <button
              type="button"
              className={
                'filters-field-pill flex-fill ' +
                (districtPillHasValue
                  ? 'filters-field-pill-has-value'
                  : 'filters-field-pill-empty')
              }
              onClick={() => setIsDistrictOpen(true)}
            >
              <div className="filters-field-pill-left">
                <i className="bi bi-geo-alt filters-field-pill-icon" />
                <span className="filters-field-pill-label">Район</span>
              </div>
              <div className="filters-field-pill-right">
                <span className="filters-field-pill-value">{districtPillText}</span>
                <i className="bi bi-chevron-down filters-field-pill-arrow" />
              </div>
            </button>
          </div>
        </section>
      </QuickFilterModal>

      {/* Саб-модалки (ровно как в большой) */}
      {isMetroOpen && (
        <MetroSubfilterModal
          onClose={() => setIsMetroOpen(false)}
          selectedStations={metroStations}
          onStationsChange={setMetroStations}
          selectedWalkTime={metroWalkTime}
          onWalkTimeChange={setMetroWalkTime}
          onClear={() => {
            setMetroStations([]);
            setMetroWalkTime(null);
          }}
        />
      )}

      {isDistrictOpen && (
        <DistrictSubfilterModal
          onClose={() => setIsDistrictOpen(false)}
          selectedDistricts={districts}
          onDistrictsChange={setDistricts}
          onClear={() => setDistricts([])}
        />
      )}

      {/* Большая модалка (пока как раньше) */}
      <FiltersModal
        open={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        housingType={housingType}
        onHousingTypeChange={handleHousingTypeChangeQuick}
        onApply={(data) => {
          // Тип + подтипы
          if (data?.housingType) setHousingType(data.housingType);
          setSelectedSubtypes(data?.selectedSubtypes || []);

          // Цена (только диапазон)
          const nextMin = data?.priceMin || '';
          const nextMax = data?.priceMax || '';
          setPriceMin(nextMin);
          setPriceMax(nextMax);
          syncSliderWithPrice(nextMin, nextMax); // чтобы ползунок тоже совпал

          // Метро/районы
          setMetroStations(data?.metroStations || []);
          setMetroWalkTime(data?.metroWalkTime || null);
          setDistricts(data?.districts || []);
        }}
      />

    </>
  );
}
