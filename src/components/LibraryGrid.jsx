import React from 'react';
import GameCard from './GameCard';

export default function LibraryGrid({
  isLoading,
  visibleGames,
  isFiltered,
  onOpenAddModal,
  onDeleteGame,
}) {
  if (isLoading) {
    return (
      <div data-cy="loading-spinner" className="flex min-h-[250px] flex-col items-center justify-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-[#242424] border-t-transparent" />
        <p className="text-[14px] text-[#717171]">Loading your game library...</p>
      </div>
    );
  }

  if (visibleGames.length > 0) {
    return (
      <section
        aria-label="Game library"
        data-cy="games-grid"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visibleGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onDelete={onDeleteGame}
          />
        ))}
      </section>
    );
  }

  return (
    <section data-cy="empty-state" className="flex min-h-[272px] flex-col items-center justify-center rounded-[6px] border border-dashed border-[#a0a0a0] bg-white p-8 text-center">
      <h2 data-cy="empty-state-title" className="text-[17px] font-semibold text-[#242424]">
        {isFiltered ? 'No games found' : 'Your library is empty'}
      </h2>
      <p data-cy="empty-state-desc" className="mt-2 text-[14px] text-[#717171]">
        {isFiltered
          ? 'Try another search or choose a different status filter.'
          : 'Add a game manually or import your owned games from Steam to get started.'}
      </p>
      {!isFiltered && (
        <button
          type="button"
          data-cy="empty-add-game-btn"
          className="primary-button mt-4"
          onClick={onOpenAddModal}
        >
          + Add Game
        </button>
      )}
    </section>
  );
}
