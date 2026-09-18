import React from 'react';

export default function EmptyState({ isFiltered, onOpenAddModal, onResetFilter }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{isFiltered ? '🔍' : '🎮'}</div>
      <h3 className="empty-title">
        {isFiltered ? 'No games found' : 'Your vault is currently empty'}
      </h3>
      <p className="empty-description">
        {isFiltered
          ? 'Try adjusting your search query or status filter to find what you are looking for.'
          : 'Start tracking your gaming journey by adding your first game to your library!'}
      </p>
      <div className="empty-actions">
        {isFiltered ? (
          <button className="btn btn-secondary" onClick={onResetFilter}>
            Clear Filters
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            ＋ Add Your First Game
          </button>
        )}
      </div>
    </div>
  );
}
