import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import LibraryStats from './components/LibraryStats';
import FilterBar from './components/FilterBar';
import GameCard from './components/GameCard';
import AddGameModal from './components/AddGameModal';
import ClearConfirmModal from './components/ClearConfirmModal';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import { getLibrary, addGameToLibrary, importSteamLibrary, deleteGameFromLibrary, clearLibrary } from './services/api';
import './App.css';

export default function App() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const loadLibrary = useCallback(async () => {
    try {
      setIsLoading(true);
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
            err.message || 'Unable to connect to GameVault backend. Ensure the Spring Boot server is running on port 8080.'
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
    await loadLibrary();
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

  const filteredAndSortedGames = useMemo(() => {
    let result = [...games];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((g) => g.title?.toLowerCase().includes(query));
    }

    if (statusFilter !== 'ALL') {
      result = result.filter((g) => g.status === statusFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'id-desc':
        default:
          return (b.id || 0) - (a.id || 0);
      }
    });

    return result;
  }, [games, searchQuery, statusFilter, sortBy]);

  const isFiltered = searchQuery.trim().length > 0 || statusFilter !== 'ALL';

  return (
    <div className="app-layout">
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        isConnected={isConnected}
        onRefresh={loadLibrary}
        gamesCount={games.length}
        onOpenClearModal={() => setIsClearModalOpen(true)}
      />

      <main className="main-content">
        <div className="content-container">
          <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 className="page-title">Personal Game Library</h2>
              <p className="page-subtitle">
                Track your gaming journey &bull; Spring Boot, MySQL &amp; Steam Web API
              </p>
            </div>
            {games.length > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-secondary btn-danger-hover"
                onClick={() => setIsClearModalOpen(true)}
                title="Delete all games from database"
              >
                🗑️ Clear Library ({games.length})
              </button>
            )}
          </header>

          <LibraryStats items={games} />

          {error && (
            <div className="connection-banner" role="alert">
              <div className="banner-icon">⚠️</div>
              <div className="banner-text">
                <strong>Backend Offline or Unreachable:</strong> {error}
              </div>
              <button className="btn btn-sm btn-secondary" onClick={loadLibrary}>
                Retry
              </button>
            </div>
          )}

          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            items={games}
          />

          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Loading your game library...</p>
            </div>
          ) : filteredAndSortedGames.length > 0 ? (
            <div className="games-grid">
              {filteredAndSortedGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onDelete={handleDeleteGame}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              isFiltered={isFiltered}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onResetFilter={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
            />
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <p>
            GameVault &bull; Semester 3 Full-Stack Individual Project &bull; Fontys ICT
          </p>
          <div className="footer-links">
            <span>Spring Boot REST API (Port 8080)</span>
            <span>&bull;</span>
            <span>React + Vite Client</span>
          </div>
        </div>
      </footer>

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
    </div>
  );
}
