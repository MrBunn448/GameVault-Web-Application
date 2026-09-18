import React from 'react';

const STATUS_FILTERS = [
  { key: 'ALL', label: 'All Games' },
  { key: 'PLAYING', label: 'Playing' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'BACKLOG', label: 'Backlog' },
  { key: 'DROPPED', label: 'Dropped' },
];

export default function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  items = [],
}) {
  const getCount = (key) => {
    if (key === 'ALL') return items.length;
    return items.filter((i) => i.status === key).length;
  };

  return (
    <div className="filter-bar">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search games by title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button 
            className="search-clear-btn" 
            onClick={() => onSearchChange('')}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-controls">
        <div className="status-tabs" role="tablist">
          {STATUS_FILTERS.map(({ key, label }) => {
            const count = getCount(key);
            const isActive = statusFilter === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={isActive}
                className={`tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => onStatusChange(key)}
              >
                {label} <span className="tab-badge">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="sort-box">
          <label htmlFor="sort-select" className="sort-label">Sort by:</label>
          <select
            id="sort-select"
            className="select-input"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="id-desc">Recently Added</option>
            <option value="title-asc">Title (A – Z)</option>
            <option value="title-desc">Title (Z – A)</option>
            <option value="rating-desc">Rating (High – Low)</option>
            <option value="playtime-desc">Playtime (High – Low)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
