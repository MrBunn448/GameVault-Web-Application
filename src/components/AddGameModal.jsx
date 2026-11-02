import React, { useState } from 'react';

const INITIAL_FORM = {
  title: '',
  status: 'PLAYING',
};

export default function AddGameModal({ isOpen, onClose, onSave, onImportSteam }) {
  if (!isOpen) return null;
  return (
    <AddGameModalDialog
      onClose={onClose}
      onSave={onSave}
      onImportSteam={onImportSteam}
    />
  );
}

function AddGameModalDialog({ onClose, onSave, onImportSteam }) {
  const [mode, setMode] = useState('manual'); // 'manual' or 'steam'
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [steamId, setSteamId] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setApiError(null);
  };

  const validateManual = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Game title is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSteam = () => {
    const newErrors = {};
    if (!steamId.trim()) {
      newErrors.steamId = 'Steam ID is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!validateManual()) return;

    try {
      setIsSubmitting(true);
      setApiError(null);

      const payload = {
        title: formData.title.trim(),
        status: formData.status,
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      setApiError(err.message || 'Failed to add game.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSteamSubmit = async (e) => {
    e.preventDefault();
    if (!validateSteam()) return;

    try {
      setIsSubmitting(true);
      setApiError(null);

      await onImportSteam(steamId.trim());
      onClose();
    } catch (err) {
      setApiError(err.message || 'Failed to import games from Steam.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon">➕</span>
            <h2 id="modal-title" className="modal-title">
              {mode === 'manual' ? 'Add Game to Library' : 'Import from Steam'}
            </h2>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        {/* Tab switcher for Manual vs Steam */}
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1.25rem 0' }}>
          <button
            type="button"
            className={`tab-btn ${mode === 'manual' ? 'active' : ''}`}
            onClick={() => {
              setMode('manual');
              setApiError(null);
            }}
            disabled={isSubmitting}
          >
            ✏️ Manual Entry
          </button>
          <button
            type="button"
            className={`tab-btn ${mode === 'steam' ? 'active' : ''}`}
            onClick={() => {
              setMode('steam');
              setApiError(null);
            }}
            disabled={isSubmitting}
          >
            ☁️ Steam Web API
          </button>
        </div>

        {apiError && (
          <div className="alert alert-error" role="alert" style={{ margin: '1rem 1.25rem 0' }}>
            <span className="alert-icon">⚠️</span>
            <span>{apiError}</span>
          </div>
        )}

        {mode === 'manual' ? (
          <form onSubmit={handleManualSubmit} className="modal-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Game Title <span className="required-star">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                placeholder="e.g. Cyberpunk 2077, God of War"
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting}
                autoFocus
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status <span className="required-star">*</span>
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="PLAYING">⚔️ PLAYING</option>
                <option value="COMPLETED">🏆 COMPLETED</option>
                <option value="BACKLOG">⏳ BACKLOG</option>
                <option value="DROPPED">🛑 DROPPED</option>
              </select>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Game'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSteamSubmit} className="modal-form">
            <div className="form-group">
              <label htmlFor="steamId" className="form-label">
                Steam ID (64-bit ID) <span className="required-star">*</span>
              </label>
              <input
                id="steamId"
                name="steamId"
                type="text"
                className={`form-input ${errors.steamId ? 'input-error' : ''}`}
                placeholder="e.g. 76561198000000000"
                value={steamId}
                onChange={(e) => {
                  setSteamId(e.target.value);
                  if (errors.steamId) {
                    setErrors((prev) => ({ ...prev, steamId: null }));
                  }
                  setApiError(null);
                }}
                disabled={isSubmitting}
                autoFocus
              />
              {errors.steamId && <span className="field-error">{errors.steamId}</span>}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Fetches your owned games, cover images, and logged playtimes directly from Valve&apos;s Steam Web API into the MySQL database.
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
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
