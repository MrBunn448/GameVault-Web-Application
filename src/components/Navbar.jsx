import React from 'react';

export default function Navbar({
  onOpenAddModal,
  isConnected,
  onRefresh,
  isRefreshing = false,
  gamesCount = 0,
  onOpenClearModal,
}) {
  return (
    <header className="flex min-h-[88px] items-center justify-between gap-5 border-b border-[#d3d3d3] bg-white px-6 py-4 lg:px-16">
      <div className="flex shrink-0 items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-[4px] border-[1.5px] border-[#242424] text-[18px]">
          🎮
        </div>
        <div className="flex flex-col">
          <span className="text-[22px] font-bold tracking-[-0.5px] text-[#242424]">
            GameVault
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <div className="hidden items-center gap-2 pr-1 text-[12px] text-[#717171] sm:flex lg:pr-4">
          <span
            className={`inline-block size-2 rounded-full ${
              isConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
            }`}
          />
          <span>{isConnected ? 'Backend connected' : 'Backend offline (Port 8080)'}</span>
        </div>

        <button
          className="secondary-button"
          disabled={isRefreshing}
          onClick={onRefresh}
          type="button"
          title="Refresh library from database"
        >
          <span className={isRefreshing ? 'animate-spin inline-block' : 'inline-block'}>
            🔄
          </span>
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {gamesCount > 0 && onOpenClearModal && (
          <button
            className="secondary-button text-[#dc2626] hover:border-[#dc2626] hover:bg-red-50"
            onClick={onOpenClearModal}
            type="button"
            title="Delete all stored games from database"
          >
            <span>🗑️</span>
            <span className="hidden sm:inline">Reset Data</span>
          </button>
        )}

        <button
          className="primary-button"
          onClick={onOpenAddModal}
          type="button"
          title="Add a game to your library"
        >
          <span>➕</span>
          <span className="hidden min-[430px]:inline">Add Game</span>
        </button>
      </div>
    </header>
  );
}
