import React, { useEffect, useState } from 'react';

const STATUS_OPTIONS = [
  { value: 'PLAYING', label: 'Playing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'BACKLOG', label: 'Backlog' },
  { value: 'DROPPED', label: 'Dropped' },
];

export default function AddGameModal({ isOpen, onClose, onSave, onImportSteam }) {
  if (!isOpen) return null;

  return (
    <AddGameDialog
      onClose={onClose}
      onSave={onSave}
      onImportSteam={onImportSteam}
    />
  );
}

function AddGameDialog({ onClose, onSave, onImportSteam }) {
  const [mode, setMode] = useState('manual'); // 'manual' or 'steam'
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('PLAYING');
  const [hours, setHours] = useState('');
  const [headerImageUrl, setHeaderImageUrl] = useState('');
  const [steamId, setSteamId] = useState('');

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, onClose]);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Game title is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const parsedHours = parseFloat(hours) || 0;
      const playtimeMinutes = Math.round(parsedHours * 60);

      await onSave({
        title: title.trim(),
        status,
        playtimeMinutes,
        headerImageUrl: headerImageUrl.trim() || null,
      });

      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add game.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSteamSubmit = async (e) => {
    e.preventDefault();
    if (!steamId.trim()) {
      setError('Steam ID or vanity username is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await onImportSteam(steamId.trim());
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to import games from Steam.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      aria-labelledby="add-game-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-xs"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      role="dialog"
    >
      <div data-cy="add-game-modal" className="w-full max-w-[480px] rounded-[6px] border border-[#d3d3d3] bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="add-game-title"
              data-cy="modal-heading"
              className="text-[22px] font-semibold text-[#242424]"
            >
              Add a game
            </h2>
            <p className="mt-1 text-[14px] text-[#717171]">
              Add a title to your local GameVault library.
            </p>
          </div>
          <button
            type="button"
            data-cy="modal-close-btn"
            className="text-[18px] text-[#717171] hover:text-[#242424]"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher: Manual vs Steam */}
        <div className="mt-4 flex gap-1 rounded-[4px] bg-[#f0f0f0] p-1">
          <button
            type="button"
            data-cy="tab-manual-btn"
            className={`flex-1 rounded-[3px] py-1.5 text-[13px] font-medium transition-colors ${
              mode === 'manual'
                ? 'bg-white text-[#242424] shadow-xs'
                : 'text-[#717171] hover:text-[#242424]'
            }`}
            onClick={() => {
              setMode('manual');
              setError(null);
            }}
            disabled={isSubmitting}
          >
            ✏️ Manual Entry
          </button>
          <button
            type="button"
            data-cy="tab-steam-btn"
            className={`flex-1 rounded-[3px] py-1.5 text-[13px] font-medium transition-colors ${
              mode === 'steam'
                ? 'bg-white text-[#242424] shadow-xs'
                : 'text-[#717171] hover:text-[#242424]'
            }`}
            onClick={() => {
              setMode('steam');
              setError(null);
            }}
            disabled={isSubmitting}
          >
            ☁️ Steam Web API
          </button>
        </div>

        {error && (
          <div data-cy="modal-error-message" className="mt-4 rounded-[4px] border border-[#fca5a5] bg-[#fef2f2] px-3 py-2 text-[13px] text-[#b91c1c]">
            ⚠️ {error}
          </div>
        )}

        {mode === 'manual' ? (
          <form onSubmit={handleManualSubmit} className="mt-5 grid gap-4">
            <label className="form-field">
              <span>Game Title *</span>
              <input
                autoFocus
                data-cy="game-title-input"
                placeholder="e.g. Baldur’s Gate 3, Hades"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="form-field">
                <span>Status</span>
                <select
                  data-cy="game-status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={isSubmitting}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Hours played</span>
                <input
                  type="number"
                  data-cy="game-hours-input"
                  min="0"
                  step="0.1"
                  placeholder="0.0"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  disabled={isSubmitting}
                />
              </label>
            </div>

            <label className="form-field">
              <span>Cover Image URL (optional)</span>
              <input
                type="url"
                data-cy="game-image-input"
                placeholder="https://..."
                value={headerImageUrl}
                onChange={(e) => setHeaderImageUrl(e.target.value)}
                disabled={isSubmitting}
              />
            </label>

            <div className="mt-4 flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="secondary-button"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                data-cy="submit-game-btn"
                className="primary-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Add Game'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSteamSubmit} className="mt-5 grid gap-4">
            <label className="form-field">
              <span>Steam ID or Profile URL *</span>
              <input
                autoFocus
                data-cy="steam-id-input"
                placeholder="e.g. 76561198000000000 or custom vanity URL"
                required
                value={steamId}
                onChange={(e) => setSteamId(e.target.value)}
                disabled={isSubmitting}
              />
            </label>
            <p className="text-[12px] text-[#717171]">
              Imports all owned games, cover artworks, and recorded playtimes from Valve&apos;s Steam Web API directly into MySQL.
            </p>

            <div className="mt-4 flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="secondary-button"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                data-cy="submit-steam-btn"
                className="primary-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Syncing...' : 'Sync Steam Library'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
