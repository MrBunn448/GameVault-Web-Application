import React, { useState } from 'react';

const STATUS_CONFIG = {
  PLAYING: { label: 'Playing', className: 'badge-playing', icon: '⚔️' },
  COMPLETED: { label: 'Completed', className: 'badge-completed', icon: '🏆' },
  BACKLOG: { label: 'Backlog', className: 'badge-backlog', icon: '⏳' },
  DROPPED: { label: 'Dropped', className: 'badge-dropped', icon: '🛑' },
};

export default function GameCard({ game, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const statusInfo = STATUS_CONFIG[game.status] || {
    label: game.status,
    className: 'badge-default',
    icon: '🎮',
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(game.id);
    } catch {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <article className="game-card">
      <div className="card-header">
        <span className={`status-badge ${statusInfo.className}`}>
          <span className="badge-icon">{statusInfo.icon}</span>
          {statusInfo.label}
        </span>
        <span className="game-id-tag">#{game.id}</span>
      </div>

      <div className="card-body">
        <h3 className="game-title" title={game.title}>
          {game.title}
        </h3>

        <div className="game-meta-grid">
          <div className="meta-item">
            <span className="meta-label">Rating</span>
            <span className="meta-value">
              {game.personalRating != null ? (
                <span className="rating-badge">
                  ⭐ <strong>{game.personalRating}</strong>/10
                </span>
              ) : (
                <span className="meta-muted">Unrated</span>
              )}
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Playtime</span>
            <span className="meta-value">
              ⏱️ <strong>{game.playtimeHours ?? 0}</strong> hrs
            </span>
          </div>

          {game.startDate && (
            <div className="meta-item">
              <span className="meta-label">Started</span>
              <span className="meta-value">{formatDate(game.startDate)}</span>
            </div>
          )}

          {game.completedDate && (
            <div className="meta-item">
              <span className="meta-label">Completed</span>
              <span className="meta-value">{formatDate(game.completedDate)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-footer">
        {showConfirm ? (
          <div className="delete-confirm-group">
            <span className="delete-prompt">Remove game?</span>
            <button
              className="btn btn-sm btn-danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Removing...' : 'Confirm'}
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="btn btn-sm btn-ghost btn-danger-hover"
            onClick={() => setShowConfirm(true)}
            title="Remove from library"
          >
            🗑️ Remove
          </button>
        )}
      </div>
    </article>
  );
}
