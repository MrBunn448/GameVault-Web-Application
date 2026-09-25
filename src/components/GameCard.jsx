import React from 'react';

const STATUS_CONFIG = {
  PLAYING: { label: 'Playing', className: 'badge-playing', icon: '⚔️' },
  COMPLETED: { label: 'Completed', className: 'badge-completed', icon: '🏆' },
  BACKLOG: { label: 'Backlog', className: 'badge-backlog', icon: '⏳' },
  DROPPED: { label: 'Dropped', className: 'badge-dropped', icon: '🛑' },
};

export default function GameCard({ game }) {
  const statusInfo = STATUS_CONFIG[game.status] || {
    label: game.status,
    className: 'badge-default',
    icon: '🎮',
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
      </div>
    </article>
  );
}
