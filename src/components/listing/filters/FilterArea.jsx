import { useEffect, useMemo, useState } from 'react';
//import { HOUSING_TYPES } from '../../../pages/Listing/FiltersModal.jsx';
import { HOUSING_TYPES } from '../../../pages/Listing/constants/housingTypes.js';


// FilterArea по ТЗ:
// - apartment/aparthotel: табы Общая/Кухня
// - room: Площадь комнаты (до 20 / 20–30 / 30+)
// - house: табы Дом/Участок

export default function FilterArea({
  housingType,
  totalArea,
  setTotalArea,
  kitchenArea,
  setKitchenArea,

  // новые (для дома)
  landArea,
  setLandArea,
}) {
  const isRoom = housingType === HOUSING_TYPES.ROOM;
  const isHouse = housingType === HOUSING_TYPES.HOUSE;

  // активная вкладка:
  // apartment/aparthotel: total | kitchen
  // house: house | land
  const [activeTab, setActiveTab] = useState(isHouse ? 'house' : 'total');

  // при смене типа — приводим вкладку к валидной
  useEffect(() => {
    if (isHouse) setActiveTab('house');
    else setActiveTab('total');
  }, [isHouse, housingType]);

  const handleChipClick = (value, current, setter) => {
    setter(current === value ? null : value);
  };

  const clearAll = () => {
    setTotalArea?.(null);
    setKitchenArea?.(null);
    setLandArea?.(null);
  };

  const title = useMemo(() => {
    if (isRoom) return 'Площадь комнаты';
    return 'Площадь';
  }, [isRoom]);

  // варианты по ТЗ
  const roomOptions = ['до 20 м²', '20–30 м²', '30+ м²'];

  const houseOptions = ['до 100 м²', '100–150 м²', '150–250 м²', '250+ м²'];
  const landOptions = ['до 2 соток', '2–4 сотки', '4–8 соток', '8+ соток'];

  const aptTotalOptions = [
    'Неважно',
    'до 30 м²',
    '30–45 м²',
    '45–60 м²',
    '60–80 м²',
    '80+ м²',
  ];

  const aptKitchenOptions = ['Неважно', 'от 6 м²', 'от 8 м²', 'от 10 м²', 'от 12 м²', 'от 15 м²'];

  return (
    <section className="filter-section">
      <div className="filter-section-header">
        <div className="filter-section-title">{title}</div>
        <button type="button" className="filter-clear-link" onClick={clearAll}>
          Очистить
        </button>
      </div>

      {/* ROOM: без табов */}
      {isRoom && (
        <div className="chips-row mb-1">
          {roomOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              className={'filter-chip' + (totalArea === opt ? ' filter-chip-active' : '')}
              onClick={() => handleChipClick(opt, totalArea, setTotalArea)}
            >
              <span>{opt}</span>
            </button>
          ))}
        </div>
      )}

      {/* HOUSE: табы Дом / Участок */}
      {isHouse && (
        <>
          <div className="filters-area-tabs-row">
            <button
              type="button"
              className={'area-tab-btn' + (activeTab === 'house' ? ' area-tab-btn-active' : '')}
              onClick={() => setActiveTab('house')}
            >
              Дом
            </button>
            <button
              type="button"
              className={'area-tab-btn' + (activeTab === 'land' ? ' area-tab-btn-active' : '')}
              onClick={() => setActiveTab('land')}
            >
              Участок
            </button>
          </div>

          {activeTab === 'house' && (
            <div className="chips-row mb-1" data-area-content="house">
              {houseOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={'filter-chip' + (totalArea === opt ? ' filter-chip-active' : '')}
                  onClick={() => handleChipClick(opt, totalArea, setTotalArea)}
                >
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'land' && (
            <div className="chips-row mb-1" data-area-content="land">
              {landOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={'filter-chip' + (landArea === opt ? ' filter-chip-active' : '')}
                  onClick={() => handleChipClick(opt, landArea, setLandArea)}
                >
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* APARTMENT / APARTHOTEL: табы Общая / Кухня */}
      {!isRoom && !isHouse && (
        <>
          <div className="filters-area-tabs-row">
            <button
              type="button"
              className={'area-tab-btn' + (activeTab === 'total' ? ' area-tab-btn-active' : '')}
              onClick={() => setActiveTab('total')}
            >
              Общая
            </button>
            <button
              type="button"
              className={'area-tab-btn' + (activeTab === 'kitchen' ? ' area-tab-btn-active' : '')}
              onClick={() => setActiveTab('kitchen')}
            >
              Кухня
            </button>
          </div>

          {activeTab === 'total' && (
            <div className="chips-row mb-1" data-area-content="total">
              {aptTotalOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={'filter-chip' + (totalArea === opt ? ' filter-chip-active' : '')}
                  onClick={() => handleChipClick(opt, totalArea, setTotalArea)}
                >
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'kitchen' && (
            <div className="chips-row mb-1" data-area-content="kitchen">
              {aptKitchenOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={'filter-chip' + (kitchenArea === opt ? ' filter-chip-active' : '')}
                  onClick={() => handleChipClick(opt, kitchenArea, setKitchenArea)}
                >
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
