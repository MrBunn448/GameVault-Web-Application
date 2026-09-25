import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className={`toast-container ${isSuccess ? 'toast-success' : 'toast-error'}`} role="status">
      <span className="toast-icon">{isSuccess ? '✅' : '❌'}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss toast">
        ✕
      </button>
    </div>
  );
}
