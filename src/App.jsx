import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import LibraryStats from './components/LibraryStats';
import FilterBar from './components/FilterBar';
import LibraryGrid from './components/LibraryGrid';
import Footer from './components/Footer';
import AddGameModal from './components/AddGameModal';
import ClearConfirmModal from './components/ClearConfirmModal';
import Toast from './components/Toast';
import { useLibrary } from './hooks/useLibrary';

export default function App() {
  const {
    games,
    isLoading,
    isRefreshing,
    error,
    isConnected,
    toast,
    clearToast,
    loadLibrary,
    addGame,
    importSteam,
    deleteGame,
    clearGames,
  } = useLibrary();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('id-desc');

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
      {/* Top Navigation */}
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
          <h1 data-cy="library-heading" className="text-[28px] font-normal leading-normal text-[#242424]">
            Your library
          </h1>
          <p className="mt-1 text-[14px] text-[#717171]">
            Every game, in one place. Keep track of what you’re playing and what’s next.
          </p>
        </section>

        {/* Overview Stats */}
        <LibraryStats items={games} />

        {/* Backend Unreachable Alert */}
        {error && (
          <div data-cy="backend-offline-alert" className="flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-amber-300 bg-amber-50 p-4 text-[14px] text-amber-900">
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

        {/* Filter & Sort Controls */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          itemsCount={games.length}
        />

        {/* Games Grid & Empty State */}
        <LibraryGrid
          isLoading={isLoading}
          visibleGames={visibleGames}
          isFiltered={isFiltered}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onDeleteGame={deleteGame}
        />

        {/* Page Footer */}
        <Footer
          totalCount={games.length}
          visibleCount={visibleGames.length}
        />
      </div>

      {/* Modals and Notifications */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addGame}
        onImportSteam={importSteam}
      />

      <ClearConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={clearGames}
        gameCount={games.length}
      />

      <Toast toast={toast} onClose={clearToast} />
    </main>
  );
}
