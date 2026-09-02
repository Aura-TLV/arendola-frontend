import { useEffect, useMemo, useRef, useState } from "react";
import "./mobile-search-flow.css";

/**
 * Поиск жилья Mobile — реализация по ТЗ (docx «Arendola ... Mobile»).
 * Разделы ТЗ отмечены в комментариях цифрами (напр. //4.5.7) для сверки.
 *
 * Пропсы:
 *  - isOpen: boolean — показывать ли флоу
 *  - onClose(): вызывается по ✕ на любом экране
 *  - onApply(bookingState): вызывается по «Найти» / «Показать варианты» (раздел 8)
 *  - initialState: предыдущее booking state (раздел 9 — сохранение состояния)
 */

const MONTHS_SHORT = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
const MONTHS_FULL = [
  "январь", "февраль", "март", "апрель", "май", "июнь",
  "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь",
];
const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_STAY_DAYS = 30; // 6.3.3

const pad2 = (n) => String(n).padStart(2, "0");
const monthKey = (y, m) => `${y}-${pad2(m + 1)}`; // m: 0-based
const isoDate = (y, m, d) => `${y}-${pad2(m + 1)}-${pad2(d)}`;
const cmpIso = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

const monthWord = (n) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "месяц";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "месяца";
  return "месяцев";
};

const ageWord = (n) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "год";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "года";
  return "лет";
};

const formatMonthChip = (key) => {
  const [y, m] = key.split("-").map(Number);
  return `${MONTHS_SHORT[m - 1]} ${y}`;
};

const CITIES = [
  // 3.2.2 — MVP: единственный доступный город (без поля ввода)
  { id: "gelendzhik", name: "Геленджик", region: "Краснодарский край" },
];

// --- следующие 12 месяцев начиная с текущего (5.3.2) ---
const nextMonthKeys = (count = 12) => {
  const now = new Date();
  const out = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    out.push(monthKey(d.getFullYear(), d.getMonth()));
  }
  return out;
};

// --- выбор до 3 месяцев заезда подряд, без пропусков (5.3.4) ---
const toggleArrivalMonth = (selected, key, allKeys) => {
  const idx = allKeys.indexOf(key);
  if (selected.includes(key)) {
    if (selected.length === 1) return [];
    const idxs = selected.map((k) => allKeys.indexOf(k)).sort((a, b) => a - b);
    const min = idxs[0];
    const max = idxs[idxs.length - 1];
    if (idx === min || idx === max) {
      return selected.filter((k) => k !== key).sort((a, b) => allKeys.indexOf(a) - allKeys.indexOf(b));
    }
    return [key]; // клик по «середине» — начинаем выбор заново
  }

  if (selected.length === 0) return [key];

  const idxs = selected.map((k) => allKeys.indexOf(k));
  const min = Math.min(...idxs);
  const max = Math.max(...idxs);

  if (idx === max + 1 && max - min + 2 <= 3) {
    return [...selected, key];
  }
  if (idx === min - 1 && max - min + 2 <= 3) {
    return [key, ...selected];
  }
  return [key]; // не подряд или превысило бы 3 — сброс на новый месяц
};

const diffDays = (a, b) => Math.round((new Date(b) - new Date(a)) / DAY_MS);

const addDaysIso = (iso, days) => {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return isoDate(dt.getFullYear(), dt.getMonth(), dt.getDate());
};

const formatShort = (iso, withYear) => {
  const [y, m, d] = iso.split("-").map(Number);
  return withYear ? `${d} ${MONTHS_SHORT[m - 1]} ${y}` : `${d} ${MONTHS_SHORT[m - 1]}`;
};

// --- 7.4: сводка для экрана «Кто» ---
const formatDatesSummary = (checkIn, checkOut) => {
  const totalDays = diffDays(checkIn, checkOut);
  const months = Math.floor(totalDays / 30);
  const extraDays = totalDays % 30;
  const sameYear = checkIn.slice(0, 4) === checkOut.slice(0, 4);

  const stayLabel = extraDays > 0 ? `${months} мес ${extraDays} дн` : `${months} мес`;
  const range = `${formatShort(checkIn, !sameYear)} → ${formatShort(checkOut, true)}`;

  return { stayLabel, range };
};

