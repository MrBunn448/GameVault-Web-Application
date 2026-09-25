import React from 'react';

export default function LibraryStats({ items = [] }) {
  const totalGames = items.length;
  const playingCount = items.filter((g) => g.status === 'PLAYING').length;
  const completedCount = items.filter((g) => g.status === 'COMPLETED').length;
  const backlogCount = items.filter((g) => g.status === 'BACKLOG').length;
  const droppedCount = items.filter((g) => g.status === 'DROPPED').length;

  return (
    <section className="stats-grid" aria-label="Library Overview Statistics">
      <div className="stat-card">
        <div className="stat-icon">📚</div>
        <div className="stat-content">
          <span className="stat-value">{totalGames}</span>
          <span className="stat-label">Total Games</span>
        </div>
      </div>

      <div className="stat-card stat-playing">
        <div className="stat-icon">⚔️</div>
        <div className="stat-content">
          <span className="stat-value">{playingCount}</span>
          <span className="stat-label">Playing</span>
        </div>
      </div>

      <div className="stat-card stat-completed">
        <div className="stat-icon">🏆</div>
        <div className="stat-content">
          <span className="stat-value">{completedCount}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      <div className="stat-card stat-backlog">
        <div className="stat-icon">⏳</div>
        <div className="stat-content">
          <span className="stat-value">{backlogCount}</span>
          <span className="stat-label">Backlog</span>
        </div>
      </div>

      <div className="stat-card stat-dropped">
        <div className="stat-icon">🛑</div>
        <div className="stat-content">
          <span className="stat-value">{droppedCount}</span>
          <span className="stat-label">Dropped</span>
        </div>
      </div>
    </section>
  );
}
