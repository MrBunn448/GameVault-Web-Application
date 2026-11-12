import React, { useEffect, useState } from 'react';

export default function ClearConfirmModal({ isOpen, onClose, onConfirm, gameCount }) {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    <div
      aria-labelledby="clear-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-xs"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
      role="dialog"
    >
      <div data-cy="clear-confirm-modal" className="w-full max-w-[460px] rounded-[6px] border border-[#d3d3d3] bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[20px]">⚠️</span>
            <h2
              id="clear-modal-title"
              data-cy="clear-modal-title"
              className="text-[20px] font-semibold text-[#242424]"
            >
              Reset your library?
            </h2>
          </div>
          <button
            type="button"
            data-cy="clear-modal-close-btn"
            className="text-[18px] text-[#717171] hover:text-[#242424]"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 text-[14px] leading-relaxed text-[#717171]">
          <p>
            Are you sure you want to permanently delete all{' '}
            <strong className="text-[#242424]">{gameCount}</strong> game
            {gameCount === 1 ? '' : 's'} from your database?
          </p>
          <div className="mt-3 rounded-[4px] border border-[#fca5a5] bg-[#fef2f2] p-3 text-[13px] text-[#b91c1c]">
            🛑 This action cannot be undone. All stored titles and playtimes will be wiped.
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            data-cy="confirm-clear-all-btn"
            className="rounded-[4px] bg-[#dc2626] px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#b91c1c] disabled:opacity-50"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Resetting...' : 'Yes, Delete All'}
          </button>
        </div>
      </div>
    </div>
  );
}
