import { forwardRef, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const DateRangePanel = forwardRef(function DateRangePanel(props, ref) {
  const { when, onWhenChange } = props;
  const { t } = useTranslation();

  const tab = when.mode ?? 'months'; // по умолчанию months
  const rentMonths = when.months.rentMonths;
  const selectedMonths = when.months.selected;
  const startMonth = when.months.start ?? null;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const pad2 = (n) => String(n).padStart(2, '0');

  // =========================
  // Dates (calendar) helpers
  // =========================
  const isoDate = (y, m, d) => `${y}-${pad2(m)}-${pad2(d)}`;
  const cmpIso = (a, b) => (a < b ? -1 : a > b ? 1 : 0); // YYYY-MM-DD safe
  const inRangeIso = (x, a, b) => cmpIso(x, a) >= 0 && cmpIso(x, b) <= 0;

  const todayIso = useMemo(() => {
    const now = new Date();
    return isoDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  // текущий "левый" месяц календаря (если уже листали — используем сохранённый)
  const viewBase = useMemo(() => {
    if (when.dates?.viewBase) return when.dates.viewBase; // {y, m}
    const now = new Date();
    return { y: now.getFullYear(), m: now.getMonth() + 1 };
  }, [when.dates?.viewBase]);

  const leftYM = viewBase;
  const rightYM = useMemo(() => {
    const d = new Date(leftYM.y, leftYM.m - 1 + 1, 1);
    return { y: d.getFullYear(), m: d.getMonth() + 1 };
  }, [leftYM]);

  const monthTitleRu = (y, m) => {
    const fmt = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' });
    const d = new Date(y, m - 1, 1);
    const raw = fmt.format(d); // "февраль 2026 г."
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  };

  // (Пн=0 ... Вс=6)
  const getMonthGrid = (y, m) => {
    const first = new Date(y, m - 1, 1);
    const daysInMonth = new Date(y, m, 0).getDate();

    // JS: Вс=0..Сб=6. Нам надо Пн=0..Вс=6
    const jsDow = first.getDay();
    const leading = (jsDow + 6) % 7;

    const cells = [];
    for (let i = 0; i < leading; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    // добиваем до кратности 7 (чтобы сетка ровная)
    while (cells.length % 7 !== 0) cells.push(null);

    return cells;
  };

  const handleDayClick = (dateIso) => {
    onWhenChange((prev) => {
      const { from, to } = prev.dates || { from: null, to: null };

      // если ничего нет или диапазон уже закрыт — начинаем заново
      if (!from || (from && to)) {
        return {
          ...prev,
          mode: 'dates',
          dates: { ...prev.dates, from: dateIso, to: null },
        };
      }

      // если кликнули раньше from — переносим from
      if (cmpIso(dateIso, from) < 0) {
        return {
          ...prev,
          mode: 'dates',
          dates: { ...prev.dates, from: dateIso, to: null },
        };
      }

      // иначе закрываем диапазон
      return {
        ...prev,
        mode: 'dates',
        dates: { ...prev.dates, from, to: dateIso },
      };
    });
  };

  const getDayClass = (dateIso) => {
    const from = when.dates?.from || null;
    const to = when.dates?.to || null;

    const isToday = dateIso === todayIso;
    const isStart = from && dateIso === from;
    const isEnd = to && dateIso === to;
    const isIn = from && to && inRangeIso(dateIso, from, to);

    let cls = 'dr-day';
    if (isIn) cls += ' dr-day-in-range';
    if (isStart) cls += ' dr-day-start';
    if (isEnd) cls += ' dr-day-end';
    if (!isStart && !isEnd && !isIn && isToday) cls += ' dr-day-today';

    return cls;
  };

  const renderMonth = (y, m) => {
    const grid = getMonthGrid(y, m);

    return (
      <>
        <div className="dr-weekdays">
          <span>{t('datePanel.weekMon') || 'П'}</span>
          <span>{t('datePanel.weekTue') || 'В'}</span>
          <span>{t('datePanel.weekWed') || 'С'}</span>
          <span>{t('datePanel.weekThu') || 'Ч'}</span>
          <span>{t('datePanel.weekFri') || 'П'}</span>
          <span>{t('datePanel.weekSat') || 'С'}</span>
          <span>{t('datePanel.weekSun') || 'В'}</span>
        </div>

        <div className="dr-days">
          {grid.map((d, idx) => {
            if (!d) return <span key={`e-${y}-${m}-${idx}`} className="dr-day dr-day-empty" />;

            const dateIso = isoDate(y, m, d);
            return (
              <button
                key={dateIso}
                type="button"
                className={getDayClass(dateIso)}
                onClick={() => handleDayClick(dateIso)}
              >
                {d}
              </button>
            );
          })}
        </div>
      </>
    );
  };

  const navMonth = (dir) => {
    onWhenChange((prev) => {
      const base = prev.dates?.viewBase
        ? prev.dates.viewBase
        : (() => {
            const now = new Date();
            return { y: now.getFullYear(), m: now.getMonth() + 1 };
          })();

      const d = new Date(base.y, base.m - 1 + dir, 1);
      return {
        ...prev,
        mode: 'dates',
        dates: {
          ...prev.dates,
          viewBase: { y: d.getFullYear(), m: d.getMonth() + 1 },
        },
      };
    });
  };

  // =========================
  // Flex chips (real state)
  // =========================
  const FLEX = useMemo(
    () => [
      { key: 'exact', label: t('datePanel.chipExact') || 'Точные даты' },
      { key: 'plus1', label: t('datePanel.chipPlus1') || '± 1 день' },
      { key: 'plus2', label: t('datePanel.chipPlus2') || '± 2 дня' },
      { key: 'plus3', label: t('datePanel.chipPlus3') || '± 3 дня' },
      { key: 'plus7', label: t('datePanel.chipPlus7') || '± 7 дней' },
      { key: 'plus14', label: t('datePanel.chipPlus14') || '± 14 дней' },
    ],
    [t]
  );

  const setFlex = (key) => {
    onWhenChange((prev) => ({
      ...prev,
      mode: 'dates',
      flex: key,
    }));
  };

  // =========================
  // Months tab (как у тебя)
  // =========================
  const buildMonthRange = (startValue, len) => {
    const [y, m] = startValue.split('-').map(Number);
    const out = [];
    for (let i = 0; i < len; i++) {
      const d = new Date(y, m - 1 + i, 1);
      out.push(`${d.getFullYear()}-${pad2(d.getMonth() + 1)}`);
    }
    return out;
  };

  const minMonth = (set) => {
    const arr = Array.from(set || []);
    if (!arr.length) return null;
    arr.sort();
    return arr[0];
  };

  const MONTH_CARDS = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const fmt = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' });

    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;

      const labelRaw = fmt.format(d);
      const label = labelRaw.charAt(0).toUpperCase() + labelRaw.slice(1);

      return { label, value: `${y}-${pad2(m)}` };
    });
  }, []);

  const monthsRailRef = useRef(null);
  const scrollMonths = (dir) => {
    const rail = monthsRailRef.current;
    if (!rail) return;
    const step = Math.max(240, rail.clientWidth * 0.7);
    rail.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const setRentMonths = (nextRent) => {
    onWhenChange((prev) => {
      const next = clamp(nextRent, 1, 11);

      if (next === 1) {
        return {
          ...prev,
          mode: 'months',
          months: { ...prev.months, rentMonths: 1, start: null },
        };
      }

      const start = prev.months.start || minMonth(prev.months.selected);

      if (!start) {
        return {
          ...prev,
          mode: 'months',
          months: { ...prev.months, rentMonths: next, start: null },
        };
      }

      const range = buildMonthRange(start, next);
      return {
        ...prev,
        mode: 'months',
        months: {
          ...prev.months,
          rentMonths: next,
          start,
          selected: new Set(range),
        },
      };
    });
  };

  const onMonthClick = (value) => {
    onWhenChange((prev) => {
      const len = prev.months.rentMonths;

      if (len === 1) {
        const next = new Set(prev.months.selected);
        if (next.has(value)) next.delete(value);
        else next.add(value);

        return {
          ...prev,
          mode: 'months',
          months: { ...prev.months, selected: next, start: null },
        };
      }

      const range = buildMonthRange(value, len);
      return {
        ...prev,
        mode: 'months',
        months: { ...prev.months, start: value, selected: new Set(range) },
      };
    });
  };

  const showStartHint = tab === 'months' && rentMonths > 1 && !startMonth;

  return (
    <div className="date-range-panel" ref={ref}>
      {/* Tabs */}
        <div className="dr-tabs">
          <button
            type="button"
            className={'dr-tab' + (tab === 'months' ? ' dr-tab-active' : '')}
            onClick={() => onWhenChange((prev) => ({ ...prev, mode: 'months' }))}
          >
            {t('datePanel.tabMonths') || 'Месяцы'}
          </button>

          <button
            type="button"
            className={'dr-tab' + (tab === 'dates' ? ' dr-tab-active' : '')}
            onClick={() => onWhenChange((prev) => ({ ...prev, mode: 'dates' }))}
          >
            {t('datePanel.tabDates') || 'Даты'}
          </button>
        </div>

      {/* ===== TAB: Dates ===== */}
      {tab === 'dates' && (
        <>
          <div className="dr-content">
            {/* Left month */}
            <div className="dr-month">
              <div className="dr-month-header">
                <button type="button" className="dr-nav-btn" aria-label="prev" onClick={() => navMonth(-1)}>
                  &lt;
                </button>
                <span className="dr-month-title">{monthTitleRu(leftYM.y, leftYM.m)}</span>
                <span style={{ width: 32 }} />
              </div>

              {renderMonth(leftYM.y, leftYM.m)}
            </div>

            {/* Right month */}
            <div className="dr-month">
              <div className="dr-month-header">
                <span style={{ width: 32 }} />
                <span className="dr-month-title">{monthTitleRu(rightYM.y, rightYM.m)}</span>
                <button type="button" className="dr-nav-btn" aria-label="next" onClick={() => navMonth(1)}>
                  &gt;
                </button>
              </div>

              {renderMonth(rightYM.y, rightYM.m)}
            </div>
          </div>

          {/* Flex chips */}
          <div className="dr-footer">
            {FLEX.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={'dr-chip' + ((when.flex || 'exact') === key ? ' dr-chip-active' : '')}
                onClick={() => setFlex(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ===== TAB: Months ===== */}
      {tab === 'months' && (
        <div className="dr-months-ui">
          <div className="dr-block">
            <div className="dr-block-title">Срок аренды</div>

            <div className="dr-stepper">
              <button type="button" className="dr-stepper-btn" aria-label="minus" onClick={() => setRentMonths(rentMonths - 1)}>
                −
              </button>

              <div className="dr-stepper-value">
                <div className="dr-stepper-num">{rentMonths}</div>
                <div className="dr-stepper-caption">
                  {rentMonths === 1 ? 'месяц' : rentMonths < 5 ? 'месяца' : 'месяцев'}
                </div>
              </div>

              <button type="button" className="dr-stepper-btn" aria-label="plus" onClick={() => setRentMonths(rentMonths + 1)}>
                +
              </button>
            </div>
          </div>

          <div className="dr-block">
            {showStartHint && <div className="dr-hint">Выберите ниже первый месяц аренды</div>}

            <div className="dr-block-title">Месяцы заезда</div>

            <div className="dr-months-slider">
              <button type="button" className="dr-months-arrow dr-months-arrow-prev" aria-label="prev months" onClick={() => scrollMonths(-1)}>
                ‹
              </button>

              <div className="dr-month-cards" ref={monthsRailRef}>
                {MONTH_CARDS.map(({ label, value }) => {
                  const active = selectedMonths.has(value);

                  return (
                    <button
                      key={value}
                      type="button"
                      className={'dr-chip' + (active ? ' dr-chip-active' : '')}
                      onClick={() => onMonthClick(value)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <button type="button" className="dr-months-arrow dr-months-arrow-next" aria-label="next months" onClick={() => scrollMonths(1)}>
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default DateRangePanel;
