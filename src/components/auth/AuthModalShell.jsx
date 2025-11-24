import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function AuthModalShell({ children, onClose }) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Закрытие по ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const modal = (
    <div className="auth-modal-backdrop" onClick={handleBackdropClick}>
      <div className="auth-modal-dialog">
        <button
          type="button"
          className="auth-modal-close"
          aria-label="Закрыть"
          onClick={() => onClose?.()}
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
