import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import img1 from "../../assets/img/ar-img-1.png";
import img1b from "../../assets/img/ar-img-1b.png";
import img1c from "../../assets/img/ar-img-1c.png";
import "./object-page.listing-match.css";

const DAY_MS = 24 * 60 * 60 * 1000;

const BOOKING_STORAGE_KEY = "arendola_object_booking_state";

const formatPrice = (value) =>
  new Intl.NumberFormat("ru-RU").format(value) + " ₽";

const pluralize = (value, one, few, many) => {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
};

const formatStay = (days) => {
  const months = Math.floor(days / 30);
  const restDays = days % 30;

  if (months > 0 && restDays > 0) {
    return `${months} мес ${restDays} дн`;
  }

  if (months > 0) {
    return `${months} мес`;
  }

  return `${days} дн`;
};

const addDays = (dateString, days) => {
  if (!dateString) return null;
  const next = new Date(dateString);
  if (Number.isNaN(next.getTime())) return null;
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
};

const diffDays = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return null;
  const from = new Date(checkIn);
  const to = new Date(checkOut);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;
  return Math.max(Math.round((to - from) / DAY_MS), 0);
};

const formatMonthInputLabel = (value) => {
  if (!value) return "";
  const [year, month] = value.split("-");
  const monthNames = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ];

  const monthIndex = Number(month) - 1;
  if (monthIndex < 0 || monthIndex > 11) return value;

  return `${monthNames[monthIndex]} ${year}`;
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  const months = [
    "янв",
    "фев",
    "мар",
    "апр",
    "мая",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatArrivalMonthsLine = (months) => {
  if (!months || months.length === 0) return "Июль · август 2026";

  const labels = months.map((month) => {
    const [year, monthNumber] = month.split("-");
    const monthNames = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];

    return `${monthNames[Number(monthNumber) - 1]} ${year}`;
  });

  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} · ${labels[1].toLowerCase()}`;

  return labels.join(", ");
};

const createEmptyBookingState = () => ({
  stayDays: null,
  guests: 1,
  adults: 1,
  children: 0,
  childAges: [],
  pets: 0,
  petDescription: "",
  checkIn: null,
  checkOut: null,
  arrivalMonths: [],
  invalidStateMessage: "",
});



const shouldShowAvailableFrom = ({
  bookingState,
  availableFromLabel,
  availableFromMonthKey,
}) => {
  if (!availableFromLabel) return false;

  const hasExactDates = Boolean(bookingState.checkIn && bookingState.checkOut);
  if (hasExactDates) return false;

  const hasStay = Boolean(bookingState.stayDays);
  const hasMonths = bookingState.arrivalMonths.length > 0;

  if (!hasStay && !hasMonths) return true;
  if (hasStay && !hasMonths) return true;

  if (hasMonths) {
    return bookingState.arrivalMonths.includes(availableFromMonthKey);
  }

  return false;
};

const buildStayCardViewModel = ({
  bookingState,
  derivedStayDays,
  availableFromLabel,
  availableFromMonthKey,
  pluralize,
  formatStay,
}) => {
  const hasExactDates = Boolean(bookingState.checkIn && bookingState.checkOut);
  const hasMonths = bookingState.arrivalMonths.length > 0;
  const hasStay = derivedStayDays != null;

  const adults = bookingState.adults ?? bookingState.guests ?? 1;
const children = bookingState.children ?? 0;
const totalGuests = adults + children;

const guestsLine = `${totalGuests} ${pluralize(
  totalGuests,
  "гость",
  "гостя",
  "гостей"
)}${bookingState.pets > 0 ? " · питомцы" : ""}`;

  const showAvailableFrom = shouldShowAvailableFrom({
    bookingState,
    availableFromLabel,
    availableFromMonthKey,
  });

  const actionLabel = hasExactDates ? "Изменить" : "Указать даты";

  if (hasExactDates) {
    return {
      stayLine: formatStay(derivedStayDays),
      dateLine: `${formatDisplayDate(bookingState.checkIn)} → ${formatDisplayDate(
        bookingState.checkOut
      )}`,
      guestsLine,
      actionLabel,
      showAvailableFrom,
    };
  }

  if (hasMonths) {
    return {
      stayLine: hasStay ? formatStay(derivedStayDays) : "1 мес",
      dateLine: `Заезд: ${formatArrivalMonthsLine(bookingState.arrivalMonths)}`,
      guestsLine,
      actionLabel,
      showAvailableFrom,
    };
  }

  return {
    stayLine: hasStay ? formatStay(derivedStayDays) : "1 мес",
    dateLine: "Заезд: Июль · август 2026",
    guestsLine,
    actionLabel,
    showAvailableFrom,
  };
};

const getTariffForDays = (tariffs, days) =>
  tariffs.find((tariff) => {
    const fitsMin = days >= tariff.minDays;
    const fitsMax = tariff.maxDays === null ? true : days <= tariff.maxDays;
    return fitsMin && fitsMax;
  }) ?? tariffs[0];

export default function ObjectPage() {
  const [showCharacteristics, setShowCharacteristics] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const initialBooking = location.state?.initialBooking;

  const [showLocationFullscreen, setShowLocationFullscreen] = useState(false);

  

  const photos = useMemo(() => [img1, img1b, img1c], []);
  const [activeIndex, setActiveIndex] = useState(0);

  const [showInfrastructureSheet, setShowInfrastructureSheet] = useState(false);

  const [showBuildingSheet, setShowBuildingSheet] = useState(false);

  

  const objectType = "flat"; // flat | room | house | apart_hotel
  const title = "Современная студия у парка с балконом и видом";
  const subtype = objectType === "apart_hotel" ? null : "1-к квартира · ЖК «Вымпел…»";

  const reviewsCount = 12;
  const rating = 4.8;
  const bookingType = "instant"; // instant | request

  const verifiedDateLabel = "22 декабря 2026";

const verifiedItems = [
  "Личность хозяина подтверждена",
  "Право размещения подтверждено",
  "Проведена видеопроверка объекта",
  "Документы собственности проверены",
];

const bookingTypeTitle =
  bookingType === "request"
    ? "Бронирование по запросу"
    : "Мгновенное бронирование";

const bookingTypeSubtitle =
  bookingType === "request"
    ? "Оплата производится после подтверждения."
    : "Подтверждается автоматически после оплаты.";


const [showAmenitiesSheet, setShowAmenitiesSheet] = useState(false);

const [showCancellationSheet, setShowCancellationSheet] = useState(false);
const [showRulesSheet, setShowRulesSheet] = useState(false);
const [showSafetySheet, setShowSafetySheet] = useState(false);

const [showVerifiedSheet, setShowVerifiedSheet] = useState(false);
const [showPaymentProtectionSheet, setShowPaymentProtectionSheet] = useState(false);
const [showBookingTypeSheet, setShowBookingTypeSheet] = useState(false);

const cancellationPolicy = {
  title: "Политика отмены",
  short: "Бесплатная отмена в течение 24 часов после бронирования.",
  points: [
    "Бесплатная отмена доступна в течение 24 часов после оплаты, если до заезда больше 14 дней.",
    "Если отмена позже, сервисный сбор Arendola может не возвращаться.",
    "Условия возврата по аренде после первого месяца согласуются с хозяином отдельно.",
  ],
};

const stayRules = [
  "Заезд после 15:00",
  "Выезд до 12:00",
  "Курение в квартире запрещено",
  "Без вечеринок и шумных мероприятий",
  "Можно с детьми",
  "С питомцами — по согласованию",
];

const safetyInfo = [
  "Объявление прошло базовую проверку платформы Arendola",
  "Оплата за первый месяц защищена до момента заселения",
  "Домофон / контролируемый вход в подъезд",
  "Контакты хозяина открываются после подтверждения бронирования",
];

const infrastructureItems = [
  { id: "park", icon: "bi-tree", label: "Парк / прогулочная зона" },
  { id: "school", icon: "bi-mortarboard", label: "Школа" },
  { id: "kindergarten", icon: "bi-balloon", label: "Детский сад" },
  { id: "shop", icon: "bi-basket", label: "Супермаркет" },
  { id: "pharmacy", icon: "bi-capsule", label: "Аптека" },
  { id: "cafe", icon: "bi-cup-hot", label: "Кафе" },
  { id: "fitness", icon: "bi-heart-pulse", label: "Фитнес-клуб" },
  { id: "transport", icon: "bi-bus-front", label: "Остановка транспорта" },
];

const hostData = {
  name: "Анна",
  typeLabel: "Частный хозяин",
  joinedYear: 2023,
  isEcoLeader: true,
};

const infrastructurePreview = infrastructureItems.slice(0, 4);
const hasMoreInfrastructure = infrastructureItems.length > 4;

const buildingGallery = [img1, img1b, img1c];

const buildingPreviewFacts = [
  "Монолитный дом",
  "Закрытый двор",
  "Есть парковка",
];

const buildingDetails = {
  general: [
    "Тип дома: монолитный",
    "Год постройки: 2021",
    "Лифт: есть",
  ],
  territory: [
    "Закрытый двор",
    "Озеленённая территория",
    "Детская площадка",
  ],
  safety: [
    "Домофон",
    "Видеонаблюдение",
    "Контролируемый вход",
  ],
  parking: [
    "Наземная парковка",
    "Гостевые места",
  ],
};
  
  
const objectsMock = {
  "1": { min_stay: 60, max_stay: 365, available_from: "1 января 2026" },
  "2": { min_stay: 30, max_stay: 365, available_from: "1 января 2026" },
  "3": { min_stay: 60, max_stay: 365, available_from: "1 января 2026" },
  "4": { min_stay: 30, max_stay: 365, available_from: "1 января 2026" },
};

const objectData = location.state?.objectData ?? objectsMock[id] ?? {
  min_stay: 30,
  max_stay: 365,
  available_from: "1 января 2026",
};

const minStayDays = objectData?.min_stay ?? 30;

const availableFromLabel = objectData?.available_from ?? "1 января 2026";

const locationTitle = "Москва, район Сокол";
const locationAddress = "Ленинский пр-т, 25";
const metroLabel = "🚇 Метро «Сокол» · 7 минут пешком";

const encodedAddress = encodeURIComponent(`${locationTitle}, ${locationAddress}`);
const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
const yandexMapsUrl = `https://yandex.ru/maps/?text=${encodedAddress}`;

