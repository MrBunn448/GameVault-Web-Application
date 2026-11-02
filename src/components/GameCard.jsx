import React, { useState } from 'react';

const STATUS_CONFIG = {
  PLAYING: { label: 'Playing', className: 'badge-playing', icon: '⚔️' },
  COMPLETED: { label: 'Completed', className: 'badge-completed', icon: '🏆' },
  BACKLOG: { label: 'Backlog', className: 'badge-backlog', icon: '⏳' },
  DROPPED: { label: 'Dropped', className: 'badge-dropped', icon: '🛑' },
};

export default function GameCard({ game, onDelete }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const statusInfo = STATUS_CONFIG[game.status] || {
    label: game.status,
    className: 'badge-default',
    icon: '🎮',
  };

  const formatPlaytime = (minutes) => {
    if (!minutes || minutes <= 0) return '0 hrs';
    if (minutes < 60) return `${minutes} mins`;
    const hours = (minutes / 60).toFixed(1);
    return `${hours} hrs`;
  };

  return (
    <article className="game-card">
      {game.headerImageUrl && (
        <img
          src={game.headerImageUrl}
          alt={game.title}
          className="game-card-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      <div className="card-header">
        <span className={`status-badge ${statusInfo.className}`}>
          <span className="badge-icon">{statusInfo.icon}</span>
          {statusInfo.label}
        </span>
        <span className="game-id-tag">
          {game.steamAppId ? `Steam #${game.steamAppId}` : `#${game.id}`}
        </span>
      </div>

      <div className="card-body">
        <h3 className="game-title" title={game.title}>
          {game.title}
        </h3>

        <div className="game-meta-grid">
          <div className="meta-item">
            <span className="meta-label">Playtime</span>
            <span className="meta-value">{formatPlaytime(game.playtimeMinutes)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Source</span>
            <span className="meta-value">{game.steamAppId ? 'Steam' : 'Manual'}</span>
          </div>
        </div>
      </div>

      {onDelete && (
        <div className="card-footer">
          {isConfirmingDelete ? (
            <div className="delete-confirm-group">
              <span className="delete-prompt">Delete?</span>
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => setIsConfirmingDelete(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setIsConfirmingDelete(false);
                  onDelete(game.id);
                }}
              >
                Confirm
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-sm btn-ghost btn-danger-hover"
              onClick={() => setIsConfirmingDelete(true)}
              title="Delete game from library"
              aria-label={`Delete ${game.title}`}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
}
