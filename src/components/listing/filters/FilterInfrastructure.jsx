import { useEffect, useMemo, useState } from 'react';
import { HOUSING_TYPES } from '../../../pages/Listing/constants/housingTypes.js';


const WIFI_SPEED_OPTIONS = ['до 100 Мбит/с', 'до 300 Мбит/с', 'до 600 Мбит/с', '600+ Мбит/с'];

const CONFIG = {
  [HOUSING_TYPES.APARTMENT]: {
    wifiToggleLabel: 'Только с Wi-Fi',
    indoorOptions: [
      'Кондиционер',
      'Холодильник',
      'Посудомоечная машина',
      'Кофемашина',
      'Электрочайник',
      'Духовка',
      'Плита',
      'Посуда',
      'СВЧ-печь',
      'Постельное бельё',
      'ТВ',
      'Смарт ТВ',
      'Письменный стол',
      'Утюг',
      'Детская кровать',
      'Стиральная машина',
      'Панорамные окна',
    ],
    parkingOptions: ['Любая', 'Во дворе', 'Крытая', 'Подземная', 'Уличная'],
    showParkingFlags: true, // платная/охраняемая
    showTerritoryZK: true,  // Территория ЖК
    nearbyOptions: [
      'Детский сад',
      'Школа',
      'Магазин',
      'Аптека',
      'Банк',
      'Спортзал / фитнес',
      'Бассейн',
      'Парк',
      'Пляж', // показываем только если hasSea
    ],
  },

  [HOUSING_TYPES.HOUSE]: {
    wifiToggleLabel: 'Есть Wi-Fi',
    indoorOptions: [
      'Кондиционер',
      'Холодильник',
      // дом — без панорамных окон, но с тёплым полом (по ТЗ)
      'Кофемашина',
      'Электрочайник',
      'Духовка',
      'Посуда',
      'СВЧ-печь',
      'Постельное бельё',
      'ТВ',
      'Смарт ТВ',
      'Письменный стол',
      'Утюг',
      'Детская кровать',
      'Стиральная машина',
      'Тёплый пол',
    ],
    parkingOptions: ['На участке', 'Гараж', 'Рядом с домом'],
    showParkingFlags: false,
    showTerritoryZK: false,
    // если в ТЗ для дома есть “в пешей доступности” — оставь нужный список здесь
    nearbyOptions: [
      'Детский сад',
      'Школа',
      'Магазин',
      'Аптека',
      'Банк',
      'Спортзал / фитнес',
      'Бассейн',
      'Парк',
      'Пляж',
    ],
  },

  [HOUSING_TYPES.ROOM]: {
    wifiToggleLabel: 'Есть Wi-Fi',
    indoorOptions: [
      'Кондиционер',
      'Холодильник',
      'Электрочайник',
      'Посуда',
      'СВЧ-печь',
      'Постельное бельё',
      'ТВ',
      'Смарт ТВ',
      'Письменный стол',
      'Утюг',
      'Детская кровать',
      'Стиральная машина',
    ],
    parkingOptions: ['Любая', 'Во дворе', 'Крытая', 'Подземная', 'Уличная'], // если по ТЗ у комнаты парковка не как у квартиры — поменяй
    showParkingFlags: true,
    showTerritoryZK: false,
    nearbyOptions: ['Магазин', 'Аптека', 'Банк', 'Парк', 'Пляж'],
  },

  [HOUSING_TYPES.APARTHOTEL]: {
    wifiToggleLabel: 'Только с Wi-Fi',
    indoorOptions: [
      'Кондиционер',
      'Холодильник',
      'Посудомоечная машина',
      'Кофемашина',
      'Электрочайник',
      'Духовка',
      'Плита',
      'Посуда',
      'СВЧ-печь',
      'Постельное бельё',
      'ТВ',
      'Смарт ТВ',
      'Письменный стол',
      'Утюг',
      'Детская кровать',
      'Стиральная машина',
      'Панорамные окна',
      'Тёплый пол',
    ],
    parkingOptions: ['Любая', 'Во дворе', 'Крытая', 'Подземная', 'Уличная'],
    showParkingFlags: true,
    showTerritoryZK: false,
    nearbyOptions: [
      'Детский сад',
      'Школа',
      'Магазин',
      'Аптека',
      'Банк',
      'Спортзал / фитнес',
      'Пляж',
    ],
  },
};