const [showStayParamsFullscreen, setShowStayParamsFullscreen] = useState(false);
const [draftBookingState, setDraftBookingState] = useState(createEmptyBookingState);

const [mobileStayStep, setMobileStayStep] = useState("calendar"); // calendar | guests

const availableFromMonthKey = "2026-01"; // пока заглушка под текущий mock available_from

const [bookingState, setBookingState] = useState(() => {
  const savedBookingState = localStorage.getItem(BOOKING_STORAGE_KEY);

  if (savedBookingState) {
    try {
      return {
        ...createEmptyBookingState(),
        ...JSON.parse(savedBookingState),
      };
    } catch {
      localStorage.removeItem(BOOKING_STORAGE_KEY);
    }
  }

  if (!initialBooking?.stayDays) {
    return createEmptyBookingState();
  }

  return {
    ...createEmptyBookingState(),
    stayDays: initialBooking.stayDays,
    guests: 1,
    adults: 1,
  };
});

useEffect(() => {
  localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookingState));
}, [bookingState]);


const guestRules = {
  maxGuests: 3,
  childrenAllowed: true,
  minChildAge: 0,
  petsAllowed: true,
};

const [showGuestsPopover, setShowGuestsPopover] = useState(false);

const [draftGuests, setDraftGuests] = useState(() => ({
  adults: bookingState.adults ?? 1,
  children: bookingState.children ?? 0,
  childAges: bookingState.childAges ?? [],
  pets: bookingState.pets > 0,
  petDescription: bookingState.petDescription ?? "",
  petError: "",
}));

const draftTotalGuests = draftGuests.adults + draftGuests.children;

const openGuestsPopover = () => {
  setDraftGuests({
    adults: bookingState.adults ?? 1,
    children: bookingState.children ?? 0,
    childAges: bookingState.childAges ?? [],
    pets: bookingState.pets > 0,
    petDescription: bookingState.petDescription ?? "",
    petError: "",
  });

  setShowGuestsPopover((prev) => !prev);
};

const applyGuestsPopover = () => {
  if (draftGuests.pets && !draftGuests.petDescription.trim()) {
    setDraftGuests((prev) => ({
      ...prev,
      petError: "Укажите, с каким питомцем вы путешествуете",
    }));
    return;
  }

  const totalGuests = draftGuests.adults + draftGuests.children;

  setBookingState((prev) => ({
    ...prev,
    adults: draftGuests.adults,
    children: draftGuests.children,
    childAges: draftGuests.childAges,
    guests: totalGuests,
    pets: draftGuests.pets ? 1 : 0,
    petDescription: draftGuests.petDescription,
  }));

  setShowGuestsPopover(false);
};

const derivedStayDays =
    bookingState.checkIn && bookingState.checkOut
      ? diffDays(bookingState.checkIn, bookingState.checkOut) ?? bookingState.stayDays
      : bookingState.stayDays;

const stayCardView = buildStayCardViewModel({
  bookingState,
  derivedStayDays,
  availableFromLabel,
  availableFromMonthKey,
  pluralize,
  formatStay,
});

