import { useMemo, useState, useEffect } from 'react';
import FilterPlanAndState, {
  ChipsRowSingle,
} from '../../components/listing/filters/FilterPlanAndState.jsx';
import FilterArea from '../../components/listing/filters/FilterArea.jsx';
import FilterHouseCharacteristics from '../../components/listing/filters/FilterHouseCharacteristics.jsx';
import FilterInfrastructure from '../../components/listing/filters/FilterInfrastructure.jsx';
import FilterViewAndSafety from '../../components/listing/filters/FilterViewAndSafety.jsx';
import FilterRating from '../../components/listing/filters/FilterRating.jsx';
import FilterExtra from '../../components/listing/filters/FilterExtra.jsx';

import { HOUSING_TYPES } from './constants/housingTypes.js';


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

// «верхняя» граница цены для связи с ползунком
const PRICE_MAX_LIMIT = 300000;

// какие секции показывать для каждого типа жилья (порядок важен)
const FILTERS_PROFILES = {
  [HOUSING_TYPES.APARTMENT]: {
    sections: [
      'housing',
      'price',
      'location',
      'seaDistance',
      'area',
      'planAndState',
      'houseCharacteristics',
      'infrastructure',
      'viewAndSafety',
      'rating',
      'extra',
    ],
  },

  [HOUSING_TYPES.HOUSE]: {
    sections: [
      'housing',
      'price',
      'location',
      'seaDistance',
      'area',
      'planAndState',
      'houseComms', // новое по ТЗ (пока заглушка)
      'infrastructure',
      'viewAndSafety',
      'rating',
      'extra',
    ],
  },

  [HOUSING_TYPES.ROOM]: {
    sections: [
      'housing',
      'price',
      'location',
      // seaDistance обычно не нужен, но пусть останется — если has_sea будет true
      'area',
      'planAndState',
      'houseCharacteristics', // позже сделаем roomLite
      'roomRules', // новое по ТЗ (пока заглушка)
      'infrastructure',
      // viewAndSafety по ТЗ для комнаты исключить — НЕ включаем
      'rating',
      'extra',
    ],
  },

  [HOUSING_TYPES.APARTHOTEL]: {
    sections: [
      'housing',
      'price',
      'location',
      'seaDistance',
      'area',
      'planAndState',
      // houseCharacteristics по ТЗ исключить
      'infrastructure',
      'aparthotelStars', // новое по ТЗ (пока заглушка)
      'viewAndSafety',
      'rating',
      'extra',
    ],
  },
};




