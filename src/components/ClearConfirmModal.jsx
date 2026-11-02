import React, { useEffect, useState } from 'react';

export default function ClearConfirmModal({ isOpen, onClose, onConfirm, gameCount }) {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={!isDeleting ? onClose : undefined} role="presentation">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-modal-title"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon" role="img" aria-label="warning">⚠️</span>
            <h2 id="clear-modal-title" className="modal-title">Clear Entire Library?</h2>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isDeleting}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
            Are you sure you want to permanently delete all <strong>{gameCount}</strong> game{gameCount === 1 ? '' : 's'} from your database?
          </p>
          <div className="alert alert-error" role="alert" style={{ marginBottom: '1rem' }}>
            <span className="alert-icon">🛑</span>
            <span>This action cannot be undone. All stored titles, playtimes, and statuses will be erased. You can re-import from Steam at any time.</span>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel (Go Back)
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
          </button>
        </div>
      </div>
    </div>
  );
}
