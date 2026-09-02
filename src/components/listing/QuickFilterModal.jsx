export default function QuickFilterModal({ open, onClose, title, onClear, children }) {
  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('filters-backdrop')) onClose();
  };

  return (
    <div className="filters-backdrop is-open" onClick={handleBackdropClick}>
      <div className="filters-panel filters-panel--mini" onClick={(e) => e.stopPropagation()}>
        <header className="filters-header">
          <h2 className="filters-title mb-0">{title}</h2>

          <div className="d-flex align-items-center gap-3 ms-auto">
            

            <button
              type="button"
              className="filters-close-btn d-none d-md-inline"
              onClick={onClose}
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>
        </header>

        
        

        <div className="filters-body">{children}</div>

        <footer className="filters-footer">
          <div className="filters-footer-inner d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-md-end gap-2">
            <button type="button" className="btn btn-brand listing-cta" onClick={onClose}>
              Применить
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
