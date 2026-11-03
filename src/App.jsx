import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import LibraryStats from './components/LibraryStats';
import FilterBar from './components/FilterBar';
import GameCard from './components/GameCard';
import AddGameModal from './components/AddGameModal';
import ClearConfirmModal from './components/ClearConfirmModal';
import Toast from './components/Toast';
import {
  getLibrary,
  addGameToLibrary,
  importSteamLibrary,
  deleteGameFromLibrary,
  clearLibrary,
} from './services/api';

export default function App() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('id-desc');
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const loadLibrary = useCallback(async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) setIsRefreshing(true);
      setError(null);
      const data = await getLibrary();
      setGames(data || []);
      setIsConnected(true);
    } catch (err) {
      console.error('Error fetching library:', err);
      setIsConnected(false);
      setError(
        err.message || 'Unable to connect to GameVault backend. Ensure the Spring Boot server is running on port 8080.'
      );
    } finally {
      setIsLoading(false);
      if (showRefreshingState) {
        setTimeout(() => setIsRefreshing(false), 300);
      }
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    getLibrary()
      .then((data) => {
        if (!ignore) {
          setGames(data || []);
          setIsConnected(true);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Error fetching library:', err);
          setIsConnected(false);
          setError(
            err.message ||
              'Unable to connect to GameVault backend. Ensure the Spring Boot server is running on port 8080.'
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleAddGame = async (gameData) => {
    const created = await addGameToLibrary(gameData);
    setGames((prev) => [created, ...prev]);
    setIsConnected(true);
    showToast(`Added "${created.title}" to your library!`, 'success');
  };

  const handleImportSteam = async (steamId) => {
    const imported = await importSteamLibrary(steamId);
    await loadLibrary(false);
    const count = Array.isArray(imported) ? imported.length : 0;
    showToast(`Synced ${count} game${count === 1 ? '' : 's'} from Steam!`, 'success');
  };

  const handleDeleteGame = async (id) => {
    try {
      await deleteGameFromLibrary(id);
      setGames((prev) => prev.filter((g) => g.id !== id));
      showToast('Game removed from library', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to remove game', 'error');
    }
  };

  const handleClearLibrary = async () => {
    try {
      await clearLibrary();
      setGames([]);
      showToast('All games cleared from database!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to clear database', 'error');
    }
  };

  const visibleGames = useMemo(() => {
    let result = [...games];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((g) => g.title?.toLowerCase().includes(q));
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(
        (g) => (g.status || '').toUpperCase() === statusFilter
      );
    }

    result.sort((a, b) => {
      const hoursA =
        a.playtimeMinutes != null ? a.playtimeMinutes / 60 : (a.hours || 0);
      const hoursB =
        b.playtimeMinutes != null ? b.playtimeMinutes / 60 : (b.hours || 0);

      switch (sortBy) {
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'hours-desc':
          return hoursB - hoursA;
        case 'hours-asc':
          return hoursA - hoursB;
        case 'id-desc':
        default:
          return (b.id || 0) - (a.id || 0);
      }
    });

    return result;
  }, [games, searchQuery, statusFilter, sortBy]);

  const isFiltered = searchQuery.trim().length > 0 || statusFilter !== 'ALL';

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-[#242424]">
      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        isConnected={isConnected}
        onRefresh={() => loadLibrary(true)}
        isRefreshing={isRefreshing}
        gamesCount={games.length}
        onOpenClearModal={() => setIsClearModalOpen(true)}
      />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-8 sm:px-8 lg:px-16">
        {/* Page Header */}
        <section>
          <h1 className="text-[28px] font-normal leading-normal text-[#242424]">
            Your library
          </h1>
          <p className="mt-1 text-[14px] text-[#717171]">
            Every game, in one place. Keep track of what you’re playing and what’s next.
          </p>
        </section>

        {/* Overview Stats */}
        <LibraryStats items={games} />

        {/* Backend Unreachable Notice */}
        {error && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-amber-300 bg-amber-50 p-4 text-[14px] text-amber-900">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>
                <strong>Backend Unreachable:</strong> {error}
              </span>
            </div>
            <button
              type="button"
              className="secondary-button h-8 px-3 text-[12px]"
              onClick={() => loadLibrary(true)}
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Filters and Sort */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          itemsCount={games.length}
        />

        {/* Main Content: Games Grid or Empty State */}
        {isLoading ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center gap-3">
            <div className="size-8 animate-spin rounded-full border-2 border-[#242424] border-t-transparent" />
            <p className="text-[14px] text-[#717171]">Loading your game library...</p>
          </div>
        ) : visibleGames.length > 0 ? (
          <section
            aria-label="Game library"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visibleGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onDelete={handleDeleteGame}
              />
            ))}
          </section>
        ) : (
          <section className="flex min-h-[272px] flex-col items-center justify-center rounded-[6px] border border-dashed border-[#a0a0a0] bg-white p-8 text-center">
            <h2 className="text-[17px] font-semibold text-[#242424]">
              {isFiltered ? 'No games found' : 'Your library is empty'}
            </h2>
            <p className="mt-2 text-[14px] text-[#717171]">
              {isFiltered
                ? 'Try another search or choose a different status filter.'
                : 'Add a game manually or import your owned games from Steam to get started.'}
            </p>
            {!isFiltered && (
              <button
                type="button"
                className="primary-button mt-4"
                onClick={() => setIsAddModalOpen(true)}
              >
                + Add Game
              </button>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className="mt-4 flex flex-col justify-between gap-2 border-t border-[#d3d3d3] pt-6 text-[12px] text-[#717171] sm:flex-row">
          <span>
            Showing {visibleGames.length === games.length ? 'all ' : ''}
            {visibleGames.length} {visibleGames.length === 1 ? 'game' : 'games'}
          </span>
          <span>GameVault &bull; Semester 3 Full-Stack &bull; Fontys ICT</span>
        </footer>
      </div>

      {/* Modals and Notifications */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddGame}
        onImportSteam={handleImportSteam}
      />

      <ClearConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearLibrary}
        gameCount={games.length}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </main>
  );
}