// универсальный pill-инпут с крестиком
function FiltersInputPill({
  value,
  onChange,
  placeholder,
  type = 'number',
  className = '',
}) {
  const handleClear = () => {
    onChange('');
  };

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

/* ---------- саб-модалки Метро/Район ---------- */

function SubfiltersBackdrop({ children, onClose }) {
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('subfilters-backdrop')) {
      onClose();
    }
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
}) {
  const [search, setSearch] = useState('');

  const toggleStation = (name) => {
    onStationsChange((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const walkOptions = [
    'до 5 мин',
    'до 10 мин',
    'до 15 мин',
    'до 20 мин',
    'до 30 мин',
  ];

  return (
    <SubfiltersBackdrop onClose={onClose}>
      <header className="subfilters-header">
        <h3 className="subfilters-title mb-0">Метро</h3>
        <button
          type="button"
          className="subfilters-close-btn"
          onClick={onClose}
        >
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
        <div className="subfilters-list">
          <label className="form-check subfilters-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={selectedStations.includes('Охотный Ряд')}
              onChange={() => toggleStation('Охотный Ряд')}
            />
            <span className="subfilters-line-dot subfilters-line-dot-red" />
            <span className="form-check-label">Охотный Ряд</span>
          </label>

          <label className="form-check subfilters-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={selectedStations.includes('Тверская')}
              onChange={() => toggleStation('Тверская')}
            />
            <span className="subfilters-line-dot subfilters-line-dot-green" />
            <span className="form-check-label">Тверская</span>
          </label>

          <label className="form-check subfilters-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={selectedStations.includes('Площадь Революции')}
              onChange={() => toggleStation('Площадь Революции')}
            />
            <span className="subfilters-line-dot subfilters-line-dot-blue" />
            <span className="form-check-label">Площадь Революции</span>
          </label>
        </div>

        <div className="subfilters-subtitle mt-3">До метро пешком</div>
        <div className="chips-row mb-1">
          {walkOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              className={
                'filter-chip' +
                (selectedWalkTime === opt ? ' filter-chip-active' : '')
              }
              onClick={() =>
                onWalkTimeChange(selectedWalkTime === opt ? null : opt)
              }
            >
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </div>

      <footer className="subfilters-footer">
        <button
          type="button"
          className="btn btn-link subfilters-clear"
          onClick={onClear}
        >
          Очистить
        </button>
        <button
          type="button"
          className="btn btn-brand subfilters-apply"
          onClick={onClose}
        >
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
}) {
  const [search, setSearch] = useState('');

  const toggleDistrict = (name) => {
    onDistrictsChange((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]
    );
  };

  return (
    <SubfiltersBackdrop onClose={onClose}>
      <header className="subfilters-header">
        <h3 className="subfilters-title mb-0">Район</h3>
        <button
          type="button"
          className="subfilters-close-btn"
          onClick={onClose}
        >
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
        <div className="subfilters-list">
          <label className="form-check subfilters-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={selectedDistricts.includes('Центральный')}
              onChange={() => toggleDistrict('Центральный')}
            />
            <span className="form-check-label">Центральный</span>
          </label>

          <label className="form-check subfilters-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={selectedDistricts.includes('Приморский')}
              onChange={() => toggleDistrict('Приморский')}
            />
            <span className="form-check-label">Приморский</span>
          </label>

          <label className="form-check subfilters-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={selectedDistricts.includes('Красногвардейский')}
              onChange={() => toggleDistrict('Красногвардейский')}
            />
            <span className="form-check-label">Красногвардейский</span>
          </label>

          <label className="form-check subfilters-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={selectedDistricts.includes('Советский')}
              onChange={() => toggleDistrict('Советский')}
            />
            <span className="form-check-label">Советский</span>
          </label>
        </div>

        <p className="subfilters-empty d-none">
          Ничего не найдено. Попробуйте другое название района.
        </p>
      </div>

      <footer className="subfilters-footer">
        <button
          type="button"
          className="btn btn-link subfilters-clear"
          onClick={onClear}
        >
          Очистить
        </button>
        <button
          type="button"
          className="btn btn-brand subfilters-apply"
          onClick={onClose}
        >
          Применить
        </button>
      </footer>
    </SubfiltersBackdrop>
  );
}

/* ---------- ГЛАВНАЯ МОДАЛКА ---------- */

export default function FiltersModal({
  open,
  onClose,
  housingType,
  onHousingTypeChange,
  onApply, 
}) {
  if (!open) return null;

  // верхняя плашка «Показать выбранные фильтры»
  const [isPickedOpen, setIsPickedOpen] = useState(false);

  // подтипы
  const [selectedSubtypes, setSelectedSubtypes] = useState(['1-к']);

  // цена
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [priceSlider, setPriceSlider] = useState(0);
  const [noDeposit, setNoDeposit] = useState(false);
  const [utilitiesIncluded, setUtilitiesIncluded] = useState(false);

  // положение саб-модалок
  const [isMetroOpen, setIsMetroOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);

  // расстояние до моря
  const [seaDistance, setSeaDistance] = useState(null);

  // метро: станции + время пешком
  const [metroStations, setMetroStations] = useState([]);
  const [metroWalkTime, setMetroWalkTime] = useState(null);

  // районы
  const [districts, setDistricts] = useState([]);

  // площадь (поднимаем из FilterArea)
  const [totalArea, setTotalArea] = useState(null);
  const [kitchenArea, setKitchenArea] = useState(null);

  const [landArea, setLandArea] = useState(null); // ДОМ: участок


  // summary из аккордеонов/блоков
  const [planSummary, setPlanSummary] = useState(null);
  const [houseSummary, setHouseSummary] = useState(null);
  const [infraSummary, setInfraSummary] = useState(null);
  const [viewSummary, setViewSummary] = useState(null);
  const [safetySummary, setSafetySummary] = useState(null);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [extraSummary, setExtraSummary] = useState(null);

  // новые секции по ТЗ (пока простые заглушки)
  const [houseCommsSummary, setHouseCommsSummary] = useState(null);
  // Дом: Конструкция и коммуникации (по ТЗ)
  const [heatingType, setHeatingType] = useState(null);        // single
  const [wallMaterial, setWallMaterial] = useState(null);      // single
  const [commsSelected, setCommsSelected] = useState(new Set()); // multi
  const [houseFloorsMin, setHouseFloorsMin] = useState('');    // input
  const [houseFloorsMax, setHouseFloorsMax] = useState('');    // input

  const [roomRulesSummary, setRoomRulesSummary] = useState(null);
  const [aparthotelStarsSummary, setAparthotelStarsSummary] = useState(null);


  // токен для глобального сброса (меняется — дети сбрасываются)
  const [resetToken, setResetToken] = useState(0);

  useEffect(() => {
    setHeatingType(null);
    setWallMaterial(null);
    setCommsSelected(new Set());
    setHouseFloorsMin('');
    setHouseFloorsMax('');
  }, [resetToken]);


  const handleHousingTypeChangeInternal = (nextType) => {
    if (nextType === housingType) return;

    onHousingTypeChange(nextType);

    // по ТЗ: подтипы при смене типа сбрасываются
    setSelectedSubtypes([]);

    setHeatingType(null);
    setWallMaterial(null);
    setCommsSelected(new Set());
    setHouseFloorsMin('');
    setHouseFloorsMax('');


    setSeaDistance(null);
    setTotalArea(null);
    setKitchenArea(null);

    setLandArea(null);

    // чтобы чипы не "переезжали" между типами
    setPlanSummary(null);
    setHouseSummary(null);
    setInfraSummary(null);
    setViewSummary(null);
    setSafetySummary(null);
    setRatingSummary(null);
    setExtraSummary(null);

    setHouseCommsSummary(null);
    setRoomRulesSummary(null);
    setAparthotelStarsSummary(null);

    // сбросить внутренние состояния дочерних фильтров
    setResetToken((prev) => prev + 1);
  };




  // профиль по текущему типу жилья
  const profile = useMemo(
    () =>
      FILTER_PROFILE[housingType] || FILTER_PROFILE[HOUSING_TYPES.APARTMENT],
    [housingType]
  );

  const toggleComms = (label) => {
  setCommsSelected((prev) => {
    const next = new Set(prev);
    if (next.has(label)) next.delete(label);
    else next.add(label);
    return next;
  });
};

  const houseCommsChips = useMemo(() => {
    const chips = [];

    if (heatingType) chips.push(`Отопление: ${heatingType}`);
    if (wallMaterial) chips.push(`Материал стен: ${wallMaterial}`);

    [...commsSelected].forEach((x) => chips.push(x));

    const min = houseFloorsMin?.trim();
    const max = houseFloorsMax?.trim();
    if (min || max) chips.push(`Этажей в доме: ${min || '…'}–${max || '…'}`);

    return chips;
  }, [heatingType, wallMaterial, commsSelected, houseFloorsMin, houseFloorsMax]);

  useEffect(() => {
    setHouseCommsSummary(houseCommsChips.length ? houseCommsChips : null);
  }, [houseCommsChips]);


  // фон для range
  const priceSliderBg = useMemo(
    () =>
      `linear-gradient(90deg,
        var(--green) 0%,
        var(--green) ${priceSlider}%,
        #d9d9d9 ${priceSlider}%,
        #d9d9d9 100%)`,
    [priceSlider]
  );

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('filters-backdrop')) {
      onClose();
    }
  };

  const handlePickedToggle = () => {
    setIsPickedOpen((prev) => !prev);
  };

  const handleSubtypeClick = (subtype) => {
    setSelectedSubtypes((prev) =>
      prev.includes(subtype)
        ? prev.filter((s) => s !== subtype)
        : [...prev, subtype]
    );
  };

  /* ----- связь цены и ползунка ----- */

  const clampSlider = (value) =>
    Math.max(0, Math.min(100, Math.round(value)));

  const syncSliderWithPrice = (minStr, maxStr) => {
    const minNum = parseInt(minStr, 10);
    const maxNum = parseInt(maxStr, 10);

    const basis =
      !Number.isNaN(maxNum) && maxNum > 0
        ? maxNum
        : !Number.isNaN(minNum) && minNum > 0
        ? minNum
        : 0;

    const percent =
      basis <= 0 ? 0 : clampSlider((basis / PRICE_MAX_LIMIT) * 100);

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

  const clearPrice = () => {
    setPriceMin('');
    setPriceMax('');
    setPriceSlider(0);
    setNoDeposit(false);
    setUtilitiesIncluded(false);
  };

  /* ----- строки для зелёных чипов ----- */

  const housingChip = useMemo(() => {
    const main = profile.label;
    if (selectedSubtypes.length) {
      return `${main}, ${selectedSubtypes.join(', ')}`;
    }
    return main;
  }, [profile.label, selectedSubtypes]);

  const priceChip = useMemo(() => {
    // если вообще ничего не выбрано — чип не показываем
    if (!priceMin && !priceMax && !noDeposit && !utilitiesIncluded) return null;

    const parts = [];
    if (priceMin) parts.push(priceMin);
    if (priceMax) parts.push(priceMax);

    let label = 'Цена';

    if (parts.length === 2) {
      label += ` ${parts[0]}–${parts[1]} ₽`;
    } else if (parts.length === 1) {
      label += ` ${parts[0]} ₽`;
    }

    const flags = [];
    if (noDeposit) flags.push('Без залога');
    if (utilitiesIncluded) flags.push('КУ включены');

    // добавляем “хвост” как у метро через разделитель
    if (flags.length) {
      label += (parts.length ? ' • ' : ' ') + flags.join(' • ');
    }

    return label;
  }, [priceMin, priceMax, noDeposit, utilitiesIncluded]);


  const seaChip = useMemo(() => {
    if (!seaDistance) return null;
    return `До моря ${seaDistance}`;
  }, [seaDistance]);

  const areaChips = useMemo(() => {
    const chips = [];

    // totalArea:
    // - квартира/апарт: общая площадь
    // - комната: площадь комнаты (но можно оставить префикс "Площадь")
    // - дом: площадь дома
    if (totalArea) {
      if (housingType === HOUSING_TYPES.HOUSE) chips.push(`Дом ${totalArea}`);
      else if (housingType === HOUSING_TYPES.ROOM) chips.push(`Комната ${totalArea}`);
      else chips.push(`Площадь ${totalArea}`);
    }

    // кухня только не для дома/комнаты
    if (kitchenArea && housingType !== HOUSING_TYPES.HOUSE && housingType !== HOUSING_TYPES.ROOM) {
      chips.push(`Кухня ${kitchenArea}`);
    }

    // участок только для дома
    if (landArea && housingType === HOUSING_TYPES.HOUSE) {
      chips.push(`Участок ${landArea}`);
    }

    return chips;
  }, [totalArea, kitchenArea, landArea, housingType]);


  const metroChip = useMemo(() => {
    if (!metroStations.length && !metroWalkTime) return null;

    const parts = [];
    if (metroStations.length) parts.push(metroStations.join(', '));
    if (metroWalkTime) parts.push(metroWalkTime);

    return `Метро: ${parts.join(' • ')}`;
  }, [metroStations, metroWalkTime]);

  const districtChip = useMemo(() => {
    if (!districts.length) return null;
    return `Районы: ${districts.join(', ')}`;
  }, [districts]);

  // безопасный сплит summary на чипы
  const splitSummaryToChips = (summary) => {
    if (!summary) return [];
    if (summary === 'Не выбрано') return [];

    if (Array.isArray(summary)) {
      return summary
        .map((s) => String(s).trim())
        .filter(Boolean)
        .filter((s) => s !== 'Не выбрано');
    }

    if (typeof summary !== 'string') {
      return [];
    }

    return summary
      .split('•')
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => s !== 'Не выбрано');
  };

  // подписи в пиллах Метро/Район
  const metroPillHasValue = metroStations.length > 0 || !!metroWalkTime;
  const metroPillText = metroPillHasValue
    ? metroStations.length
      ? metroStations[0] +
        (metroStations.length > 1 ? ` + ещё ${metroStations.length - 1}` : '')
      : metroWalkTime
    : 'Не выбрано';

  const districtPillHasValue = districts.length > 0;

  const districtPillText = districtPillHasValue
    ? districts[0] + (districts.length > 1 ? ` + ещё ${districts.length - 1}` : '')
    : 'Не выбрано';



  // контекстные флаги (пока захардкодим, потом придёт из API/настроек города)
  const hasMetro = true;
  const hasSea = true;

  // текущий профиль по типу жилья
  const activeProfile =
    FILTERS_PROFILES[housingType] || FILTERS_PROFILES[HOUSING_TYPES.APARTMENT];



  const CHIPS_BY_SECTION = useMemo(
    () => ({
      housing: () => (housingChip ? [housingChip] : []),

      price: () => (priceChip ? [priceChip] : []),

      location: () => {
        const out = [];
        if (hasMetro && metroChip) out.push(metroChip);
        if (districtChip) out.push(districtChip);
        return out;
      },

      seaDistance: () => (hasSea && seaChip ? [seaChip] : []),

      area: () => areaChips,

      planAndState: () => splitSummaryToChips(planSummary),

      houseCharacteristics: () => splitSummaryToChips(houseSummary),

      infrastructure: () => splitSummaryToChips(infraSummary),

      viewAndSafety: () => [
        ...splitSummaryToChips(viewSummary),
        ...splitSummaryToChips(safetySummary),
      ],

      rating: () => splitSummaryToChips(ratingSummary),

      extra: () => splitSummaryToChips(extraSummary),

      // новые по ТЗ
      houseComms: () => splitSummaryToChips(houseCommsSummary),
      roomRules: () => splitSummaryToChips(roomRulesSummary),
      aparthotelStars: () => splitSummaryToChips(aparthotelStarsSummary),
    }),
    [
      housingChip,
      priceChip,
      metroChip,
      districtChip,
      seaChip,
      areaChips,
      planSummary,
      houseSummary,
      infraSummary,
      viewSummary,
      safetySummary,
      ratingSummary,
      extraSummary,
      houseCommsSummary,
      roomRulesSummary,
      aparthotelStarsSummary,
      hasMetro,
      hasSea,
    ]
  );



  const pickedChips = useMemo(() => {
    const chips = [];

    activeProfile.sections.forEach((sectionId) => {
      const build = CHIPS_BY_SECTION[sectionId];
      if (!build) return;

      const res = build();
      if (Array.isArray(res)) chips.push(...res);
    });

    // на всякий: чистим пустое
    return chips.filter(Boolean);
  }, [activeProfile.sections, CHIPS_BY_SECTION]);


  const pickedCount = pickedChips.length;

  /* ----- глобальная кнопка Очистить ----- */

  const clearAllFilters = () => {
    setSelectedSubtypes([]);

    setHeatingType(null);
    setWallMaterial(null);
    setCommsSelected(new Set());
    setHouseFloorsMin('');
    setHouseFloorsMax('');


    clearPrice();

    setSeaDistance(null);

    setTotalArea(null);
    setKitchenArea(null);

    setLandArea(null);

    setPlanSummary(null);
    setHouseSummary(null);
    setInfraSummary(null);
    setViewSummary(null);
    setSafetySummary(null);
    setRatingSummary(null);
    setExtraSummary(null);

    setMetroStations([]);
    setMetroWalkTime(null);
    setDistricts([]);

    setHouseCommsSummary(null);
    setRoomRulesSummary(null);
    setAparthotelStarsSummary(null);


    setResetToken((prev) => prev + 1);
  };

  const handleApplyAndClose = () => {
    onApply?.({
      housingType,
      selectedSubtypes,
      priceMin,
      priceMax,
      // ВАЖНО: флаги КУ/без залога можешь тоже отдать,
      // но в быстрых мы их просто не будем показывать (по требованию заказчика)
      // noDeposit,
      // utilitiesIncluded,

      metroStations,
      metroWalkTime,
      districts,
    });

    onClose();
  };




// registry: как рендерить каждую секцию
const FILTERS_REGISTRY = {
  housing: () => (
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
            className={'segment-btn' + (type === housingType ? ' segment-btn-active' : '')}
            onClick={() => handleHousingTypeChangeInternal(type)}
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
        <div className="filter-subtitle-muted d-md-none ms-auto">
          Можно несколько
        </div>
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
            onClick={() => handleSubtypeClick(subtype)}
          >
            <span>{subtype}</span>
          </button>
        ))}
      </div>
    </section>
  ),

  price: () => (
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

      <div className="filters-checkbox-row">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="noDeposit"
            checked={noDeposit}
            onChange={(e) => setNoDeposit(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="noDeposit">
            Без залога
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="utilitiesIncluded"
            checked={utilitiesIncluded}
            onChange={(e) => setUtilitiesIncluded(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="utilitiesIncluded">
            КУ включены
          </label>
        </div>
      </div>
    </section>
  ),

  location: () => (
    <section className="filter-section">
      <div className="filter-section-header">
        <div className="filter-section-title">Расположение</div>
        <button
          type="button"
          className="filter-clear-link"
          onClick={() => {
            setMetroStations([]);
            setMetroWalkTime(null);
            setDistricts([]);
          }}
        >
          Очистить
        </button>
      </div>

      <div className="filters-field-pills mb-2">
        {/* Метро показываем только если hasMetro */}
        {hasMetro && (
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
        )}

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
  ),

  seaDistance: () =>
    hasSea ? (
      <section className="filter-section">
        <div className="filter-section-header">
          <div className="filter-section-title">Расстояние до моря</div>
          <button
            type="button"
            className="filter-clear-link"
            onClick={() => setSeaDistance(null)}
          >
            Очистить
          </button>
        </div>

        <ChipsRowSingle
          options={['до 200 м', 'до 500 м', 'до 1 км', 'до 2 км']}
          value={seaDistance}
          onChange={setSeaDistance}
        />
      </section>
    ) : null,

  area: () => (
    <FilterArea
      housingType={housingType}
      totalArea={totalArea}
      setTotalArea={setTotalArea}
      kitchenArea={kitchenArea}
      setKitchenArea={setKitchenArea}
      landArea={landArea}
      setLandArea={setLandArea}
    />
  ),

  planAndState: () => (
    <FilterPlanAndState
      housingType={housingType}
      onSummaryChange={setPlanSummary}
      resetToken={resetToken}
    />
  ),

  houseCharacteristics: () => (
    <FilterHouseCharacteristics
      housingType={housingType}
      onSummaryChange={setHouseSummary}
      resetToken={resetToken}
    />
  ),

  infrastructure: () => (
    <FilterInfrastructure
      housingType={housingType}
      onSummaryChange={setInfraSummary}
      resetToken={resetToken}
    />
  ),

  viewAndSafety: () => (
    <FilterViewAndSafety
      housingType={housingType}
      onViewSummaryChange={setViewSummary}
      onSafetySummaryChange={setSafetySummary}
      resetToken={resetToken}
    />
  ),

  rating: () => (
    <FilterRating
      housingType={housingType}
      onSummaryChange={setRatingSummary}
      resetToken={resetToken}
    />
  ),

  extra: () => (
    <FilterExtra
      housingType={housingType}
      onSummaryChange={setExtraSummary}
      resetToken={resetToken}
    />
  ),


  // ===== заглушки новых секций по ТЗ (чтобы заказчику уже показать структуру) =====

  houseComms: () => {
    const HEATING_OPTIONS = [
      'Автономное газовое',
      'Центральное газовое',
      'Электрическое',
      'Печь',
      'Камин',
      'Дизельное',
      'Твёрдотопливный котёл',
    ];

    const WALL_MATERIAL_OPTIONS = [
      'Кирпичный',
      'Монолитный',
      'Щитовой',
      'Каркасный',
      'Деревянный',
      'Блочный',
      'Панельный',
      'Газобетонный блок',
      'Пенобетонный блок',
    ];

    const COMMS_OPTIONS = ['Газ', 'Вода', 'Канализация', 'Электричество', 'Отопление'];

    const clearHouseComms = (e) => {
      if (e?.preventDefault) e.preventDefault();
      setHeatingType(null);
      setWallMaterial(null);
      setCommsSelected(new Set());
      setHouseFloorsMin('');
      setHouseFloorsMax('');
    };

    // лёгкая валидация min/max (не блокируем ввод, просто подправляем при blur)
    const normalizeFloors = () => {
      const minNum = parseInt(houseFloorsMin, 10);
      const maxNum = parseInt(houseFloorsMax, 10);
      if (!Number.isNaN(minNum) && !Number.isNaN(maxNum) && minNum > maxNum) {
        setHouseFloorsMin(String(maxNum));
        setHouseFloorsMax(String(minNum));
      }
    };

    const meta = houseCommsChips.length
      ? (houseCommsChips.length <= 2
          ? houseCommsChips.join(' • ')
          : `${houseCommsChips.slice(0, 2).join(' • ')} + ещё ${houseCommsChips.length - 2}`)
      : 'Не выбрано';

    return (
      <section className="filter-section">
        <details className="filter-accordion">
          <summary>
            <div>
              <div className="filter-accordion-title">Конструкция и коммуникации</div>
              <div className="filter-accordion-meta">{meta}</div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button type="button" className="filter-clear-link" onClick={clearHouseComms}>
                Очистить
              </button>
              <i className="bi bi-chevron-down accordion-chevron" />
            </div>
          </summary>

          <div className="filter-accordion-body">
            {/* Тип отопления (single) */}
            <div className="mb-3">
              <div className="filter-subtitle d-flex align-items-center justify-content-between">
                <span>Тип отопления</span>
                <button type="button" className="filter-clear-link" onClick={() => setHeatingType(null)}>
                  Очистить
                </button>
              </div>
              <ChipsRowSingle options={HEATING_OPTIONS} value={heatingType} onChange={setHeatingType} />
            </div>

            {/* Материал стен (single) */}
            <div className="mb-3">
              <div className="filter-subtitle d-flex align-items-center justify-content-between">
                <span>Материал стен</span>
                <button type="button" className="filter-clear-link" onClick={() => setWallMaterial(null)}>
                  Очистить
                </button>
              </div>
              <ChipsRowSingle options={WALL_MATERIAL_OPTIONS} value={wallMaterial} onChange={setWallMaterial} />
            </div>

            {/* Коммуникации (multi) */}
            <div className="mb-3">
              <div className="filter-subtitle d-flex align-items-center justify-content-between">
                <span>Коммуникации</span>
                <button
                  type="button"
                  className="filter-clear-link"
                  onClick={() => setCommsSelected(new Set())}
                >
                  Очистить
                </button>
              </div>

              <div className="chips-row">
                {COMMS_OPTIONS.map((x) => (
                  <button
                    key={x}
                    type="button"
                    className={'filter-chip' + (commsSelected.has(x) ? ' filter-chip-active' : '')}
                    onClick={() => toggleComms(x)}
                  >
                    <span>{x}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Этажей в доме (min/max) */}
            <div>
              <div className="filter-subtitle d-flex align-items-center justify-content-between">
                <span>Этажей в доме</span>
                <button
                  type="button"
                  className="filter-clear-link"
                  onClick={() => {
                    setHouseFloorsMin('');
                    setHouseFloorsMax('');
                  }}
                >
                  Очистить
                </button>
              </div>

              <div className="filters-inline-inputs mb-2">
                <FiltersInputPill
                  className="filters-input-min"
                  value={houseFloorsMin}
                  onChange={setHouseFloorsMin}
                  placeholder="мин"
                />
                <FiltersInputPill
                  className="filters-input-max"
                  value={houseFloorsMax}
                  onChange={setHouseFloorsMax}
                  placeholder="макс"
                />
              </div>

              
            </div>
          </div>
        </details>
      </section>
    );
  },


  roomRules: () => (
    <section className="filter-section">
      <div className="filter-section-header">
        <div className="filter-section-title">Правила заселения</div>
        <button
          type="button"
          className="filter-clear-link"
          onClick={() => setRoomRulesSummary(null)}
        >
          Очистить
        </button>
      </div>

      <ChipsRowSingle
        options={['Женщины', 'Мужчины', 'Пары', 'Семьи']}
        value={roomRulesSummary}
        onChange={setRoomRulesSummary}
      />
    </section>
  ),


  aparthotelStars: () => {
    const meta = aparthotelStarsSummary ? String(aparthotelStarsSummary) : 'Не выбрано';

    return (
      <section className="filter-section">
        <details className="filter-accordion">
          <summary>
            <div>
              <div className="filter-accordion-title">Классификация апарт-отеля</div>
              <div className="filter-accordion-meta">{meta}</div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="filter-clear-link"
                onClick={(e) => {
                  e.preventDefault();
                  setAparthotelStarsSummary(null);
                }}
              >
                Очистить
              </button>
              <i className="bi bi-chevron-down accordion-chevron" />
            </div>
          </summary>

          <div className="filter-accordion-body">
            <ChipsRowSingle
              options={['3★', '4★', '5★']}
              value={aparthotelStarsSummary}
              onChange={setAparthotelStarsSummary}
            />
          </div>
        </details>
      </section>
    );
  },

};


  return (
    <div className="filters-backdrop is-open" onClick={handleBackdropClick}>
      <div
        className={
          'filters-panel ' +
          (isPickedOpen
            ? 'filters-panel-picked-open'
            : 'filters-panel-picked-closed')
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <header className="filters-header">
          <h2 className="filters-title mb-0">Все фильтры</h2>

          <div className="d-flex align-items-center gap-3 ms-auto">
            <button
              type="button"
              className="filters-reset-btn"
              disabled={pickedCount === 0}
              onClick={clearAllFilters}
            >
              Очистить
            </button>

            <button
              type="button"
              className="filters-close-btn d-none d-md-inline"
              onClick={onClose}
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>
        </header>

        {/* КНОПКА "Показать выбранные фильтры" */}
        <div className="filters-picked-bar">
          <button
            type="button"
            className={'btn-filters-picked' + (isPickedOpen ? ' is-open' : '')}
            onClick={handlePickedToggle}
          >
            <i className="bi bi-funnel" />
            <span>
              Показать выбранные фильтры
              {pickedCount ? ` (${pickedCount})` : ''}
            </span>
            <i className="bi bi-caret-down-fill filters-picked-arrow" />
          </button>
        </div>

        {/* ЗЕЛЁНЫЕ ЧИПЫ */}
        <div className={'filters-summary' + (isPickedOpen ? ' is-open' : '')}>
          {pickedChips.slice(0, 10).map((chip, idx) => (
            <span key={idx} className="filters-summary-chip">
              {chip}
            </span>
          ))}
          {pickedChips.length > 10 && (
            <span className="filters-summary-more">
              + ещё {pickedChips.length - 10}
            </span>
          )}

        </div>

        {/* BODY */}
        <div className="filters-body">
          {activeProfile.sections.map((id) => (
            <div key={id}>{FILTERS_REGISTRY[id]?.()}</div>
          ))}
        </div>


        {/* FOOTER */}
        <footer className="filters-footer">
          <div className="filters-footer-inner d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-md-between gap-2">
            <div className="filters-footer-note text-center text-md-start">
              Найдено <strong>1045 объектов</strong>
            </div>
            <button
              type="button"
              className="btn btn-brand listing-cta mx-auto mx-md-0"
              onClick={handleApplyAndClose}
            >
              Показать 1045 объектов
            </button>

          </div>
        </footer>
      </div>

      {/* Саб-модалки */}
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
    </div>
  );
}