const openStayParamsFullscreen = () => {
  setDraftBookingState({
    ...bookingState,
    arrivalMonths: [...bookingState.arrivalMonths],
  });

  setDraftGuests({
    adults: bookingState.adults ?? 1,
    children: bookingState.children ?? 0,
    childAges: bookingState.childAges ?? [],
    pets: bookingState.pets > 0,
    petDescription: bookingState.petDescription ?? "",
    petError: "",
  });

  setMobileStayStep("calendar");
  setShowStayParamsFullscreen(true);
};

  const closeStayParamsFullscreen = () => {
    setShowStayParamsFullscreen(false);
  };

  const applyStayParamsFullscreen = () => {
    const totalGuests = draftGuests.adults + draftGuests.children;

    setBookingState({
      ...draftBookingState,
      arrivalMonths: [...draftBookingState.arrivalMonths],
      adults: draftGuests.adults,
      children: draftGuests.children,
      childAges: draftGuests.childAges,
      guests: totalGuests,
      pets: draftGuests.pets ? 1 : 0,
      petDescription: draftGuests.petDescription,
    });

    setShowStayParamsFullscreen(false);
 };

 const applyMobileGuestsScreen = () => {
  if (draftGuests.pets && !draftGuests.petDescription.trim()) {
    setDraftGuests((prev) => ({
      ...prev,
      petError: "Укажите, с каким питомцем вы путешествуете",
    }));
    return;
  }

  setMobileStayStep("calendar");
};

  const utilitiesLabel = "по счётчикам";

  const baseTariffs = useMemo(
    () => [
      { id: "1m", label: "1 мес", minDays: 30, maxDays: 59, monthPrice: 40000, discounted: false },
      { id: "2_5m", label: "2–5 мес", minDays: 60, maxDays: 179, monthPrice: 31500, discounted: true },
      { id: "6m_plus", label: "6+ мес", minDays: 180, maxDays: null, monthPrice: 27500, discounted: true },
    ],
    []
  );

  const tariffs = useMemo(
    () =>
      baseTariffs.map((tariff) => ({
        ...tariff,
        disabled: minStayDays >= 60 && tariff.id === "1m",
      })),
    [baseTariffs, minStayDays]
  );

  const amenitiesSections = [
    {
      id: "basic",
      title: "Основное",
      items: [
        { id: "wifi", icon: "bi-wifi", label: "Wi-Fi" },
        { id: "workspace", icon: "bi-laptop", label: "Рабочее место" },
        { id: "tv", icon: "bi-tv", label: "Телевизор" },
        { id: "elevator", icon: "bi-building", label: "Лифт" },
      ],
    },
    {
      id: "comfort",
      title: "Комфорт",
      items: [
        { id: "ac", icon: "bi-snow", label: "Кондиционер" },
        { id: "balcony", icon: "bi-flower1", label: "Балкон" },
        { id: "bed", icon: "bi-moon-stars", label: "Постельное бельё" },
        { id: "closet", icon: "bi-door-open", label: "Шкаф / хранение вещей" },
      ],
    },
    {
      id: "kitchen",
      title: "Кухня",
      items: [
        { id: "kitchen", icon: "bi-cup-hot", label: "Кухня" },
        { id: "fridge", icon: "bi-box-seam", label: "Холодильник" },
        { id: "microwave", icon: "bi-circle-square", label: "Микроволновка" },
        { id: "washer", icon: "bi-droplet", label: "Стиральная машина" },
      ],
    },
    {
      id: "safety",
      title: "Дом и безопасность",
      items: [
        { id: "smoke", icon: "bi-alarm", label: "Датчик дыма" },
        { id: "intercom", icon: "bi-shield-check", label: "Домофон / охрана" },
        { id: "secure", icon: "bi-lock", label: "Надёжный замок" },
        { id: "firstaid", icon: "bi-heart-pulse", label: "Аптечка" },
      ],
    },
  ];

  const allAmenities = amenitiesSections.flatMap((section) => section.items);
  const amenitiesPreviewLimit = 8;
  const amenitiesPreview = allAmenities.slice(0, amenitiesPreviewLimit);
  const hasMoreAmenities = allAmenities.length > amenitiesPreviewLimit;

  

  const activeTariff = getTariffForDays(tariffs, derivedStayDays);
  const stickyMonthPrice = activeTariff.monthPrice;
  const firstMonthRent = activeTariff.monthPrice;
  const serviceFee = Math.round(firstMonthRent * 0.1);
  const totalViaArendola = firstMonthRent + serviceFee;

  const fullMonthsAfterFirst = Math.max(Math.floor(derivedStayDays / 30) - 1, 0);
  const extraDays = derivedStayDays % 30;
  const extraDaysPrice = Math.round((activeTariff.monthPrice / 30) * extraDays);

  const hostPayments = {
    rentAfterFirstMonth: fullMonthsAfterFirst > 0 ? fullMonthsAfterFirst * activeTariff.monthPrice : 0,
    extraDaysPrice,
    deposit: 20000,
    utilities: utilitiesLabel,
    petFee: bookingState.pets > 0 ? 3000 : 0,
  };

  const hasHostPayments =
    derivedStayDays > 30 ||
    hostPayments.extraDaysPrice > 0 ||
    Boolean(hostPayments.deposit) ||
    Boolean(hostPayments.petFee) ||
    Boolean(hostPayments.utilities);

  

  const handleTariffClick = (tariff) => {
    if (tariff.disabled) return;

    const inRange =
      derivedStayDays >= tariff.minDays &&
      (tariff.maxDays === null || derivedStayDays <= tariff.maxDays);

    if (inRange) return;

    const nextStayDays = tariff.minDays;

    setBookingState((prev) => ({
      ...prev,
      stayDays: nextStayDays,
      invalidStateMessage: "",
      checkOut: prev.checkIn ? addDays(prev.checkIn, nextStayDays) : prev.checkOut,
    }));
  };


  const stickyCtaLabel = bookingType === "request" ? "Отправить запрос" : "Забронировать";
  const paymentStatusText =
    bookingType === "request"
      ? "Оплата производится после подтверждения хозяином."
      : "Оплата производится на следующем шаге.";


  const hasExactDates = Boolean(bookingState.checkIn && bookingState.checkOut);
  const hasArrivalMonths = bookingState.arrivalMonths.length > 0;
  

  const bottomSheetStayActionLabel =
    hasExactDates || hasArrivalMonths ? "Изменить" : "Указать даты";

  const bottomSheetPrimaryLine = hasExactDates
    ? `Ваш срок: ${formatStay(derivedStayDays)}`
    : hasArrivalMonths
    ? `Ваш срок: ${formatStay(derivedStayDays)}`
    : `Ваш срок: ${formatStay(derivedStayDays)}`;

  const bottomSheetSecondaryLine = hasExactDates
    ? `${bookingState.checkIn} - ${bookingState.checkOut}`
    : hasArrivalMonths
    ? `Заезд: ${bookingState.arrivalMonths.join(", ")}`
    : stayCardView.dateLine;

  const bottomSheetMetaLine = stayCardView.guestsLine;

  const arendolaRentLabel =
    derivedStayDays > 30 ? "Аренда за первый месяц" : "Аренда за 1 месяц";

    


  return (
    <div className="object-page-shell">
      <div className="object-page container py-3" style={{ paddingBottom: "120px" }}>
        <div className="object-page-grid">
          <main className="object-page-main">
            <div className="position-relative rounded overflow-hidden mb-3 object-gallery-card">
              <div className="object-gallery-slider">
                <div className="object-gallery-inner">
                  {photos.map((src, idx) => (
                    <div
                      key={src}
                      className={`object-gallery-slide ${idx === activeIndex ? "is-active" : ""}`}
                    >
                      <img
                        src={src}
                        className="object-gallery-image"
                        alt={`Фото ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <button
                  className="object-gallery-control object-gallery-control-prev"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
                  }}
                >
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button
                  className="object-gallery-control object-gallery-control-next"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((prev) => (prev + 1) % photos.length);
                  }}
                >
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                </button>

                <div className="carousel-indicators">
                  {photos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={idx === activeIndex ? "active" : ""}
                      aria-label={`Слайд ${idx + 1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex(idx);
                      }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="btn btn-light btn-sm position-absolute top-0 start-0 m-2 shadow-sm"
                style={{ borderRadius: 999 }}
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-chevron-left me-1"></i>
                К поиску
              </button>

              <button
                type="button"
                className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 shadow-sm"
                style={{ borderRadius: 999 }}
                data-bs-toggle="offcanvas"
                data-bs-target="#objectActionsSheet"
                aria-controls="objectActionsSheet"
              >
                <i className="bi bi-three-dots"></i>
              </button>

              <div className="position-absolute bottom-0 end-0 m-2 px-2 py-1 bg-dark text-white small" style={{ borderRadius: 999, opacity: 0.85 }}>
                {activeIndex + 1} / {photos.length}
              </div>
            </div>

            <section className="object-page-intro mb-3">
              <h1 className="object-page-title">{title}</h1>
              {subtype && <div className="object-page-subtype">{subtype}</div>}

              {reviewsCount > 0 ? (
                <button
                  type="button"
                  className="offer-rating object-page-rating"
                  onClick={() => alert("Переход на экран отзывов (позже)")}
                >
                  <i className="bi bi-star-fill"></i>
                  <span className="fw-semibold">
                    {rating.toFixed(1).replace(".", ",")}
                  </span>
                  <span>
                    {reviewsCount} {pluralize(reviewsCount, "отзыв", "отзыва", "отзывов")}
                  </span>
                  <span>·</span>
                  <span className="d-inline-flex align-items-center">
                    <i className="bi bi-leaf-fill offer-eco-icon"></i>
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  className="offer-rating object-page-rating"
                  onClick={() => alert("Переход на экран отзывов (позже)")}
                >
                  <i className="bi bi-stars offer-new-icon"></i>
                  <span className="offer-new-label">Новинка</span>
                </button>
              )}
            </section>


            <section className="card border-0 shadow-sm mb-3 object-about-card">
              <div className="card-body">
                <h2 className="h5 mb-3">О жилье</h2>

                <button
                  type="button"
                  className="object-characteristics-card"
                  onClick={() => setShowCharacteristics(true)}
                >
                  <span>
                    <span className="object-characteristics-card-title">Характеристики</span>
                    <span className="object-characteristics-card-text">
                      48 м² · 2 гостя · 4 этаж из 16
                    </span>
                  </span>

                  <i className="bi bi-chevron-right"></i>
                </button>

                <p className="object-about-text">
                  Светлая квартира в тихом дворе, до набережной 12 минут пешком.
                  Быстрый Wi-Fi, кондиционер, удобный матрас. Заселение по паспорту,
                  договор и чек. <button type="button" className="object-inline-more">Ещё ›</button>
                </p>

                <div className="object-about-divider"></div>

                <div className="object-about-row">
                  <span>Коммунальные услуги -</span>
                  <strong>по счётчикам</strong>
                </div>

                <div className="object-about-row">
                  <span>Залог -</span>
                  <strong>требуется</strong>
                </div>
              </div>
            </section>

            




            <section className="card border-0 shadow-sm mb-3 d-lg-none">
              <div className="card-body">
                <button
                  type="button"
                  className="w-100 d-flex flex-column align-items-stretch px-3 py-3 border rounded bg-light"
                  onClick={openStayParamsFullscreen}
                >
                  <div className="text-start flex-grow-1">
                    <div className="fw-semibold">{stayCardView.stayLine}</div>
                    <div className="small text-muted mt-1">{stayCardView.dateLine}</div>
                    <div className="small text-muted mt-1">{stayCardView.guestsLine}</div>
                  </div>

                  <div className="mt-2 d-flex align-items-center justify-content-between">
                    <span
                      style={{
                        fontSize: 12,
                        lineHeight: 1.35,
                        color: "#374151",
                        fontWeight: 500,
                      }}
                    >
                      Изменить параметры
                    </span>
                    <i className="bi bi-chevron-right text-secondary"></i>
                  </div>

                  
                </button>

                {stayCardView.showAvailableFrom && (
                  <div className="small text-muted mt-2 px-1">
                    Доступно с {availableFromLabel}
                  </div>
                )}

                

                
              </div>
            </section>


            <section className="card border-0 shadow-sm mb-3 object-tariff-section d-lg-none">
              <div className="card-body">
                <div className="d-flex gap-2 flex-nowrap overflow-auto pb-1">
                  {tariffs.map((tariff) => {
                    const isActive = activeTariff.id === tariff.id;

                    const buttonClass = tariff.disabled
                      ? "object-tariff-chip is-disabled"
                      : isActive
                      ? "object-tariff-chip is-active"
                      : "object-tariff-chip";

                    return (
                      <button
                        key={tariff.id}
                        type="button"
                        className={buttonClass}
                        onClick={() => handleTariffClick(tariff)}
                        disabled={tariff.disabled}
                      >
                        <div className="object-tariff-chip-label">{tariff.label}</div>

                        <div className="object-tariff-chip-price">
                          <span>{formatPrice(tariff.monthPrice)} / мес</span>
                          {tariff.disabled && (
                            <i className="bi bi-lock-fill object-tariff-lock"></i>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>





            <section className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h2 className="h5 mb-0">Расположение</h2>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none small"
                    onClick={() => setShowLocationFullscreen(true)}
                  >
                    Открыть карту <i className="bi bi-chevron-right"></i>
                  </button>
                </div>

                <div className="object-meta-line mb-1">
                  <i className="bi bi-geo-alt me-2"></i>
                  <span>{locationTitle}</span>
                </div>

                <div className="object-meta-line mb-3">
                  <i className="bi bi-pin-map me-2"></i>
                  <span>{locationAddress}</span>
                </div>

                <button
                  type="button"
                  className="object-map-card-button w-100 border-0 p-0 bg-transparent text-start"
                  onClick={() => setShowLocationFullscreen(true)}
                >
                  <div className="object-map-placeholder mb-3">
                    <iframe
                      title="Карта Москвы"
                      src="https://yandex.ru/map-widget/v1/?ll=37.617700%2C55.755800&z=12"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                </button>

                <div className="text-muted">{metroLabel}</div>
              </div>
            </section>

            <section className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <h2 className="h5 mb-3">Инфраструктура рядом</h2>

                <div className="object-infrastructure-grid mb-3">
                  {infrastructurePreview.map((item) => (
                    <div key={item.id} className="object-infrastructure-item">
                      <i className={`bi ${item.icon}`}></i>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                {hasMoreInfrastructure && (
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none small"
                    onClick={() => setShowInfrastructureSheet(true)}
                  >
                    Показать всё <i className="bi bi-chevron-right"></i>
                  </button>
                )}
              </div>
            </section>

            <section className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <div className="object-info-list">
                  <button
                    type="button"
                    className="object-info-item"
                    onClick={() => setShowVerifiedSheet(true)}
                  >
                    <span className="object-info-item-left">
                      <i className="bi bi-patch-check"></i>
                      <span>
                        <span className="object-info-item-title">Проверено Arendola</span>
                        <span className="object-info-item-text">
                          Дата проверки: {verifiedDateLabel}
                        </span>
                      </span>
                    </span>
                    <i className="bi bi-chevron-right"></i>
                  </button>

                  <button
                    type="button"
                    className="object-info-item"
                    onClick={() => setShowPaymentProtectionSheet(true)}
                  >
                    <span className="object-info-item-left">
                      <i className="bi bi-shield-lock"></i>
                      <span>
                        <span className="object-info-item-title">Защита оплаты</span>
                        <span className="object-info-item-text">
                          Оплата за первый месяц хранится на платформе до заселения.
                        </span>
                      </span>
                    </span>
                    <i className="bi bi-chevron-right"></i>
                  </button>

                  <button
                    type="button"
                    className="object-info-item"
                    onClick={() => setShowBookingTypeSheet(true)}
                  >
                    <span className="object-info-item-left">
                      <i
                        className={`bi ${
                          bookingType === "request"
                            ? "bi-hourglass-split"
                            : "bi-lightning-charge"
                        }`}
                      ></i>
                      <span>
                        <span className="object-info-item-title">{bookingTypeTitle}</span>
                        <span className="object-info-item-text">{bookingTypeSubtitle}</span>
                      </span>
                    </span>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            </section>


            <section className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h2 className="h5 mb-0">Удобства</h2>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none small"
                    onClick={() => setShowAmenitiesSheet(true)}
                  >
                    Показать всё <i className="bi bi-chevron-right"></i>
                  </button>
                </div>

                <div className="object-amenities-grid">
                  {amenitiesPreview.map((item) => (
                    <div key={item.id} className="object-amenities-row">
                      <span className="object-amenities-row-left">
                        <i className={`bi ${item.icon}`}></i>
                        <span>{item.label}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            

            <section className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <h2 className="h5 mb-3">Важная информация</h2>

                <div className="object-info-list">
                  <button
                    type="button"
                    className="object-info-item"
                    onClick={() => setShowCancellationSheet(true)}
                  >
                    <span className="object-info-item-left">
                      <i className="bi bi-arrow-counterclockwise"></i>
                      <span>
                        <span className="object-info-item-title">Политика отмены</span>
                        <span className="object-info-item-text">
                          Бесплатная отмена в течение 24 часов
                        </span>
                      </span>
                    </span>
                    <i className="bi bi-chevron-right"></i>
                  </button>

                  <button
                    type="button"
                    className="object-info-item"
                    onClick={() => setShowRulesSheet(true)}
                  >
                    <span className="object-info-item-left">
                      <i className="bi bi-house-door"></i>
                      <span>
                        <span className="object-info-item-title">Правила проживания</span>
                        <span className="object-info-item-text">
                          Заезд, выезд, питомцы и базовые ограничения
                        </span>
                      </span>
                    </span>
                    <i className="bi bi-chevron-right"></i>
                  </button>

                  <button
                    type="button"
                    className="object-info-item"
                    onClick={() => setShowSafetySheet(true)}
                  >
                    <span className="object-info-item-left">
                      <i className="bi bi-shield-check"></i>
                      <span>
                        <span className="object-info-item-title">Безопасность и жильё</span>
                        <span className="object-info-item-text">
                          Проверка объявления и защита оплаты
                        </span>
                      </span>
                    </span>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            </section>

            <section className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 56, height: 56 }}
                  >
                    <i className="bi bi-person"></i>
                  </div>

                  <div className="flex-grow-1 min-w-0">
                    <div className="fw-semibold">{hostData.name}</div>
                    <div className="text-muted small">{hostData.typeLabel}</div>

                    {hostData.isEcoLeader && (
                      <button
                        type="button"
                        className="object-host-badge mt-2"
                        onClick={() => alert("Экологичный хозяин: описание добавим следующим шагом")}
                      >
                        <i className="bi bi-leaf-fill me-1"></i>
                        Эко-лидер
                      </button>
                    )}

                    <div className="text-muted small mt-2">
                      На платформе с {hostData.joinedYear}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h2 className="h5 mb-0">Здание и территория</h2>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none small"
                    onClick={() => setShowBuildingSheet(true)}
                  >
                    Подробнее <i className="bi bi-chevron-right"></i>
                  </button>
                </div>

                <div className="object-building-gallery mb-3">
                  {buildingGallery.slice(0, 3).map((src, index) => (
                    <div key={`${src}-${index}`} className="object-building-gallery-item">
                      <img src={src} alt={`Здание и территория ${index + 1}`} />
                    </div>
                  ))}
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {buildingPreviewFacts.map((fact) => (
                    <span key={fact} className="object-building-fact">
                      {fact}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <div className="small text-muted mb-5">ID объявления: {id ?? "123456"}</div>
          </main>

          <aside className="object-page-aside d-none d-lg-block">
            <div className="card border-0 shadow-sm object-desktop-booking-card">
              <div className="card-body">
                <div className="object-stay-card-button w-100 px-3 py-3 border rounded bg-light mb-3">
                  <div className="object-stay-card-content">
                    <div className="object-stay-main">{stayCardView.stayLine}</div>
                    <button
                      type="button"
                      className="object-stay-date object-stay-inner-button"
                      onClick={openStayParamsFullscreen}
                    >
                      {stayCardView.dateLine}
                    </button>

                    

                    <button
                      type="button"
                      className="object-stay-action object-stay-inner-button"
                      onClick={openStayParamsFullscreen}
                    >
                      {stayCardView.actionLabel} <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="object-guests-row"
                  onClick={openGuestsPopover}
                >
                  <span>Гости: {stayCardView.guestsLine}</span>
                  <i className="bi bi-chevron-right"></i>
                </button>

                {stayCardView.showAvailableFrom && (
                  <div className="small text-muted mb-3 px-1">
                    Доступно с {availableFromLabel}
                  </div>
                )}



                

                {showGuestsPopover && (
                  <div className="object-guests-popover">
                    <div className="object-guests-popover-title">Гости и питомцы</div>
                    <div className="object-guests-popover-limit">
                      Жильё рассчитано максимум на {guestRules.maxGuests} гостей
                    </div>

                    <div className="object-guests-control-row">
                      <div>
                        <div className="object-guests-control-title">Взрослые</div>
                        <div className="object-guests-control-subtitle">от 18 лет</div>
                      </div>

                      <div className="object-counter">
                        <button
                          type="button"
                          disabled={draftGuests.adults <= 1}
                          onClick={() =>
                            setDraftGuests((prev) => ({
                              ...prev,
                              adults: Math.max(1, prev.adults - 1),
                            }))
                          }
                        >
                          −
                        </button>
                        <span>{draftGuests.adults}</span>
                        <button
                          type="button"
                          disabled={draftTotalGuests >= guestRules.maxGuests}
                          onClick={() =>
                            setDraftGuests((prev) => ({
                              ...prev,
                              adults: prev.adults + 1,
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="object-guests-control-row">
                      <div>
                        <div className="object-guests-control-title">Дети</div>
                        <div className="object-guests-control-subtitle">
                          {guestRules.childrenAllowed ? "от 0 до 17 лет" : "Нельзя с детьми"}
                        </div>
                      </div>

                      <div className="object-counter">
                        <button
                          type="button"
                          disabled={draftGuests.children <= 0}
                          onClick={() =>
                            setDraftGuests((prev) => ({
                              ...prev,
                              children: Math.max(0, prev.children - 1),
                              childAges: prev.childAges.slice(0, -1),
                            }))
                          }
                        >
                          −
                        </button>
                        <span>{draftGuests.children}</span>
                        <button
                          type="button"
                          disabled={
                            !guestRules.childrenAllowed ||
                            draftTotalGuests >= guestRules.maxGuests
                          }
                          onClick={() =>
                            setDraftGuests((prev) => ({
                              ...prev,
                              children: prev.children + 1,
                              childAges: [...prev.childAges, guestRules.minChildAge],
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {draftGuests.children > 0 && (
                      <div className="object-child-ages">
                        {draftGuests.childAges.map((age, index) => (
                          <label key={index} className="object-child-age-row">
                            <span>Возраст ребёнка {index + 1}</span>
                            <select
                              value={age}
                              onChange={(e) => {
                                const nextAges = [...draftGuests.childAges];
                                nextAges[index] = Number(e.target.value);
                                setDraftGuests((prev) => ({
                                  ...prev,
                                  childAges: nextAges,
                                }));
                              }}
                            >
                              {Array.from(
                                { length: 18 - guestRules.minChildAge },
                                (_, i) => guestRules.minChildAge + i
                              ).map((value) => (
                                <option key={value} value={value}>
                                  {value === 0 ? "до года" : `${value} лет`}
                                </option>
                              ))}
                            </select>
                          </label>
                        ))}
                      </div>
                    )}

                    <div className="object-pets-block">
                      <div className="object-pets-row">
                        <div>
                          <div className="object-guests-control-title">Питомцы</div>
                          <div className="object-guests-control-subtitle">
                            {guestRules.petsAllowed ? "Укажите какие" : "Нельзя с питомцами"}
                          </div>
                        </div>

                        <label className="object-switch">
                          <input
                            type="checkbox"
                            checked={draftGuests.pets}
                            disabled={!guestRules.petsAllowed}
                            onChange={(e) =>
                              setDraftGuests((prev) => ({
                                ...prev,
                                pets: e.target.checked,
                                petError: "",
                              }))
                            }
                          />
                          <span></span>
                        </label>
                      </div>

                      {draftGuests.pets && guestRules.petsAllowed && (
                        <>
                          <textarea
                            className="object-pet-textarea"
                            placeholder="Опишите питомца (например: мопс, 7 кг)"
                            value={draftGuests.petDescription}
                            onChange={(e) =>
                              setDraftGuests((prev) => ({
                                ...prev,
                                petDescription: e.target.value,
                                petError: "",
                              }))
                            }
                          />
                          <div className="object-guests-control-subtitle mt-1">
                            Хозяин рассмотрит запрос на проживание с питомцем
                          </div>
                        </>
                      )}

                      {draftGuests.petError && (
                        <div className="object-guests-error">{draftGuests.petError}</div>
                      )}
                    </div>

                    <button
                      type="button"
                      className="btn btn-success w-100 mt-3"
                      onClick={applyGuestsPopover}
                    >
                      Готово
                    </button>
                  </div>
                )}

                <div className="d-flex gap-2 flex-nowrap mb-3">
                  {tariffs.map((tariff) => {
                    const isActive = activeTariff.id === tariff.id;

                    const buttonClass = tariff.disabled
                      ? "object-tariff-chip is-disabled"
                      : isActive
                      ? "object-tariff-chip is-active"
                      : "object-tariff-chip";

                    return (
                      <button
                        key={tariff.id}
                        type="button"
                        className={buttonClass}
                        onClick={() => handleTariffClick(tariff)}
                        disabled={tariff.disabled}
                      >
                        <div className="object-tariff-chip-label">{tariff.label}</div>
                        <div className="object-tariff-chip-price">
                          <span>{formatPrice(tariff.monthPrice)} / мес</span>
                          {tariff.disabled && (
                            <i className="bi bi-lock-fill object-tariff-lock"></i>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="object-desktop-summary mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Аренда за первый месяц</span>
                    <span>{formatPrice(firstMonthRent)}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Разовый сервисный сбор</span>
                    <span>{formatPrice(serviceFee)}</span>
                  </div>

                  <div className="object-desktop-total-row d-flex justify-content-between fw-semibold border-top">
                    <span>Итого</span>
                    <span>{formatPrice(totalViaArendola)}</span>
                  </div>
                </div>

                <button
                  className="btn btn-link object-payment-details-link w-100 text-decoration-none px-0 mb-2"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#paymentDetailsSheet"
                  aria-controls="paymentDetailsSheet"
                >
                  Детали оплаты <i className="bi bi-chevron-right"></i>
                </button>

                <button
                  className="btn btn-success w-100 mb-2"
                  type="button"
                  onClick={() => alert("Переход в Checkout")}
                >
                  {stickyCtaLabel}
                </button>

                <div className="small text-muted text-center">
                  {paymentStatusText}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="offcanvas offcanvas-bottom" tabIndex="-1" id="objectActionsSheet" aria-labelledby="objectActionsSheetLabel" style={{ height: "auto" }}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="objectActionsSheetLabel">Действия</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body pt-0">
          <div className="list-group">
            <button type="button" className="list-group-item list-group-item-action" onClick={() => alert("Поделиться (позже)")}>Поделиться</button>
            <button type="button" className="list-group-item list-group-item-action" onClick={() => alert("В избранное (позже)")}>В избранное</button>
            <button type="button" className="list-group-item list-group-item-action text-danger" onClick={() => alert("Пожаловаться (позже)")}>Пожаловаться</button>
          </div>
        </div>
      </div>

      <div className="object-mobile-sticky position-fixed start-0 end-0 bottom-0 bg-white border-top shadow-lg p-3 d-lg-none">
        <div className="container object-mobile-sticky-inner">
          <div className="d-flex align-items-center justify-content-between gap-3">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none text-start"
              data-bs-toggle="offcanvas"
              data-bs-target="#paymentDetailsSheet"
              aria-controls="paymentDetailsSheet"
            >
              <div className="fw-semibold text-dark">{formatPrice(stickyMonthPrice)} / мес</div>
              <div className="small text-muted">Детали оплаты <i className="bi bi-chevron-right"></i></div>
            </button>
            <button type="button" className="btn btn-success flex-shrink-0" onClick={() => alert("Переход в Checkout")}>{stickyCtaLabel}</button>
          </div>
        </div>
      </div>

      <div className="offcanvas offcanvas-bottom" tabIndex="-1" id="paymentDetailsSheet" aria-labelledby="paymentDetailsSheetLabel" style={{ height: "85vh" }}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="paymentDetailsSheetLabel">Детали оплаты</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>

        <div className="offcanvas-body">
          <div className="mb-4">
            <div className="small text-muted mb-1">
              Тариф по сроку · {activeTariff.label}
              {activeTariff.discounted && " ⓘ"}
            </div>
            <div className="fw-semibold">{formatPrice(activeTariff.monthPrice)} / мес</div>
          </div>

          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <div className="fw-semibold">Срок проживания</div>
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={openStayParamsFullscreen}
              >
                {bottomSheetStayActionLabel}
              </button>
            </div>

            <div>{bottomSheetPrimaryLine}</div>
            <div className="small text-muted mt-1">{bottomSheetSecondaryLine}</div>

            {bottomSheetMetaLine && (
              <div className="small text-muted">{bottomSheetMetaLine}</div>
            )}

            {bookingState.invalidStateMessage && (
              <div className="small text-danger mt-2">{bookingState.invalidStateMessage}</div>
            )}
          </div>

          <div className="mb-4">
            <div className="fw-semibold mb-2">К оплате через Arendola</div>

            <div className="d-flex justify-content-between mb-2">
              <span>{arendolaRentLabel}</span>
              <span>{formatPrice(firstMonthRent)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Разовый сервисный сбор</span>
              <span>{formatPrice(serviceFee)}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between fw-semibold"><span>Итого</span><span>{formatPrice(totalViaArendola)}</span></div>
            <div className="small text-muted mt-2">{paymentStatusText}</div>
          </div>

          <div className="border rounded p-3 mb-4">
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-shield-check"></i>
              <div>
                <div className="small">Оплата за первый месяц хранится на платформе Arendola до заселения</div>
                <button onClick={() => setShowCharacteristics(true)} type="button" className="btn btn-link p-0 text-decoration-none small">
                  Подробнее <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          {hasHostPayments && (
            <div className="mb-4">
              <div className="fw-semibold mb-1">Платежи хозяину</div>
              <div className="small text-muted mb-2">Оплачиваются напрямую хозяину и не списываются через Arendola</div>

              {hostPayments.rentAfterFirstMonth > 0 && (
                <div className="mb-3">
                  <div>Аренда после первого месяца</div>
                  <div className="small text-muted">
                    {fullMonthsAfterFirst} мес × {formatPrice(activeTariff.monthPrice)} / мес
                  </div>
                  <div className="small text-muted">Оплата ежемесячно</div>
                </div>
              )}

              {hostPayments.extraDaysPrice > 0 && (
                <div className="d-flex justify-content-between mb-2"><span>Дополнительные {extraDays} дн</span><span>{formatPrice(hostPayments.extraDaysPrice)}</span></div>
              )}

              {hostPayments.deposit > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Залог</span>
                  <span>{formatPrice(hostPayments.deposit)} (при заезде)</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2"><span>Коммунальные услуги</span><span>{hostPayments.utilities}</span></div>

              {hostPayments.petFee > 0 && (
                <div className="d-flex justify-content-between"><span>Доплата за питомца</span><span>{formatPrice(hostPayments.petFee)}</span></div>
              )}
            </div>
          )}
        </div>
      </div>


      {showCharacteristics && (
        <div className="object-bottom-sheet-backdrop">
          <div className="object-bottom-sheet object-characteristics-sheet">
            <div className="object-bottom-sheet-header">
              <div className="fw-semibold">Характеристики</div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCharacteristics(false)}
              />
            </div>

            <div className="object-bottom-sheet-body">
              <div className="object-char-section">
                <div className="object-char-section-title">Основные характеристики</div>
                <div className="object-char-row"><span>Общая площадь</span><span>48 м²</span></div>
                <div className="object-char-row"><span>Жилая площадь</span><span>32 м²</span></div>
                <div className="object-char-row"><span>Площадь кухни</span><span>8 м²</span></div>
                <div className="object-char-row"><span>Комнат</span><span>1</span></div>
                <div className="object-char-row"><span>Изолированных спален</span><span>1</span></div>
              </div>

              <div className="object-char-section">
                <div className="object-char-section-title">Спальные места</div>
                <div className="object-char-row"><span>Двуспальных кроватей</span><span>1</span></div>
                <div className="object-char-row"><span>Односпальных кроватей</span><span>0</span></div>
                <div className="object-char-row"><span>Диванов-кроватей</span><span>1</span></div>
              </div>

              <div className="object-char-section">
                <div className="object-char-section-title">Кухонная зона</div>
                <div className="object-char-row"><span>Тип кухни</span><span>кухонная зона</span></div>
                <div className="object-char-row"><span>Плита</span><span>индукционная</span></div>
              </div>

              <div className="object-char-section">
                <div className="object-char-section-title">Санузлы</div>
                <div className="object-char-row"><span>Всего санузлов</span><span>1</span></div>
                <div className="object-char-row"><span>С ванной</span><span>1</span></div>
                <div className="object-char-row"><span>С душевой</span><span>0</span></div>
                <div className="object-char-row"><span>Отдельных туалетов</span><span>0</span></div>
              </div>

              <div className="object-char-section">
                <div className="object-char-section-title">Балконы и лоджии</div>
                <div className="object-char-row"><span>Балконов</span><span>1</span></div>
                <div className="object-char-row"><span>Лоджий</span><span>0</span></div>
                <div className="object-char-row"><span>Тип</span><span>застеклённый</span></div>
              </div>

              <div className="object-char-section">
                <div className="object-char-section-title">Вид из окон</div>
                <div className="object-char-row"><span>Вид</span><span>во двор, на город</span></div>
              </div>

              <div className="object-char-section">
                <div className="object-char-section-title">Ремонт и состояние</div>
                <div className="object-char-row"><span>Ремонт</span><span>дизайнерский</span></div>
                <div className="object-char-row"><span>Состояние</span><span>отличное</span></div>
              </div>
            </div>
          </div>
        </div>
      )}


      {showAmenitiesSheet && (
        <div className="object-bottom-sheet-backdrop">
          <div className="object-bottom-sheet object-amenities-sheet">
            <div className="object-bottom-sheet-header">
              <div>
                <div className="fw-semibold">Все удобства</div>
                <div className="small text-muted">
                  {amenitiesSections.flatMap((section) => section.items).length} удобств
                </div>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={() => setShowAmenitiesSheet(false)}
              />
            </div>

            <div className="object-bottom-sheet-body">
              {amenitiesSections.map((section) => (
                <div key={section.id} className="object-amenities-section">
                  <div className="object-amenities-section-title">{section.title}</div>

                  <div className="object-amenities-list">
                    {section.items.map((item) => (
                      <div key={item.id} className="object-amenities-row">
                        <span className="object-amenities-row-left">
                          <i className={`bi ${item.icon}`}></i>
                          <span>{item.label}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showCancellationSheet && (
        <div className="object-bottom-sheet-backdrop">
          <div className="object-bottom-sheet object-info-sheet">
            <div className="object-bottom-sheet-header">
              <div>
                <div className="fw-semibold">{cancellationPolicy.title}</div>
                <div className="small text-muted">{cancellationPolicy.short}</div>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCancellationSheet(false)}
              />
            </div>

            <div className="object-bottom-sheet-body">
              <div className="object-sheet-text-block">
                {cancellationPolicy.points.map((item, index) => (
                  <div key={index} className="object-sheet-bullet-row">
                    <i className="bi bi-dot"></i>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showRulesSheet && (
        <div className="object-bottom-sheet-backdrop">
          <div className="object-bottom-sheet object-info-sheet">
            <div className="object-bottom-sheet-header">
              <div>
                <div className="fw-semibold">Правила проживания</div>
                <div className="small text-muted">Основные условия пребывания</div>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={() => setShowRulesSheet(false)}
              />
            </div>

            <div className="object-bottom-sheet-body">
              <div className="object-sheet-list">
                {stayRules.map((rule, index) => (
                  <div key={index} className="object-sheet-list-row">
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSafetySheet && (
        <div className="object-bottom-sheet-backdrop">
          <div className="object-bottom-sheet object-info-sheet">
            <div className="object-bottom-sheet-header">
              <div>
                <div className="fw-semibold">Безопасность и жильё</div>
                <div className="small text-muted">Проверка объявления и защита бронирования</div>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={() => setShowSafetySheet(false)}
              />
            </div>

            <div className="object-bottom-sheet-body">
              <div className="object-sheet-list">
                {safetyInfo.map((item, index) => (
                  <div key={index} className="object-sheet-list-row object-sheet-list-row-icon">
                    <span className="object-sheet-row-icon">
                      <i className="bi bi-check2-circle"></i>
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showVerifiedSheet && (
        <div className="object-bottom-sheet-backdrop">
          <div className="object-bottom-sheet object-info-sheet">
            <div className="object-bottom-sheet-header">
              <div>
                <div className="fw-semibold">Проверено Arendola</div>
                <div className="small text-muted">Дата проверки: {verifiedDateLabel}</div>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={() => setShowVerifiedSheet(false)}
              />
            </div>

            <div className="object-bottom-sheet-body">
              <div className="object-sheet-list">
                {verifiedItems.map((item, index) => (
                  <div key={index} className="object-sheet-list-row object-sheet-list-row-icon">
                    <span className="object-sheet-row-icon">
                      <i className="bi bi-check2-circle"></i>
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentProtectionSheet && (
        <div className="object-bottom-sheet-backdrop">
          <div className="object-bottom-sheet object-info-sheet">
            <div className="object-bottom-sheet-header">
              <div>
                <div className="fw-semibold">Защита оплаты</div>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={() => setShowPaymentProtectionSheet(false)}
              />
            </div>

            <div className="object-bottom-sheet-body">
              <div className="object-sheet-text-block">
                <p className="mb-3">
                  Оплата за первый месяц хранится на платформе до заселения.
                </p>
                <p className="mb-3">
                  После заселения у вас есть 24 часа, чтобы сообщить о существенных
                  расхождениях с объявлением.
                </p>
                <p className="mb-3">
                  Если подтверждено, что заселение невозможно или жильё существенно
                  не соответствует описанию, производится возврат всей суммы,
                  оплаченной через Arendola.
                </p>
                <p className="mb-0">
                  Если обращений не поступило, средства переводятся хозяину через
                  48 часов после заселения.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBookingTypeSheet && (
        <div className="object-bottom-sheet-backdrop">
          <div className="object-bottom-sheet object-info-sheet">
            <div className="object-bottom-sheet-header">
              <div>
                <div className="fw-semibold">{bookingTypeTitle}</div>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={() => setShowBookingTypeSheet(false)}
              />
            </div>

            <div className="object-bottom-sheet-body">
              {bookingType === "request" ? (
                <div className="object-sheet-text-block">
                  <div className="object-sheet-bullet-row">
                    <i className="bi bi-dot"></i>
                    <span>Запрос на бронирование отправляется хозяину.</span>
                  </div>
                  <div className="object-sheet-bullet-row">
                    <i className="bi bi-dot"></i>
                    <span>Хозяин может подтвердить или отклонить бронирование.</span>
                  </div>
                  <div className="object-sheet-bullet-row">
                    <i className="bi bi-dot"></i>
                    <span>Оплата списывается после подтверждения.</span>
                  </div>
                  <div className="object-sheet-bullet-row">
                    <i className="bi bi-dot"></i>
                    <span>После оплаты становятся доступны контакты хозяина.</span>
                  </div>
                  <div className="object-sheet-bullet-row">
                    <i className="bi bi-dot"></i>
                    <span>Если ответ не поступит в течение 24 часов, запрос отменяется автоматически.</span>
                  </div>
                </div>
              ) : (
                <div className="object-sheet-text-block">
                  <p className="mb-3">
                    Бронирование подтверждается автоматически после оплаты первого месяца.
                  </p>
                  <p className="mb-0">
                    После подтверждения и оплаты становятся доступны контакты хозяина.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {showStayParamsFullscreen && (
        <div className="object-fullscreen-backdrop">
          <div className="object-fullscreen-sheet">
            <div className="object-fullscreen-header">
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={closeStayParamsFullscreen}
              >
                Назад
              </button>

              <div className="fw-semibold">
                {mobileStayStep === "guests" ? "Гости и питомцы" : "Параметры проживания"}
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={closeStayParamsFullscreen}
              />
            </div>

            <div className="object-fullscreen-body">
              {mobileStayStep === "calendar" && (
                <>
                  <div className="mb-4">
                    <div className="fw-semibold mb-2">Срок проживания</div>
                    <div className="small text-muted mb-2">
                      Мин. срок: {Math.round(minStayDays / 30)} мес
                    </div>

                    <div className="d-flex gap-2">
                      {[30, 60].map((days) => {
                        const isDisabled = days < minStayDays;

                        return (
                          <button
                            key={days}
                            type="button"
                            className={`btn btn-outline-secondary ${
                              draftBookingState.stayDays === days ? "active" : ""
                            }`}
                            disabled={isDisabled}
                            onClick={() => {
                              if (isDisabled) return;

                              setDraftBookingState((prev) => ({
                                ...prev,
                                stayDays: days,
                              }));
                            }}
                          >
                            {formatStay(days)}
                            {isDisabled && <i className="bi bi-lock-fill ms-1"></i>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="fw-semibold mb-2">Даты / месяцы</div>
                    <div className="small text-muted mb-2">
                      Доступно с {availableFromLabel}
                    </div>

                    <div className="border rounded p-3 bg-light">
                      Июль · август 2026
                    </div>
                  </div>

                  <div className="mb-4 d-lg-none">
                    <button
                      type="button"
                      className="object-mobile-guests-row"
                      onClick={() => setMobileStayStep("guests")}
                    >
                      <span>
                        <span className="object-mobile-guests-title">Гости</span>
                        <span className="object-mobile-guests-value">
                          {draftGuests.adults + draftGuests.children}{" "}
                          {pluralize(
                            draftGuests.adults + draftGuests.children,
                            "гость",
                            "гостя",
                            "гостей"
                          )}
                          {draftGuests.pets ? " · питомцы" : ""}
                        </span>
                      </span>

                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>

                  <div className="object-mobile-fixed-cta d-lg-none">
                    <button
                      type="button"
                      className="btn btn-success w-100"
                      onClick={applyStayParamsFullscreen}
                    >
                      Применить
                    </button>
                  </div>
                </>
              )}

              {mobileStayStep === "guests" && (
                <>
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none"
                      onClick={() => setMobileStayStep("calendar")}
                    >
                      <i className="bi bi-chevron-left"></i> Назад к датам
                    </button>
                  </div>

                  <div className="object-guests-popover-title">Гости и питомцы</div>
                  <div className="object-guests-popover-limit mb-3">
                    Жильё рассчитано максимум на {guestRules.maxGuests} гостей
                  </div>

                  <div className="object-guests-control-row">
                    <div>
                      <div className="object-guests-control-title">Взрослые</div>
                      <div className="object-guests-control-subtitle">от 18 лет</div>
                    </div>

                    <div className="object-counter">
                      <button
                        type="button"
                        disabled={draftGuests.adults <= 1}
                        onClick={() =>
                          setDraftGuests((prev) => ({
                            ...prev,
                            adults: Math.max(1, prev.adults - 1),
                          }))
                        }
                      >
                        −
                      </button>
                      <span>{draftGuests.adults}</span>
                      <button
                        type="button"
                        disabled={draftTotalGuests >= guestRules.maxGuests}
                        onClick={() =>
                          setDraftGuests((prev) => ({
                            ...prev,
                            adults: prev.adults + 1,
                          }))
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="object-guests-control-row">
                    <div>
                      <div className="object-guests-control-title">Дети</div>
                      <div className="object-guests-control-subtitle">
                        {guestRules.childrenAllowed ? "от 0 до 17 лет" : "Нельзя с детьми"}
                      </div>
                    </div>

                    <div className="object-counter">
                      <button
                        type="button"
                        disabled={draftGuests.children <= 0}
                        onClick={() =>
                          setDraftGuests((prev) => ({
                            ...prev,
                            children: Math.max(0, prev.children - 1),
                            childAges: prev.childAges.slice(0, -1),
                          }))
                        }
                      >
                        −
                      </button>
                      <span>{draftGuests.children}</span>
                      <button
                        type="button"
                        disabled={!guestRules.childrenAllowed || draftTotalGuests >= guestRules.maxGuests}
                        onClick={() =>
                          setDraftGuests((prev) => ({
                            ...prev,
                            children: prev.children + 1,
                            childAges: [...prev.childAges, guestRules.minChildAge],
                          }))
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {draftGuests.children > 0 && (
                    <div className="object-child-ages">
                      {draftGuests.childAges.map((age, index) => (
                        <label key={index} className="object-child-age-row">
                          <span>Возраст ребёнка {index + 1}</span>
                          <select
                            value={age}
                            onChange={(e) => {
                              const nextAges = [...draftGuests.childAges];
                              nextAges[index] = Number(e.target.value);
                              setDraftGuests((prev) => ({
                                ...prev,
                                childAges: nextAges,
                              }));
                            }}
                          >
                            {Array.from(
                              { length: 18 - guestRules.minChildAge },
                              (_, i) => guestRules.minChildAge + i
                            ).map((value) => (
                              <option key={value} value={value}>
                                {value === 0 ? "до года" : `${value} лет`}
                              </option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="object-pets-block">
                    <div className="object-pets-row">
                      <div>
                        <div className="object-guests-control-title">Питомцы</div>
                        <div className="object-guests-control-subtitle">
                          {guestRules.petsAllowed ? "Укажите какие" : "Нельзя с питомцами"}
                        </div>
                      </div>

                      <label className="object-switch">
                        <input
                          type="checkbox"
                          checked={draftGuests.pets}
                          disabled={!guestRules.petsAllowed}
                          onChange={(e) =>
                            setDraftGuests((prev) => ({
                              ...prev,
                              pets: e.target.checked,
                              petError: "",
                            }))
                          }
                        />
                        <span></span>
                      </label>
                    </div>

                    {draftGuests.pets && guestRules.petsAllowed && (
                      <>
                        <textarea
                          className="object-pet-textarea"
                          placeholder="Опишите питомца (например: мопс, 7 кг)"
                          value={draftGuests.petDescription}
                          onChange={(e) =>
                            setDraftGuests((prev) => ({
                              ...prev,
                              petDescription: e.target.value,
                              petError: "",
                            }))
                          }
                        />
                        <div className="object-guests-control-subtitle mt-1">
                          Хозяин рассмотрит запрос на проживание с питомцем
                        </div>
                      </>
                    )}

                    {draftGuests.petError && (
                      <div className="object-guests-error">{draftGuests.petError}</div>
                    )}
                  </div>

                  <div className="object-mobile-fixed-cta d-lg-none">
                    <button
                      type="button"
                      className="btn btn-success w-100"
                      onClick={applyMobileGuestsScreen}
                    >
                      Готово
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showLocationFullscreen && (
        <div className="object-fullscreen-backdrop">
          <div className="object-fullscreen-sheet">
            <div className="object-fullscreen-header">
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => setShowLocationFullscreen(false)}
              >
                Назад
              </button>

              <div className="fw-semibold">Расположение</div>

              <div style={{ width: 48 }}></div>
            </div>

            <div className="object-fullscreen-body">
              <div className="mb-3">
                <div className="fw-semibold">{locationTitle}</div>
                <div className="text-muted">{locationAddress}</div>
              </div>

              <div className="object-map-fullscreen mb-3">
                <iframe
                  title="Карта Москвы fullscreen"
                  src="https://yandex.ru/map-widget/v1/?ll=37.617700%2C55.755800&z=12"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>

              <div className="text-muted mb-4">{metroLabel}</div>

              <div className="d-grid gap-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-dark"
                >
                  Открыть в Google Maps
                </a>

                <a
                  href={yandexMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-secondary"
                >
                  Открыть в Яндекс Картах
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {showInfrastructureSheet && (
        <div className="object-bottom-sheet-backdrop">
          <div className="object-bottom-sheet object-info-sheet">
            <div className="object-bottom-sheet-header">
              <div>
                <div className="fw-semibold">Инфраструктура рядом</div>
                <div className="small text-muted">
                  Типы инфраструктуры указаны хозяином
                </div>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={() => setShowInfrastructureSheet(false)}
              />
            </div>

            <div className="object-bottom-sheet-body">
              <div className="object-sheet-list">
                {infrastructureItems.map((item) => (
                  <div key={item.id} className="object-sheet-list-row object-sheet-list-row-icon">
                    <span className="object-sheet-row-icon object-infrastructure-sheet-icon">
                      <i className={`bi ${item.icon}`}></i>
                    </span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showBuildingSheet && (
        <div className="object-bottom-sheet-backdrop">
          <div className="object-bottom-sheet object-info-sheet">
            <div className="object-bottom-sheet-header">
              <div>
                <div className="fw-semibold">Здание и территория</div>
                <div className="small text-muted">
                  Общая информация о доме и прилегающей территории
                </div>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={() => setShowBuildingSheet(false)}
              />
            </div>

            <div className="object-bottom-sheet-body">
              <div className="object-building-sheet-gallery mb-4">
                {buildingGallery.map((src, index) => (
                  <div key={`${src}-sheet-${index}`} className="object-building-sheet-gallery-item">
                    <img src={src} alt={`Здание ${index + 1}`} />
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="fw-semibold mb-2">Общее</div>
                <div className="object-sheet-list">
                  {buildingDetails.general.map((item) => (
                    <div key={item} className="object-sheet-list-row">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="fw-semibold mb-2">Территория</div>
                <div className="object-sheet-list">
                  {buildingDetails.territory.map((item) => (
                    <div key={item} className="object-sheet-list-row">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="fw-semibold mb-2">Доступ и безопасность</div>
                <div className="object-sheet-list">
                  {buildingDetails.safety.map((item) => (
                    <div key={item} className="object-sheet-list-row">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="fw-semibold mb-2">Парковка</div>
                <div className="object-sheet-list">
                  {buildingDetails.parking.map((item) => (
                    <div key={item} className="object-sheet-list-row">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>

    

    
  );

 
}
