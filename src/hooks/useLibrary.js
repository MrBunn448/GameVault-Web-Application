import { useState, useEffect, useCallback } from 'react';
import {
  getLibrary,
  addGameToLibrary,
  importSteamLibrary,
  deleteGameFromLibrary,
  clearLibrary,
} from '../services/api';

/**
 * Custom React hook managing GameVault library state, API interactions,
 * and user notifications.
 */
export function useLibrary() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
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
        err.message ||
          'Unable to connect to GameVault backend. Ensure the Spring Boot server is running on port 8080.'
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

  const addGame = async (gameData) => {
    const created = await addGameToLibrary(gameData);
    setGames((prev) => [created, ...prev]);
    setIsConnected(true);
    showToast(`Added "${created.title}" to your library!`, 'success');
  };

  const importSteam = async (steamId) => {
    const imported = await importSteamLibrary(steamId);
    await loadLibrary(false);
    const count = Array.isArray(imported) ? imported.length : 0;
    showToast(`Synced ${count} game${count === 1 ? '' : 's'} from Steam!`, 'success');
  };

  const deleteGame = async (id) => {
    try {
      await deleteGameFromLibrary(id);
      setGames((prev) => prev.filter((g) => g.id !== id));
      showToast('Game removed from library', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to remove game', 'error');
    }
  };

  const clearGames = async () => {
    try {
      await clearLibrary();
      setGames([]);
      showToast('All games cleared from database!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to clear database', 'error');
    }
  };

  return {
    games,
    isLoading,
    isRefreshing,
    error,
    isConnected,
    toast,
    showToast,
    clearToast,
    loadLibrary,
    addGame,
    importSteam,
    deleteGame,
    clearGames,
  };
}
