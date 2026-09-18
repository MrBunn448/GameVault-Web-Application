import React, { useState } from 'react';

const INITIAL_FORM = {
  title: '',
  status: 'PLAYING',
  personalRating: '',
  playtimeHours: '',
  startDate: '',
  completedDate: '',
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
    } else if (formData.title.length > 150) {
      newErrors.title = 'Title must not exceed 150 characters.';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required.';
    }

    if (formData.personalRating !== '') {
      const rating = Number(formData.personalRating);
      if (isNaN(rating) || rating < 1 || rating > 10) {
        newErrors.personalRating = 'Rating must be an integer between 1 and 10.';
      }
    }

    if (formData.playtimeHours !== '') {
      const hours = Number(formData.playtimeHours);
      if (isNaN(hours) || hours < 0) {
        newErrors.playtimeHours = 'Playtime hours cannot be negative.';
      }
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
        personalRating: formData.personalRating === '' ? null : Number(formData.personalRating),
        playtimeHours: formData.playtimeHours === '' ? 0 : Number(formData.playtimeHours),
        startDate: formData.startDate || null,
        completedDate: formData.completedDate || null,
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      setApiError(err.message || 'Failed to add game to library. Please check your backend connection.');
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
              placeholder="e.g. Cyberpunk 2077, God of War, Persona 5"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
              autoFocus
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="status" className="form-label">
                Status <span className="required-star">*</span>
              </label>
              <select
                id="status"
                name="status"
                className={`form-select ${errors.status ? 'input-error' : ''}`}
                value={formData.status}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="PLAYING">⚔️ PLAYING</option>
                <option value="COMPLETED">🏆 COMPLETED</option>
                <option value="BACKLOG">⏳ BACKLOG</option>
                <option value="DROPPED">🛑 DROPPED</option>
              </select>
              {errors.status && <span className="field-error">{errors.status}</span>}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="personalRating" className="form-label">
                Rating (1 – 10)
              </label>
              <input
                id="personalRating"
                name="personalRating"
                type="number"
                min="1"
                max="10"
                className={`form-input ${errors.personalRating ? 'input-error' : ''}`}
                placeholder="e.g. 9"
                value={formData.personalRating}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.personalRating && <span className="field-error">{errors.personalRating}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="playtimeHours" className="form-label">
                Playtime (hours)
              </label>
              <input
                id="playtimeHours"
                name="playtimeHours"
                type="number"
                min="0"
                className={`form-input ${errors.playtimeHours ? 'input-error' : ''}`}
                placeholder="e.g. 25"
                value={formData.playtimeHours}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.playtimeHours && <span className="field-error">{errors.playtimeHours}</span>}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="startDate" className="form-label">
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="completedDate" className="form-label">
              Completed Date
            </label>
            <input
              id="completedDate"
              name="completedDate"
              type="date"
              className="form-input"
              value={formData.completedDate}
              onChange={handleChange}
              disabled={isSubmitting}
            />
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
