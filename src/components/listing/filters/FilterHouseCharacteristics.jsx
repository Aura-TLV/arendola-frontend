import { useState, useMemo, useEffect } from 'react';
//import { HOUSING_TYPES } from '../../../pages/Listing/FiltersModal.jsx';
import { HOUSING_TYPES } from '../../../pages/Listing/constants/housingTypes.js';


export default function FilterHouseCharacteristics({
  housingType,
  onSummaryChange,
  resetToken,
}) {
  const [heating, setHeating] = useState(null);
  const [buildingType, setBuildingType] = useState('');
  const [floorsFrom, setFloorsFrom] = useState('');
  const [floorsTo, setFloorsTo] = useState('');
  const [hasLift, setHasLift] = useState(null);
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');

  const isRoom = housingType === HOUSING_TYPES.ROOM;


  const clearAll = () => {
    setHeating(null);
    setBuildingType('');
    setFloorsFrom('');
    setFloorsTo('');
    setHasLift(null);
    setYearFrom('');
    setYearTo('');
  };

  useEffect(() => {
    clearAll();
  }, [resetToken]);

  useEffect(() => {
    if (isRoom) {
      setHeating(null);
      setBuildingType('');
      setYearFrom('');
      setYearTo('');
    }
  }, [isRoom]);


  const chips = useMemo(() => {
    const arr = [];

    // ROOM LITE: только этажность + лифт
    if (isRoom) {
      if (hasLift) arr.push(`Лифт: ${hasLift.toLowerCase()}`);

      if (floorsFrom || floorsTo) {
        let text = 'Этажей в доме:';
        if (floorsFrom) text += ` от ${floorsFrom}`;
        if (floorsTo) text += ` до ${floorsTo}`;
        arr.push(text);
      }
      return arr;
    }

    // FULL: как было для остальных типов
    if (buildingType) arr.push(`Дом: ${buildingType.toLowerCase()}`);
    if (heating) arr.push(`Отопление: ${heating.toLowerCase()}`);
    if (hasLift) arr.push(`Лифт: ${hasLift.toLowerCase()}`);

    if (floorsFrom || floorsTo) {
      let text = 'Этажей в доме:';
      if (floorsFrom) text += ` от ${floorsFrom}`;
      if (floorsTo) text += ` до ${floorsTo}`;
      arr.push(text);
    }

    if (yearFrom || yearTo) {
      let text = 'Год постройки:';
      if (yearFrom) text += ` с ${yearFrom}`;
      if (yearTo) text += ` по ${yearTo}`;
      arr.push(text);
    }

    return arr;
  }, [isRoom, heating, buildingType, hasLift, floorsFrom, floorsTo, yearFrom, yearTo]);


  const summary = useMemo(() => {
    if (!chips.length) return 'Не выбрано';
    return chips.join(' • ');
  }, [chips]);

  useEffect(() => {
    if (onSummaryChange) onSummaryChange(chips);
  }, [onSummaryChange, chips]);

  const toggleSingleChip = (currentValue, target, setter) => {
    setter(currentValue === target ? null : target);
  };

  return (
    <section className="filter-section">
      <details className="filter-accordion">
        <summary>
          <div>
            <div className="filter-accordion-title">Характеристики дома</div>
            <div className="filter-accordion-meta">{summary}</div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="filter-clear-link"
              onClick={(e) => {
                e.preventDefault();
                clearAll();
              }}
            >
              Очистить
            </button>
            <i className="bi bi-chevron-down accordion-chevron" />
          </div>
        </summary>

        <div className="filter-accordion-body">
          {/* Тип отопления */}
          {!isRoom && (
          <div>
            <div className="filter-subtitle">Тип отопления</div>
            <div className="chips-row">
              {['Центральное', 'Автономное'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={
                    'filter-chip' +
                    (heating === opt ? ' filter-chip-active' : '')
                  }
                  onClick={() => toggleSingleChip(heating, opt, setHeating)}
                >
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>
          )}

          {/* Тип здания */}
          {!isRoom && (
          <div>
            <div className="filter-subtitle">Тип здания</div>
            <select
              className="form-select form-select-sm"
              value={buildingType}
              onChange={(e) => setBuildingType(e.target.value)}
            >
              <option value="">Выбрать тип здания</option>
              <option value="Кирпичный">Кирпичный</option>
              <option value="Панельный">Панельный</option>
              <option value="Монолит">Монолит</option>
              <option value="Кирпич-монолит">Кирпич-монолит</option>
              <option value="Блочный">Блочный</option>
            </select>
          </div>
          )}

          {/* Этажей в доме */}
          <div>
            <div className="filter-subtitle">Этажей в доме</div>
            <div className="filters-inline-inputs">
              <div className="filters-input-pill">
                <input
                  type="number"
                  className="form-control"
                  placeholder="от"
                  value={floorsFrom}
                  onChange={(e) => setFloorsFrom(e.target.value)}
                />
                <button
                  type="button"
                  className="filters-input-clear"
                  aria-label="Очистить"
                  onClick={() => setFloorsFrom('')}
                >
                  <i className="bi bi-x-lg" />
                </button>
              </div>
              <div className="filters-input-pill">
                <input
                  type="number"
                  className="form-control"
                  placeholder="до"
                  value={floorsTo}
                  onChange={(e) => setFloorsTo(e.target.value)}
                />
                <button
                  type="button"
                  className="filters-input-clear"
                  aria-label="Очистить"
                  onClick={() => setFloorsTo('')}
                >
                  <i className="bi bi-x-lg" />
                </button>
              </div>
            </div>
          </div>

          {/* Лифт */}
          <div>
            <div className="filter-subtitle">Лифт</div>
            <div className="chips-row">
              {['Есть любой', 'Есть грузовой'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={
                    'filter-chip' +
                    (hasLift === opt ? ' filter-chip-active' : '')
                  }
                  onClick={() => toggleSingleChip(hasLift, opt, setHasLift)}
                >
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Год постройки */}
          {!isRoom && (
          <div>
            <div className="filter-subtitle">Год постройки</div>
            <div className="filters-inline-inputs">
              <div className="filters-input-pill">
                <input
                  type="number"
                  className="form-control"
                  placeholder="с"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value)}
                />
                <button
                  type="button"
                  className="filters-input-clear"
                  aria-label="Очистить"
                  onClick={() => setYearFrom('')}
                >
                  <i className="bi bi-x-lg" />
                </button>
              </div>
              <div className="filters-input-pill">
                <input
                  type="number"
                  className="form-control"
                  placeholder="по"
                  value={yearTo}
                  onChange={(e) => setYearTo(e.target.value)}
                />
                <button
                  type="button"
                  className="filters-input-clear"
                  aria-label="Очистить"
                  onClick={() => setYearTo('')}
                >
                  <i className="bi bi-x-lg" />
                </button>
              </div>
            </div>
          </div>
          )}

        </div>
      </details>
    </section>
  );
}
