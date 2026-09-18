/**
 * GameVault REST API Service
 * Handles client-server communication with the Spring Boot GameVaultAPI backend.
 * Endpoints implement US-10 (View Library), US-09 (Add Game), and US-11 (Remove Game).
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api/library';

/**
 * Helper to handle HTTP response and parse structured JSON or error messages.
 */
async function handleResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    if (data) {
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.error) {
        errorMessage = data.error;
      } else if (data.errors && Array.isArray(data.errors)) {
        errorMessage = data.errors.map(e => e.defaultMessage || e).join(', ');
      }
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * US-10: Retrieve all games tracked in personal library.
 * @returns {Promise<Array>} List of LibraryItemResponse DTOs
 */
export async function getLibrary() {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
}

/**
 * Retrieve single game from library by ID.
 * @param {number|string} id 
 * @returns {Promise<Object>} LibraryItemResponse DTO
 */
export async function getGameById(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
}

/**
 * US-09: Add a new game to the personal library with status tracking.
 * @param {Object} gameData { title, status, personalRating, playtimeHours, startDate, completedDate }
 * @returns {Promise<Object>} Created LibraryItemResponse DTO
 */
export async function addGameToLibrary(gameData) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(gameData),
  });
  return handleResponse(response);
}

/**
 * US-11: Remove a game from the personal library.
 * @param {number|string} id 
 * @returns {Promise<void>}
 */
export async function deleteGameFromLibrary(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}