export default function FilterInfrastructure({
  housingType,
  hasSea = true,
  onSummaryChange,
  resetToken,
}) {
  const cfg = CONFIG[housingType] || CONFIG[HOUSING_TYPES.APARTMENT];

  // Wi-Fi / интернет
  const [wifiOnly, setWifiOnly] = useState(false);
  const [wifiSpeed, setWifiSpeed] = useState(null);

  // В помещении (multi)
  const [indoorSelected, setIndoorSelected] = useState(new Set());

  // Парковка (single + flags)
  const [parkingType, setParkingType] = useState(null);
  const [parkingPaid, setParkingPaid] = useState(false);
  const [parkingGuarded, setParkingGuarded] = useState(false);

  // Территория ЖК (multi) — только для квартиры
  const [yardSelected, setYardSelected] = useState(new Set());

  // В пешей доступности (multi)
  const [nearbySelected, setNearbySelected] = useState(new Set());

  const toggleSet = (setter) => (label) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const clearTerritoryBlock = () => {
    setParkingType(null);
    setParkingPaid(false);
    setParkingGuarded(false);
    setYardSelected(new Set());
    setNearbySelected(new Set());
  };

  // подрезаем “Пляж”, если моря нет
  const nearbyOptions = useMemo(() => {
    const list = cfg.nearbyOptions || [];
    if (hasSea) return list;
    return list.filter((x) => x !== 'Пляж' && x !== 'Море');
  }, [cfg.nearbyOptions, hasSea]);

  // если сменился тип жилья — удаляем выбранное, чего нет в новом cfg
  useEffect(() => {
    setIndoorSelected((prev) => new Set([...prev].filter((x) => cfg.indoorOptions.includes(x))));
    setNearbySelected((prev) => new Set([...prev].filter((x) => nearbyOptions.includes(x))));

    // парковка: если текущая опция не разрешена — сброс
    if (parkingType && !cfg.parkingOptions.includes(parkingType)) setParkingType(null);

    // если флаги парковки недоступны — сброс
    if (!cfg.showParkingFlags) {
      setParkingPaid(false);
      setParkingGuarded(false);
    }

    // если территория ЖК скрыта — сброс
    if (!cfg.showTerritoryZK) setYardSelected(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [housingType]); // важно: именно по смене типа

  // глобальный reset
  useEffect(() => {
    if (resetToken == null) return;
    setWifiOnly(false);
    setWifiSpeed(null);
    setIndoorSelected(new Set());
    setParkingType(null);
    setParkingPaid(false);
    setParkingGuarded(false);
    setYardSelected(new Set());
    setNearbySelected(new Set());
  }, [resetToken]);

  // чипы наверх (как у тебя — массив строк)
  const infraChips = useMemo(() => {
    const chips = [];

    if (wifiOnly) chips.push(cfg.wifiToggleLabel);
    if (wifiSpeed) chips.push(wifiSpeed);

    [...indoorSelected].forEach((x) => chips.push(x));

    if (parkingType) chips.push(`Парковка: ${parkingType}`);
    if (cfg.showParkingFlags) {
      if (parkingPaid) chips.push('Парковка платная');
      if (parkingGuarded) chips.push('Парковка охраняемая');
    }

    if (cfg.showTerritoryZK) {
      [...yardSelected].forEach((x) => chips.push(x));
    }

    [...nearbySelected].forEach((x) => chips.push(x));

    return chips;
  }, [
    wifiOnly,
    wifiSpeed,
    indoorSelected,
    parkingType,
    parkingPaid,
    parkingGuarded,
    yardSelected,
    nearbySelected,
    cfg.wifiToggleLabel,
    cfg.showParkingFlags,
    cfg.showTerritoryZK,
  ]);

  useEffect(() => {
    onSummaryChange?.(infraChips.length ? infraChips : null);
  }, [infraChips, onSummaryChange]);

  return (
    <section className="filter-section">
      <div className="filter-section-header">
        <div className="filter-section-title">Инфраструктура и удобства</div>
      </div>

      {/* Wi-Fi / интернет */}
      <div className="mb-3">
        <div className="filter-subtitle d-flex align-items-center justify-content-between">
          <span>Wi-Fi / интернет</span>
          <button
            type="button"
            className="filter-clear-link"
            onClick={() => {
              setWifiOnly(false);
              setWifiSpeed(null);
            }}
          >
            Очистить
          </button>
        </div>

        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="wifiOnly"
            checked={wifiOnly}
            onChange={(e) => setWifiOnly(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="wifiOnly">
            {cfg.wifiToggleLabel}
          </label>
        </div>

        <div className="chips-row" data-single-select="true">
          {WIFI_SPEED_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              className={'filter-chip' + (wifiSpeed === opt ? ' filter-chip-active' : '')}
              onClick={() => setWifiSpeed((cur) => (cur === opt ? null : opt))}
            >
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* В помещении */}
      <div className="mb-3">
        <div className="filter-subtitle d-flex align-items-center justify-content-between">
          <span>В помещении</span>
          <button type="button" className="filter-clear-link" onClick={() => setIndoorSelected(new Set())}>
            Очистить
          </button>
        </div>

        <div className="chips-row">
          {cfg.indoorOptions.map((label) => (
            <button
              key={label}
              type="button"
              className={'filter-chip' + (indoorSelected.has(label) ? ' filter-chip-active' : '')}
              onClick={() => toggleSet(setIndoorSelected)(label)}
            >
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* На территории или рядом */}
      <div className="mb-3">
        <details className="filter-accordion">
          <summary>
            <div>
              <div className="filter-accordion-title">На территории или рядом</div>
              <div className="filter-accordion-meta">
                {infraChips.length ? `${infraChips.length} выбрано` : 'Не выбрано'}
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="filter-clear-link"
                onClick={(e) => {
                  e.preventDefault();
                  clearTerritoryBlock();
                }}
              >
                Очистить
              </button>
              <i className="bi bi-chevron-down accordion-chevron" />
            </div>
          </summary>

          <div className="filter-accordion-body">
            {/* Парковка */}
            <div>
              <div className="filter-subtitle d-flex align-items-center justify-content-between">
                <span>Парковка</span>
                <button
                  type="button"
                  className="filter-clear-link"
                  onClick={() => {
                    setParkingType(null);
                    setParkingPaid(false);
                    setParkingGuarded(false);
                  }}
                >
                  Очистить
                </button>
              </div>

              <div className="chips-row" data-single-select="true">
                {cfg.parkingOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={'filter-chip' + (parkingType === opt ? ' filter-chip-active' : '')}
                    onClick={() => setParkingType((cur) => (cur === opt ? null : opt))}
                  >
                    <span>{opt}</span>
                  </button>
                ))}
              </div>

              {cfg.showParkingFlags && (
                <div className="filters-checkbox-row mt-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="parkingPaid"
                      checked={parkingPaid}
                      onChange={(e) => setParkingPaid(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="parkingPaid">
                      Платная
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="parkingGuarded"
                      checked={parkingGuarded}
                      onChange={(e) => setParkingGuarded(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="parkingGuarded">
                      Охраняемая
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Территория ЖК — только если cfg.showTerritoryZK */}
            {cfg.showTerritoryZK && (
              <div className="mt-3">
                <div className="filter-subtitle">Территория ЖК</div>
                <div className="filters-checkbox-row">
                  {['Детская площадка', 'Видеонаблюдение', 'Шлагбаум', 'Зелёная зона', 'Охраняемая территория'].map(
                    (x) => (
                      <div className="form-check" key={x}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`yard-${x}`}
                          checked={yardSelected.has(x)}
                          onChange={() => toggleSet(setYardSelected)(x)}
                        />
                        <label className="form-check-label" htmlFor={`yard-${x}`}>
                          {x}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* В пешей доступности */}
            <div className="mt-3">
              <div className="filter-subtitle">В пешей доступности</div>
              <div className="filters-checkbox-row">
                {nearbyOptions.map((x) => (
                  <div className="form-check" key={x}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`near-${x}`}
                      checked={nearbySelected.has(x)}
                      onChange={() => toggleSet(setNearbySelected)(x)}
                    />
                    <label className="form-check-label" htmlFor={`near-${x}`}>
                      {x}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
