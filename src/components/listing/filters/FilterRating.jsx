import { useState, useEffect, useMemo } from 'react';
//import { HOUSING_TYPES } from '../../../pages/Listing/FiltersModal.jsx';
import { HOUSING_TYPES } from '../../../pages/Listing/constants/housingTypes.js';


export default function FilterRating({ housingType, onSummaryChange, resetToken }) {
  const [rating, setRating] = useState(null); // храним "4.5+", "4.0+", "5.0"
  const [onlyReviews, setOnlyReviews] = useState(false);

  const isRoom = housingType === HOUSING_TYPES.ROOM;

  // опции по ТЗ: для комнаты ⭐ 4.5+ / ⭐ 4.0+ (без 5.0), порядок важен
  const ratingOptions = useMemo(() => {
    if (isRoom) {
      return [
        { value: '4.5+', label: '⭐ 4.5+' },
        { value: '4.0+', label: '⭐ 4.0+' },
      ];
    }
    return [
      { value: '4.0+', label: '⭐ 4.0+' },
      { value: '4.5+', label: '⭐ 4.5+' },
      { value: '5.0', label: '⭐ 5.0' },
    ];
  }, [isRoom]);

  // если тип сменился и текущий рейтинг не входит в опции — очищаем
  useEffect(() => {
    if (rating == null) return;
    const allowed = ratingOptions.some((o) => o.value === rating);
    if (!allowed) setRating(null);
  }, [rating, ratingOptions]);

  const summary = useMemo(() => {
    if (!rating && !onlyReviews) return null;
    const parts = [];
    if (rating) parts.push(`Рейтинг ${rating}`);
    if (onlyReviews) parts.push('только с отзывами');
    return parts.join(', ');
  }, [rating, onlyReviews]);

  useEffect(() => {
    if (!onSummaryChange) return;
    onSummaryChange(summary);
  }, [summary, onSummaryChange]);

  useEffect(() => {
    if (resetToken == null) return;
    setRating(null);
    setOnlyReviews(false);
  }, [resetToken]);

  const clearAll = () => {
    setRating(null);
    setOnlyReviews(false);
  };

  return (
    <section className="filter-section">
      <div className="filter-section-header">
        <div className="filter-section-title">Рейтинг</div>

        <button type="button" className="filter-clear-link" onClick={clearAll}>
          Очистить
        </button>
      </div>

      <div className="chips-row mb-2" data-single-select="true">
        {ratingOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={'filter-chip' + (rating === opt.value ? ' filter-chip-active' : '')}
            onClick={() => setRating((cur) => (cur === opt.value ? null : opt.value))}
          >
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="form-check d-flex align-items-center gap-2">
        <input
          className="form-check-input"
          type="checkbox"
          id="onlyWithReviews"
          checked={onlyReviews}
          onChange={(e) => setOnlyReviews(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="onlyWithReviews">
          Только с отзывами
        </label>

        {/* tooltip как в ТЗ (можно оставить title — будет работать сразу) */}
        <i
          className="bi bi-info-circle text-muted"
          title="Скрыть объявления без отзывов"
          aria-label="Подсказка"
        />
      </div>
    </section>
  );
}
