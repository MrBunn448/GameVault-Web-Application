import React from 'react';

const STATUS_OPTIONS = [
  { key: 'ALL', label: 'All' },
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
  itemsCount = 0,
}) {
  return (
    <section className="flex flex-col gap-4" aria-label="Library controls">
      <div className="flex flex-col gap-4 md:flex-row">
        <label className="relative flex h-11 flex-1 items-center">
          <span className="pointer-events-none absolute left-4 text-[16px] text-[#717171]">
            🔍
          </span>
          <span className="sr-only">Search your games</span>
          <input
            data-cy="search-input"
            className="h-full w-full rounded-[4px] border border-[#d3d3d3] bg-white pl-[45px] pr-9 text-[14px] text-[#242424] outline-none placeholder:text-[#717171] focus:border-[#717171]"
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search your games..."
            value={searchQuery}
          />
          {searchQuery && (
            <button
              type="button"
              data-cy="clear-search-btn"
              className="absolute right-3 text-[14px] text-[#717171] hover:text-[#242424]"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </label>

        <label className="relative h-11 md:w-[240px]">
          <span className="sr-only">Sort games</span>
          <select
            data-cy="sort-select"
            className="h-full w-full appearance-none rounded-[4px] border border-[#d3d3d3] bg-white px-4 pr-10 text-[14px] text-[#242424] outline-none focus:border-[#717171] cursor-pointer"
            onChange={(e) => onSortChange(e.target.value)}
            value={sortBy}
          >
            <option value="id-desc">Sort: Recently added</option>
            <option value="title-asc">Sort: Title (A–Z)</option>
            <option value="title-desc">Sort: Title (Z–A)</option>
            <option value="hours-desc">Sort: Most played</option>
            <option value="hours-asc">Sort: Least played</option>
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-[#717171]">
            ▼
          </span>
        </label>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex max-w-full gap-1 overflow-x-auto" role="tablist">
          {STATUS_OPTIONS.map(({ key, label }) => {
            const isSelected = statusFilter === key;
            return (
              <button
                key={key}
                role="tab"
                data-cy={`filter-${key.toLowerCase()}`}
                aria-selected={isSelected}
                className={`h-10 shrink-0 rounded-[4px] px-4 text-[14px] transition-colors ${
                  isSelected
                    ? 'bg-[#242424] text-white font-semibold shadow-xs'
                    : 'text-[#717171] hover:bg-white hover:text-[#242424]'
                }`}
                onClick={() => onStatusChange(key)}
                type="button"
              >
                {label}
              </button>
            );
          })}
        </div>

        <span className="shrink-0 text-[12px] text-[#717171]">
          {itemsCount} {itemsCount === 1 ? 'game' : 'games'} in your library
        </span>
      </div>
    </section>
  );
}
