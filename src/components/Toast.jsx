import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      role="status"
      data-cy="toast-notification"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-[6px] border border-[#d3d3d3] bg-white px-4 py-3 shadow-lg text-[13px] text-[#242424] transition-all"
    >
      <span>{isSuccess ? '✅' : '⚠️'}</span>
      <span className="font-medium">{toast.message}</span>
      <button
        onClick={onClose}
        data-cy="toast-dismiss-btn"
        className="ml-2 text-[12px] text-[#717171] hover:text-[#242424]"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}
