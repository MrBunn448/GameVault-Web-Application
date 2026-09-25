import React, { useState } from 'react';

const INITIAL_FORM = {
  title: '',
  status: 'PLAYING',
};

export default function AddGameModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;
  return <AddGameModalDialog onClose={onClose} onSave={onSave} />;
}

function AddGameModalDialog({ onClose, onSave }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
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

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Game title is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

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
            <h2 id="modal-title" className="modal-title">Add Game to Library</h2>
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

        {apiError && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
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
      </div>
    </div>
  );
}
