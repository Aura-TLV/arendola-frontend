import { useMemo, useState, useEffect } from 'react';

export function ChipsRowSingle({ options, value, onChange }) {
  return (
    <div className="chips-row">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={'filter-chip' + (value === opt ? ' filter-chip-active' : '')}
          onClick={() => onChange(value === opt ? null : opt)}
        >
          <span>{opt}</span>
        </button>
      ))}
    </div>
  );
}

// multi-чипы (для "Личные удобства")
function ChipsRowMulti({ options, value, onChange }) {
  const arr = Array.isArray(value) ? value : [];

  const toggle = (opt) => {
    const next = arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt];
    onChange(next.length ? next : null);
  };

  return (
    <div className="chips-row">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={'filter-chip' + (arr.includes(opt) ? ' filter-chip-active' : '')}
          onClick={() => toggle(opt)}
        >
          <span>{opt}</span>
        </button>
      ))}
    </div>
  );
}

export default function FilterPlanAndState({ housingType, onSummaryChange, resetToken }) {
  const isApartment = housingType === 'apartment';
  const isHouse = housingType === 'house';
  const isRoom = housingType === 'room';
  const isAparthotel = housingType === 'apartHotel';

  // Видимость блоков строго по ТЗ
  const visible = useMemo(() => {
    if (isApartment) {
      return {
        isolatedBedrooms: true,
        roomsInObject: false,
        beds: true,
        bathroomsTabs: true,
        roomPrivateAmenities: false,
        balcony: true,
        balconyHasNone: false,
        repair: true,
        stove: true,
        floor: true,
      };
    }

    if (isHouse) {
      return {
        isolatedBedrooms: true, // но опции будут 1..5
        roomsInObject: false,
        beds: true,
        bathroomsTabs: true,
        roomPrivateAmenities: false,
        balcony: false,
        balconyHasNone: false,
        repair: true,
        stove: true,
        floor: false,
      };
    }

    if (isRoom) {
      return {
        isolatedBedrooms: false,
        roomsInObject: true,
        beds: true,
        bathroomsTabs: false, // заменено на "Личные удобства"
        roomPrivateAmenities: true,
        balcony: true,
        balconyHasNone: true, // есть "нет"
        repair: true,
        stove: false,
        floor: true,
      };
    }

    // aparthotel
    return {
      isolatedBedrooms: true,
      roomsInObject: false,
      beds: true,
      bathroomsTabs: true,
      roomPrivateAmenities: false,
      balcony: true,
      balconyHasNone: true, // есть "нет"
      repair: true,
      stove: false, // по ТЗ для апарт-отеля исключить кухонную плиту
      floor: true,
    };
  }, [isApartment, isHouse, isRoom, isAparthotel]);

  // --- state ---
  const [isolatedBedrooms, setIsolatedBedrooms] = useState(null); // квартира/дом/апарт
  const [roomsInObject, setRoomsInObject] = useState(null); // только комната

  const [bedsTab, setBedsTab] = useState('double');
  const [doubleBeds, setDoubleBeds] = useState(null);
  const [singleBeds, setSingleBeds] = useState(null);

  const [bathTab, setBathTab] = useState('count');
  const [bathCount, setBathCount] = useState(null);
  const [bathType, setBathType] = useState(null);
  const [bathFixture, setBathFixture] = useState(null);

  const [roomPrivateAmenities, setRoomPrivateAmenities] = useState(null); // комната: multi

  const [balcony, setBalcony] = useState(null);
  const [repair, setRepair] = useState(null);
  const [stove, setStove] = useState(null);

  const [floor, setFloor] = useState(null);
  const [notFirst, setNotFirst] = useState(false);
  const [notLast, setNotLast] = useState(false);
  const [onlyLast, setOnlyLast] = useState(false);

  // --- options по ТЗ ---
  const isolatedBedroomsOptions = useMemo(() => {
    // Квартира/Апарт: 1/2/3/4+, Дом: 1..5
    if (isHouse) return ['1', '2', '3', '4', '5'];
    return ['1', '2', '3', '4+'];
  }, [isHouse]);

  const balconyOptions = useMemo(() => {
    // Квартира: без "нет"
    if (isApartment) return ['Балкон', 'Лоджия', 'Балкон+лоджия'];
    // Комната/Апарт: с "нет"
    if (visible.balconyHasNone) return ['Нет', 'Балкон', 'Лоджия', 'Балкон+лоджия'];
    return ['Балкон', 'Лоджия', 'Балкон+лоджия'];
  }, [isApartment, visible.balconyHasNone]);

  // --- chips только по текущему типу ---
  const chips = useMemo(() => {
    const arr = [];

    if (visible.isolatedBedrooms && isolatedBedrooms) {
      // ТЗ: “Спальни: …”
      arr.push(`Спальни: ${isolatedBedrooms}`);
    }

    if (visible.roomsInObject && roomsInObject) {
      arr.push(`Комнат в объекте: ${roomsInObject}`);
    }

    if (visible.beds) {
      if (doubleBeds && doubleBeds !== 'Неважно') arr.push(`Двуспальные: ${doubleBeds}`);
      if (singleBeds && singleBeds !== 'Неважно') arr.push(`Отдельные: ${singleBeds}`);
    }

    if (visible.bathroomsTabs) {
      if (bathCount) arr.push(`Санузлов: ${bathCount}`);
      if (bathType) arr.push(`С/у: ${bathType}`);
      if (bathFixture) arr.push(`С/у: ${bathFixture}`);
    }

    if (visible.roomPrivateAmenities && Array.isArray(roomPrivateAmenities) && roomPrivateAmenities.length) {
      // можно как отдельные чипы, но для краткости в одну строку
      arr.push(`Личные удобства: ${roomPrivateAmenities.join(', ')}`);
    }

    if (visible.balcony && balcony) {
      // “Нет” тоже считаем выбранным
      arr.push(`Балкон: ${String(balcony).toLowerCase()}`);
    }

    if (visible.repair && repair) arr.push(`Ремонт: ${repair.toLowerCase()}`);

    if (visible.stove && stove) arr.push(`Плита: ${String(stove).toLowerCase()}`);

    if (visible.floor) {
      if (floor && floor !== 'Неважно') arr.push(`Этаж: ${floor}`);
      if (notFirst) arr.push('Не первый этаж');
      if (notLast) arr.push('Не последний этаж');
      if (onlyLast) arr.push('Только последний этаж');
    }

    return arr;
  }, [
    visible,
    isolatedBedrooms,
    roomsInObject,
    doubleBeds,
    singleBeds,
    bathCount,
    bathType,
    bathFixture,
    roomPrivateAmenities,
    balcony,
    repair,
    stove,
    floor,
    notFirst,
    notLast,
    onlyLast,
  ]);

  const overallSummary = useMemo(() => {
    if (!chips.length) return 'Не выбрано';
    return chips.join(' • ');
  }, [chips]);

  useEffect(() => {
    onSummaryChange?.(chips);
  }, [onSummaryChange, chips]);

  const resetAll = () => {
    setIsolatedBedrooms(null);
    setRoomsInObject(null);

    setBedsTab('double');
    setDoubleBeds(null);
    setSingleBeds(null);

    setBathTab('count');
    setBathCount(null);
    setBathType(null);
    setBathFixture(null);

    setRoomPrivateAmenities(null);

    setBalcony(null);
    setRepair(null);
    setStove(null);

    setFloor(null);
    setNotFirst(false);
    setNotLast(false);
    setOnlyLast(false);
  };

  // глобальный resetToken (кнопка “Очистить всё” в шапке)
  useEffect(() => {
    resetAll();
  }, [resetToken]);

  // при смене типа жилья чистим то, что не относится к новому типу
  useEffect(() => {
    if (!visible.isolatedBedrooms) setIsolatedBedrooms(null);
    if (!visible.roomsInObject) setRoomsInObject(null);

    if (!visible.bathroomsTabs) {
      setBathTab('count');
      setBathCount(null);
      setBathType(null);
      setBathFixture(null);
    }

    if (!visible.roomPrivateAmenities) setRoomPrivateAmenities(null);

    if (!visible.balcony) setBalcony(null);
    if (!visible.repair) setRepair(null);
    if (!visible.stove) setStove(null);

    if (!visible.floor) {
      setFloor(null);
      setNotFirst(false);
      setNotLast(false);
      setOnlyLast(false);
    }
  }, [visible]);

  const handleClear = (e) => {
    e.preventDefault();
    resetAll();
  };

  const bathroomsSelectedText = useMemo(() => {
    const list = chips.filter((c) => c.startsWith('Санузлов') || c.startsWith('С/у'));
    return list.length ? list.join(' • ') : 'Не выбрано';
  }, [chips]);

  return (
    <section className="filter-section">
      <details className="filter-accordion">
        <summary>
          <div>
            <div className="filter-accordion-title">Планировка и состояние</div>
            <div className="filter-accordion-meta">{overallSummary}</div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button type="button" className="filter-clear-link" onClick={handleClear}>
              Очистить
            </button>
            <i className="bi bi-chevron-down accordion-chevron" />
          </div>
        </summary>

        <div className="filter-accordion-body">
          {/* Изолированные спальни (квартира/дом/апарт) */}
          {visible.isolatedBedrooms && (
            <div>
              <div className="filter-subtitle">
                {isHouse ? 'Спальни' : 'Изолированные спальни'}
              </div>
              <ChipsRowSingle
                options={isolatedBedroomsOptions}
                value={isolatedBedrooms}
                onChange={setIsolatedBedrooms}
              />
            </div>
          )}

          {/* Комната: комнат в объекте */}
          {visible.roomsInObject && (
            <div>
              <div className="filter-subtitle">Комнат в объекте</div>
              <ChipsRowSingle
                options={['2к', '3к', '4к+', '5+']}
                value={roomsInObject}
                onChange={setRoomsInObject}
              />
            </div>
          )}

          {/* Кровати */}
          {visible.beds && (
            <div>
              <div className="filter-subtitle mb-2">Тип и количество кроватей</div>

              <div className="filters-area-tabs-row">
                <button
                  type="button"
                  className={'area-tab-btn' + (bedsTab === 'double' ? ' area-tab-btn-active' : '')}
                  onClick={() => setBedsTab('double')}
                >
                  Двуспальные
                </button>
                <button
                  type="button"
                  className={'area-tab-btn' + (bedsTab === 'single' ? ' area-tab-btn-active' : '')}
                  onClick={() => setBedsTab('single')}
                >
                  Отдельные
                </button>
              </div>

              {bedsTab === 'double' && (
                <ChipsRowSingle
                  options={['Неважно', '1', '2', '3', '4+']}
                  value={doubleBeds}
                  onChange={setDoubleBeds}
                />
              )}

              {bedsTab === 'single' && (
                <ChipsRowSingle
                  options={['Неважно', '1', '2', '3', '4+']}
                  value={singleBeds}
                  onChange={setSingleBeds}
                />
              )}
            </div>
          )}

          {/* Санузлы (НЕ для комнаты) */}
          {visible.bathroomsTabs && (
            <div>
              <div className="filter-subtitle mb-2">Санузлы</div>

              <div className="filters-area-tabs-row">
                <button
                  type="button"
                  className={'area-tab-btn' + (bathTab === 'count' ? ' area-tab-btn-active' : '')}
                  onClick={() => setBathTab('count')}
                >
                  Кол-во
                </button>
                <button
                  type="button"
                  className={'area-tab-btn' + (bathTab === 'type' ? ' area-tab-btn-active' : '')}
                  onClick={() => setBathTab('type')}
                >
                  Тип
                </button>
                <button
                  type="button"
                  className={'area-tab-btn' + (bathTab === 'fixtures' ? ' area-tab-btn-active' : '')}
                  onClick={() => setBathTab('fixtures')}
                >
                  Ванна/Душ
                </button>
              </div>

              <div className="bathrooms-selected small text-muted mb-2">
                Выбрано: {bathroomsSelectedText}
              </div>

              {bathTab === 'count' && (
                <ChipsRowSingle options={['1', '2', '3+']} value={bathCount} onChange={setBathCount} />
              )}

              {bathTab === 'type' && (
                <ChipsRowSingle options={['Совмещённый', 'Раздельный']} value={bathType} onChange={setBathType} />
              )}

              {bathTab === 'fixtures' && (
                <ChipsRowSingle options={['Ванна', 'Душ']} value={bathFixture} onChange={setBathFixture} />
              )}
            </div>
          )}

          {/* Комната: личные удобства */}
          {visible.roomPrivateAmenities && (
            <div>
              <div className="filter-subtitle">Личные удобства</div>
              <ChipsRowMulti
                options={['Своя ванная', 'Свой душ', 'Свой туалет']}
                value={roomPrivateAmenities}
                onChange={setRoomPrivateAmenities}
              />
            </div>
          )}

          {/* Балкон */}
          {visible.balcony && (
            <div>
              <div className="filter-subtitle">Балкон</div>
              <ChipsRowSingle options={balconyOptions} value={balcony} onChange={setBalcony} />
            </div>
          )}

          {/* Ремонт */}
          {visible.repair && (
            <div>
              <div className="filter-subtitle">Ремонт</div>
              <ChipsRowSingle
                options={['Косметический', 'Евроремонт', 'Дизайнерский']}
                value={repair}
                onChange={setRepair}
              />
            </div>
          )}

          {/* Плита (квартира+дом) */}
          {visible.stove && (
            <div>
              <div className="filter-subtitle">Кухонная плита</div>
              <ChipsRowSingle options={['Газовая', 'Электрическая']} value={stove} onChange={setStove} />
            </div>
          )}

          {/* Этаж (квартира/комната/апарт) */}
          {visible.floor && (
            <div>
              <div className="filter-subtitle">Этаж</div>
              <ChipsRowSingle
                options={['Неважно', '1', '2–5', '6–10', '11–16', '17+']}
                value={floor}
                onChange={setFloor}
              />

              <div className="filters-checkbox-row mt-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="notFirstFloor"
                    checked={notFirst}
                    onChange={(e) => setNotFirst(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="notFirstFloor">
                    Не первый
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="notLastFloor"
                    checked={notLast}
                    onChange={(e) => setNotLast(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="notLastFloor">
                    Не последний
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="onlyLastFloor"
                    checked={onlyLast}
                    onChange={(e) => setOnlyLast(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="onlyLastFloor">
                    Только последний
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </details>
    </section>
  );
}