// --- 7.4 (обновлено): "Заезд: июл · авг · сен 2026" / "Заезд: дек 2026 · янв · фев 2027" ---
const formatArrivalMonthsSummary = (keys) => {
  if (!keys.length) return null;

  const sorted = [...keys].sort((a, b) => a.localeCompare(b));
  const groups = [];
  let currentYear = null;
  let currentGroup = [];

  sorted.forEach((key) => {
    const [y, m] = key.split("-").map(Number);
    if (y !== currentYear) {
      if (currentGroup.length) groups.push(currentGroup);
      currentGroup = [];
      currentYear = y;
    }
    currentGroup.push({ y, m });
  });
  if (currentGroup.length) groups.push(currentGroup);

  return groups
    .flatMap((group) =>
      group.map((item, idx) => {
        const abbr = MONTHS_SHORT[item.m - 1];
        return idx === group.length - 1 ? `${abbr} ${item.y}` : abbr;
      })
    )
    .join(" · ");
};

const createEmptyBookingState = () => ({
  city: null,
  mode: "months", // 4.3.1
  stayMonths: 1, // 4.4.1 / 5.2.1
  arrivalMonths: [], // 4.4.3
  checkIn: null,
  checkOut: null,
  adults: 1,
  children: 0,
  childAges: [],
  pets: false,
});

