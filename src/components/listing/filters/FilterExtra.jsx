import { useState, useEffect, useMemo } from 'react';

export default function FilterExtra({ onSummaryChange, resetToken }) {
  const [extraDocs, setExtraDocs] = useState(false);
  const [extraOwner, setExtraOwner] = useState(false);
  const [extraRosreestr, setExtraRosreestr] = useState(false);

  const summary = useMemo(() => {
    const parts = [];
    if (extraDocs) parts.push('Отчётные документы');
    if (extraOwner) parts.push('От собственника');
    if (extraRosreestr) parts.push('Проверено в Росреестре');
    if (!parts.length) return null;
    return parts.join(', ');
  }, [extraDocs, extraOwner, extraRosreestr]);

  useEffect(() => {
    if (!onSummaryChange) return;
    onSummaryChange(summary);
  }, [summary, onSummaryChange]);

  useEffect(() => {
    if (resetToken == null) return;
    setExtraDocs(false);
    setExtraOwner(false);
    setExtraRosreestr(false);
  }, [resetToken]);

  return (
    <section className="filter-section">
      <div className="filter-section-header">
        <div className="filter-section-title">Дополнительно</div>
      </div>

      <div className="filters-checkbox-row">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="extraDocs"
            checked={extraDocs}
            onChange={(e) => setExtraDocs(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="extraDocs">
            Отчётные документы
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="extraOwner"
            checked={extraOwner}
            onChange={(e) => setExtraOwner(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="extraOwner">
            От собственника
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="extraRosreestr"
            checked={extraRosreestr}
            onChange={(e) => setExtraRosreestr(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="extraRosreestr">
            Проверено в Росреестре
          </label>
        </div>
      </div>
    </section>
  );
}
