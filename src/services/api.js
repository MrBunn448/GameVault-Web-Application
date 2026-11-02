import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/library';

function handleError(error) {
  const data = error.response?.data;
  const message = data?.message || data?.error || (typeof data === 'string' ? data : error.message);
  throw new Error(message || 'Request failed');
}

// Fetch all games in the library (US-10)
export async function getLibrary() {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Manually add a game to the library (US-09)
export async function addGameToLibrary(gameData) {
  try {
    const response = await axios.post(BASE_URL, gameData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Import owned games from Steam Web API (US-09 / US-08)
export async function importSteamLibrary(steamId) {
  try {
    const response = await axios.post(`${BASE_URL}/steam/import`, { steamId }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Delete single game by id (US-11)
export async function deleteGameFromLibrary(id) {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return true;
  } catch (error) {
    handleError(error);
  }
}

// Clear all games from database (Temporary utility / full reset)
export async function clearLibrary() {
  try {
    await axios.delete(BASE_URL);
    return true;
  } catch (error) {
    handleError(error);
  }
}