export default function MobileSearchFlow({ isOpen, onClose, onApply, initialState }) {
  const [screen, setScreen] = useState("where"); // 'where' | 'when' | 'who'  (раздел 2.1)
  const [booking, setBooking] = useState(() => ({
    ...createEmptyBookingState(),
    ...initialState,
  }));

  const [calendarView, setCalendarView] = useState(null); // 'checkIn' | 'checkOut' — 6.3.2

  const [childAgeErrors, setChildAgeErrors] = useState([]);

  const [openAgeIndex, setOpenAgeIndex] = useState(null);

  // 9.1 — при повторном открытии продолжаем с прежнего состояния
  useEffect(() => {
    if (isOpen) {
      setBooking((prev) => ({ ...prev, ...initialState }));
      setScreen(initialState?.city ? "when" : "where");
      setCalendarView(booking.checkIn && !booking.checkOut ? "checkOut" : "checkIn");
      setChildAgeErrors([]); // добавить
      setOpenAgeIndex(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const arrivalMonthKeys = useMemo(() => nextMonthKeys(12), []);

  if (!isOpen) return null;

  // ---------- Экран «Где» (раздел 3) ----------
  const selectCity = (city) => {
    setBooking((prev) => ({ ...prev, city })); // 3.3.1
    setScreen("when"); // автопереход, кнопки «Далее» нет — 3.3.2
  };

  // ---------- Экран «Когда» (разделы 4–6) ----------
  const setMode = (mode) => {
    // 4.5.1 — переключение вкладок само по себе не сбрасывает данные
    setBooking((prev) => ({ ...prev, mode }));
  };

  const setStayMonths = (next) => {
    const clamped = Math.max(1, Math.min(11, next)); // 5.2.3
    setBooking((prev) => ({ ...prev, stayMonths: clamped }));
  };

  const clickArrivalMonth = (key) => {
    setBooking((prev) => ({
      ...prev,
      arrivalMonths: toggleArrivalMonth(prev.arrivalMonths, key, arrivalMonthKeys),
    }));
  };

  const clickDay = (dateIso) => {
    setBooking((prev) => {
      if (!prev.checkIn || (prev.checkIn && prev.checkOut)) {
        setCalendarView("checkOut");
        return { ...prev, checkIn: dateIso, checkOut: null }; // 6.3.1 / 6.3.2
      }

      if (cmpIso(dateIso, prev.checkIn) <= 0) {
        // 6.3.7 — дата раньше текущего checkIn → исправление checkIn
        return { ...prev, checkIn: dateIso, checkOut: null };
      }

      const minCheckout = addDaysIso(prev.checkIn, MIN_STAY_DAYS);
      if (cmpIso(dateIso, minCheckout) < 0) {
        return prev; // не должно кликаться — день задизейблен
      }

      setCalendarView("checkIn");
      return { ...prev, checkOut: dateIso }; // 6.3.7 — дата позже → выбор checkOut
    });
  };

  const resetWhen = () => {
    // 10.1
    setBooking((prev) => ({
      ...prev,
      stayMonths: 1,
      arrivalMonths: [],
      checkIn: null,
      checkOut: null,
    }));
    setCalendarView("checkIn");
  };

  const onlyCheckInSelected = Boolean(booking.checkIn) && !booking.checkOut;

  const canProceedFromWhen =
    booking.mode === "months" // 5.4.1 — «Далее» отображается всегда
      ? true
      : !onlyCheckInSelected; // 6.5.1 / 6.5.2

  const proceedFromWhen = () => {
    if (!canProceedFromWhen) return;

    setBooking((prev) => {
      const hasValidDates = Boolean(prev.checkIn && prev.checkOut);
      if (prev.mode === "dates" && hasValidDates) {
        // 4.5.6 / 4.5.7 — точные даты становятся активным сценарием, месяцы заезда очищаются
        return { ...prev, arrivalMonths: [] };
      }
      return prev;
    });

    setScreen("who");
  };

  // ---------- Экран «Кто» (раздел 7) ----------
  const setAdults = (next) => setBooking((prev) => ({ ...prev, adults: Math.max(1, next) })); // 7.5.2

  const setChildren = (next) => {
    const clamped = Math.max(0, next);
    setBooking((prev) => {
      const childAges = [...prev.childAges];
      while (childAges.length < clamped) childAges.push(null);
      while (childAges.length > clamped) childAges.pop();
      return { ...prev, children: clamped, childAges };
    });
    setChildAgeErrors((prev) => prev.filter((i) => i < clamped)); // добавить
  };

  const setChildAge = (index, age) => {
    setBooking((prev) => {
      const childAges = [...prev.childAges];
      childAges[index] = age;
      return { ...prev, childAges };
    });
  };

 

  const resetAll = () => {
    setBooking(createEmptyBookingState());
    setChildAgeErrors([]); // добавить
    setOpenAgeIndex(null);
    setScreen("where");
  };


  const submitSearch = () => {
      const missingIdx = booking.childAges
        .map((age, i) => (age === null ? i : -1))
        .filter((i) => i !== -1);

      if (missingIdx.length > 0) {
        setChildAgeErrors(missingIdx); // 8.5 / 7.6.3 — error-state, поиск не выполняется
        return;
      }
      setChildAgeErrors([]);

      const hasValidDates = Boolean(booking.checkIn && booking.checkOut);
      const appliedSearchMode = hasValidDates ? "По датам" : "По месяцам";

      const finalState = {
        ...booking,
        checkIn: appliedSearchMode === "По датам" ? booking.checkIn : null,
        checkOut: appliedSearchMode === "По датам" ? booking.checkOut : null,
      };

      onApply?.({ ...finalState, appliedSearchMode });
    };

  

  return (
    <div className="sf-backdrop">
      <div className="sf-sheet">
        {/* ===== Экран «Где» ===== */}
        {screen === "where" && (
          <>
            <div className="sf-header">
              <span className="sf-header-spacer" />
              <div className="sf-header-title">Где</div>
              <button type="button" className="sf-icon-btn" onClick={onClose} aria-label="Закрыть">
                ✕
              </button>
            </div>

            <div className="sf-body">
              <div className="sf-section-label">Доступные города</div>

              <div className="sf-city-list">
                {CITIES.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    className="sf-city-card"
                    onClick={() => selectCity(city)}
                  >
                    <span>
                      <span className="sf-city-name">{city.name}</span>
                      <span className="sf-city-region">{city.region}</span>
                    </span>
                    <span className="sf-chevron">›</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ===== Экран «Когда» ===== */}
        {screen === "when" && (
          <>
            <div className="sf-header">
              <button
                type="button"
                className="sf-icon-btn sf-back-btn"
                onClick={() => setScreen("where")}
                aria-label="Назад"
              >
                ‹
              </button>
              <div className="sf-header-title">Когда</div>
              <button type="button" className="sf-icon-btn" onClick={onClose} aria-label="Закрыть">
                ✕
              </button>
            </div>

            <div className="sf-body sf-body-flush">
              <div className="sf-context">
                <div className="sf-context-label">Где</div>
                <div className="sf-context-value">{booking.city?.name}</div>
              </div>

              <div className="sf-tabs">
                <button
                  type="button"
                  className={"sf-tab" + (booking.mode === "months" ? " is-active" : "")}
                  onClick={() => setMode("months")}
                >
                  По месяцам
                </button>
                <button
                  type="button"
                  className={"sf-tab" + (booking.mode === "dates" ? " is-active" : "")}
                  onClick={() => setMode("dates")}
                >
                  По датам
                </button>
              </div>

              {booking.mode === "months" ? (
                <div className="sf-months-mode">
                  <div className="sf-section-label">Срок проживания</div>

                  <div className="sf-stepper">
                    <button
                      type="button"
                      className="sf-stepper-btn"
                      disabled={booking.stayMonths <= 1}
                      onClick={() => setStayMonths(booking.stayMonths - 1)}
                    >
                      −
                    </button>
                    <div className="sf-stepper-value">{booking.stayMonths} мес</div>
                    <button
                      type="button"
                      className="sf-stepper-btn"
                      disabled={booking.stayMonths >= 11}
                      onClick={() => setStayMonths(booking.stayMonths + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="sf-section-label">Месяцы заезда</div>

                  <div className="sf-months-grid">
                    {arrivalMonthKeys.map((key) => (
                      <button
                        key={key}
                        type="button"
                        className={
                          "sf-month-chip" + (booking.arrivalMonths.includes(key) ? " is-active" : "")
                        }
                        onClick={() => clickArrivalMonth(key)}
                      >
                        {formatMonthChip(key)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="sf-dates-mode">
                  {booking.mode === "dates" && (
                    <div className="sf-hint">Мин. срок проживания — 30 дней</div>
                  )}

                  <div className="sf-calendar-scroll">
                    {Array.from({ length: 6 }).map((_, monthOffset) => {
                      const now = new Date();
                      const y = now.getFullYear();
                      const m = now.getMonth() + monthOffset;
                      const first = new Date(y, m, 1);
                      const daysInMonth = new Date(y, m + 1, 0).getDate();
                      const leading = (first.getDay() + 6) % 7;
                      const cells = [
                        ...Array.from({ length: leading }, () => null),
                        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
                      ];

                      const todayIso = isoDate(now.getFullYear(), now.getMonth(), now.getDate());

                      return (
                        <div className="sf-calendar-month" key={`${y}-${m}`}>
                          <div className="sf-calendar-month-title">
                            {MONTHS_FULL[first.getMonth()].charAt(0).toUpperCase() +
                              MONTHS_FULL[first.getMonth()].slice(1)}{" "}
                            {first.getFullYear()}
                          </div>

                          <div className="sf-calendar-weekdays">
                            {WEEKDAYS.map((w) => (
                              <span key={w}>{w}</span>
                            ))}
                          </div>

                          <div className="sf-calendar-days">
                            {cells.map((day, idx) => {
                              if (!day) return <span key={idx} className="sf-day sf-day-empty" />;

                              const dateIso = isoDate(first.getFullYear(), first.getMonth(), day);
                              const isPast = cmpIso(dateIso, todayIso) < 0;

                              const minCheckout = booking.checkIn
                                ? addDaysIso(booking.checkIn, MIN_STAY_DAYS)
                                : null;

                              const isTooSoon =
                                booking.checkIn &&
                                !booking.checkOut &&
                                cmpIso(dateIso, booking.checkIn) > 0 &&
                                cmpIso(dateIso, minCheckout) < 0;

                              const isStart = booking.checkIn === dateIso;
                              const isEnd = booking.checkOut === dateIso;
                              const isInRange =
                                booking.checkIn &&
                                booking.checkOut &&
                                cmpIso(dateIso, booking.checkIn) > 0 &&
                                cmpIso(dateIso, booking.checkOut) < 0;

                              const disabled = isPast || isTooSoon;

                              return (
                                <button
                                  key={dateIso}
                                  type="button"
                                  className={
                                    "sf-day" +
                                    (isStart || isEnd ? " is-selected" : "") +
                                    (isInRange ? " is-in-range" : "") +
                                    (disabled ? " is-disabled" : "")
                                  }
                                  disabled={disabled}
                                  onClick={() => clickDay(dateIso)}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="sf-footer">
              <button type="button" className="sf-reset-btn" onClick={resetWhen}>
                Сброс
              </button>
              <button
                type="button"
                className="sf-cta"
                disabled={!canProceedFromWhen}
                onClick={proceedFromWhen}
              >
                Далее
              </button>
            </div>
          </>
        )}

        {/* ===== Экран «Кто» ===== */}
        {screen === "who" && (
          <>
            <div className="sf-header">
              <button
                type="button"
                className="sf-icon-btn sf-back-btn"
                onClick={() => setScreen("when")}
                aria-label="Назад"
              >
                ‹
              </button>
              <div className="sf-header-title">Кто</div>
              <button type="button" className="sf-icon-btn" onClick={onClose} aria-label="Закрыть">
                ✕
              </button>
            </div>

            <div className="sf-body">
                            <div className="sf-who-context">
                <div className="sf-who-city">{booking.city?.name}</div>

                {booking.mode === "months" ? (
                  <>
                    <div className="sf-who-summary-stay">{booking.stayMonths} мес</div>
                    {formatArrivalMonthsSummary(booking.arrivalMonths) && (
                      <div className="sf-who-summary-arrival">
                        <span className="sf-who-summary-label">Заезд: </span>
                        {formatArrivalMonthsSummary(booking.arrivalMonths)}
                      </div>
                    )}
                  </>
                ) : (
                  booking.checkIn &&
                  booking.checkOut && (
                    <>
                      <div className="sf-who-summary-stay">
                        {formatDatesSummary(booking.checkIn, booking.checkOut).stayLabel}
                      </div>
                      <div className="sf-who-summary-arrival">
                        {formatDatesSummary(booking.checkIn, booking.checkOut).range}
                      </div>
                    </>
                  )
                )}
              </div>

              <div className="sf-who-row">
                <div>
                  <div className="sf-who-row-title">Взрослые</div>
                  <div className="sf-who-row-subtitle">от 18 лет</div>
                </div>
                <div className="sf-counter">
                  <button
                    type="button"
                    disabled={booking.adults <= 1}
                    onClick={() => setAdults(booking.adults - 1)}
                  >
                    −
                  </button>
                  <span>{booking.adults}</span>
                  <button type="button" onClick={() => setAdults(booking.adults + 1)}>
                    +
                  </button>
                </div>
              </div>

              <div className="sf-who-row">
                <div>
                  <div className="sf-who-row-title">Дети</div>
                  <div className="sf-who-row-subtitle">от 0 до 17 лет</div>
                </div>
                <div className="sf-counter">
                  <button
                    type="button"
                    disabled={booking.children <= 0}
                    onClick={() => setChildren(booking.children - 1)}
                  >
                    −
                  </button>
                  <span>{booking.children}</span>
                  <button type="button" onClick={() => setChildren(booking.children + 1)}>
                    +
                  </button>
                </div>
              </div>

              {booking.childAges.map((age, index) => {
                const hasError = childAgeErrors.includes(index);
                const isOpen = openAgeIndex === index;
                const label = age === null ? "Выбрать возраст" : age === 0 ? "до года" : `${age} ${ageWord(age)}`;

                return (
                  <div className="sf-who-row" key={index}>
                    <div className="sf-who-row-title">Ребёнок {index + 1}</div>

                    <div className="sf-age-wrap">
                      <button
                        type="button"
                        className={
                          "sf-age-trigger" +
                          (hasError ? " is-error" : "") +
                          (age === null ? " is-placeholder" : "")
                        }
                        onClick={() => setOpenAgeIndex(isOpen ? null : index)}
                      >
                        {label}
                      </button>

                      {isOpen && (
                        <>
                          <div className="sf-age-backdrop" onClick={() => setOpenAgeIndex(null)} />
                          <div className="sf-age-dropdown">
                            {Array.from({ length: 18 }, (_, v) => v).map((v) => (
                              <button
                                type="button"
                                key={v}
                                className={"sf-age-option" + (age === v ? " is-selected" : "")}
                                onClick={() => {
                                  setChildAge(index, v);
                                  if (childAgeErrors.includes(index)) {
                                    setChildAgeErrors((prev) => prev.filter((i) => i !== index));
                                  }
                                  setOpenAgeIndex(null);
                                }}
                              >
                                {v === 0 ? "до года" : `${v} ${ageWord(v)}`}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              <label className="sf-who-row sf-pets-row">
                <div>
                  <div className="sf-who-row-title">Питомцы</div>
                  <div className="sf-who-row-subtitle">Жильё, где разрешены питомцы</div>
                </div>
                <span className="sf-switch">
                  <input
                    type="checkbox"
                    checked={booking.pets}
                    onChange={(e) => setBooking((prev) => ({ ...prev, pets: e.target.checked }))}
                  />
                  <span></span>
                </span>
              </label>
            </div>

            <div className="sf-footer">
              <button type="button" className="sf-reset-btn" onClick={resetAll}>
                Сбросить всё
              </button>
              <button type="button" className="sf-cta" onClick={submitSearch}>
                Найти
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
