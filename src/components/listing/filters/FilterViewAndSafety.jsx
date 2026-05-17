import { useState, useMemo, useEffect } from 'react';

const VIEW_OPTIONS = ['Двор', 'Улица', 'Море', 'Парк', 'Лес'];

const SAFETY_OPTIONS = [
  'Кодовый замок',
  'Сигнализация',
  'Видеодомофон',
  'Датчик дыма',
  'Датчик угарного газа',
];

export default function FilterViewAndSafety({
  onViewSummaryChange,
  onSafetySummaryChange,
  resetToken,
}) {
  const [viewSelected, setViewSelected] = useState(new Set());
  const [safetySelected, setSafetySelected] = useState(new Set());

  const buildSummary = (set) => {
    if (!set || set.size === 0) return 'Не выбрано';
    const arr = Array.from(set);
    if (arr.length <= 2) return arr.join(', ');
    return `${arr.slice(0, 2).join(', ')} + ещё ${arr.length - 2}`;
  };

  const viewSummary = useMemo(() => buildSummary(viewSelected), [viewSelected]);
  const safetySummary = useMemo(
    () => buildSummary(safetySelected),
    [safetySelected]
  );

  const checkbox = (id, label, checked, onChange) => (
    <div className="form-check" key={id}>
      <input
        className="form-check-input"
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );

  useEffect(() => {
    if (onViewSummaryChange) {
      const val = viewSummary === 'Не выбрано' ? null : viewSummary;
      onViewSummaryChange(val);
    }
  }, [viewSummary, onViewSummaryChange]);

  useEffect(() => {
    if (onSafetySummaryChange) {
      const val = safetySummary === 'Не выбрано' ? null : safetySummary;
      onSafetySummaryChange(val);
    }
  }, [safetySummary, onSafetySummaryChange]);

  useEffect(() => {
    if (resetToken == null) return;
    setViewSelected(new Set());
    setSafetySelected(new Set());
  }, [resetToken]);

  return (
    <section className="filter-section">
      {/* ОБЗОР ИЗ ОКНА */}
      <details className="filter-accordion">
        <summary>
          <div>
            <div className="filter-accordion-title">Обзор из окна</div>
            <div className="filter-accordion-meta">{viewSummary}</div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="filter-clear-link"
              onClick={(e) => {
                e.preventDefault();
                setViewSelected(new Set());
              }}
            >
              Очистить
            </button>
            <i className="bi bi-chevron-down accordion-chevron" />
          </div>
        </summary>

        <div className="filter-accordion-body">
          <div className="filters-checkbox-row">
            {VIEW_OPTIONS.map((label, idx) =>
              checkbox(
                `view-${idx}`,
                label,
                viewSelected.has(label),
                (checked) => {
                  if (checked) {
                    setViewSelected((prev) => new Set(prev).add(label));
                  } else {
                    setViewSelected((prev) => {
                      const next = new Set(prev);
                      next.delete(label);
                      return next;
                    });
                  }
                }
              )
            )}
          </div>
        </div>
      </details>

      {/* БЕЗОПАСНОСТЬ */}
      <details className="filter-accordion mt-3">
        <summary>
          <div>
            <div className="filter-accordion-title">Безопасность</div>
            <div className="filter-accordion-meta">{safetySummary}</div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="filter-clear-link"
              onClick={(e) => {
                e.preventDefault();
                setSafetySelected(new Set());
              }}
            >
              Очистить
            </button>
            <i className="bi bi-chevron-down accordion-chevron" />
          </div>
        </summary>

        <div className="filter-accordion-body">
          <div className="filters-checkbox-row">
            {SAFETY_OPTIONS.map((label, idx) =>
              checkbox(
                `safety-${idx}`,
                label,
                safetySelected.has(label),
                (checked) => {
                  if (checked) {
                    setSafetySelected((prev) => new Set(prev).add(label));
                  } else {
                    setSafetySelected((prev) => {
                      const next = new Set(prev);
                      next.delete(label);
                      return next;
                    });
                  }
                }
              )
            )}
          </div>
        </div>
      </details>
    </section>
  );
}
