import React, { useState } from 'react';

const STATUS_DISPLAY = {
  PLAYING: 'Playing',
  COMPLETED: 'Completed',
  BACKLOG: 'Backlog',
  DROPPED: 'Dropped',
};

export default function GameCard({ game, onDelete }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const rawStatus = (game.status || 'BACKLOG').toUpperCase();
  const isPlaying = rawStatus === 'PLAYING';
  const displayStatus = STATUS_DISPLAY[rawStatus] || game.status;

  const hours =
    game.playtimeMinutes != null
      ? game.playtimeMinutes / 60
      : (game.hours || 0);

  const source = game.steamAppId ? 'Steam' : 'Manual';

  return (
    <article
      data-cy="game-card"
      data-game-id={game.id}
      className="overflow-hidden rounded-[6px] border border-[#d3d3d3] bg-white transition-shadow hover:shadow-sm flex flex-col justify-between"
    >
      {/* Cover Image Area */}
      <div className="relative flex h-[156px] w-full items-center justify-center overflow-hidden bg-[#e8e8e8]">
        {game.headerImageUrl ? (
          <img
            src={game.headerImageUrl}
            alt={game.title}
            className="h-full w-full object-cover transition-transform duration-200 hover:scale-102"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 text-[#717171]">
            <span className="text-2xl">🎮</span>
            <span className="text-[11px] font-medium tracking-[1.2px]">
              COVER IMAGE
            </span>
          </div>
        )}

        {/* Status Badge */}
        <span
          data-cy="game-status-badge"
          className={`absolute left-3 top-3 flex h-[26px] items-center rounded-[4px] border px-2 text-[12px] font-medium shadow-xs ${
            isPlaying
              ? 'border-[#242424] bg-[#242424] text-white'
              : 'border-[#a0a0a0] bg-white text-[#242424]'
          }`}
        >
          {displayStatus}
        </span>

        {/* Steam / ID Tag */}
        <span className="absolute right-3 top-3 rounded-[3px] bg-black/60 px-1.5 py-0.5 text-[10px] font-mono text-white backdrop-blur-xs">
          {game.steamAppId ? `Steam #${game.steamAppId}` : `#${game.id}`}
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-4">
        <h2
          data-cy="game-title"
          className="text-[17px] font-semibold leading-snug text-[#242424] line-clamp-2"
          title={game.title}
        >
          {game.title}
        </h2>

        {/* Card Footer / Metadata */}
        <div className="flex items-center justify-between gap-3 border-t border-[#f0f0f0] pt-3 text-[12px]">
          <div className="flex min-w-0 items-center gap-1.5 text-[#717171]">
            <span>⏱️</span>
            <span className="truncate">{hours.toFixed(1)} hrs played</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="shrink-0 rounded-[4px] border border-[#d3d3d3] bg-[#f5f5f5] px-2 py-0.5 text-[11px] text-[#717171]">
              {source}
            </span>

            {onDelete && (
              isConfirmingDelete ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    data-cy="cancel-delete-btn"
                    className="text-[11px] text-[#717171] hover:underline"
                    onClick={() => setIsConfirmingDelete(false)}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    data-cy="confirm-delete-btn"
                    className="rounded-[3px] bg-[#dc2626] px-1.5 py-0.5 text-[11px] font-medium text-white hover:bg-[#b91c1c]"
                    onClick={() => {
                      setIsConfirmingDelete(false);
                      onDelete(game.id);
                    }}
                  >
                    Yes
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  data-cy="delete-game-btn"
                  className="text-[#a0a0a0] hover:text-[#dc2626] transition-colors"
                  onClick={() => setIsConfirmingDelete(true)}
                  title="Remove game from library"
                  aria-label={`Delete ${game.title}`}
                >
                  🗑️
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
