import type { Genre, Movie, MovieDetail, MovieInput, Review, ReviewInput } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5205/api/v1/movies'
const GENRES_API_URL = import.meta.env.VITE_GENRES_API_URL ?? 'http://localhost:5205/api/v1/genres'
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL ?? 'http://localhost:5205/api/v1/auth'

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function getMovies(): Promise<Movie[]> {
  return fetch(API_URL).then((res) => handleResponse<Movie[]>(res))
}

export function getGenres(): Promise<Genre[]> {
  return fetch(GENRES_API_URL).then((res) => handleResponse<Genre[]>(res))
}

export function createMovie(movie: MovieInput): Promise<Movie> {
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(movie),
  }).then((res) => handleResponse<Movie>(res))
}

export function updateMovie(id: number, movie: MovieInput): Promise<void> {
  return fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(movie),
  }).then((res) => handleResponse<void>(res))
}

export function deleteMovie(id: number): Promise<void> {
  return fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  }).then((res) => handleResponse<void>(res))
}

export function getMovieDetails(id: number): Promise<MovieDetail> {
  return fetch(`${API_URL}/${id}/details`).then((res) => handleResponse<MovieDetail>(res))
}

export function createReview(movieId: number, review: ReviewInput): Promise<Review> {
  return fetch(`${API_URL}/${movieId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(review),
  }).then((res) => handleResponse<Review>(res))
}

export function login(username: string, password: string): Promise<{ token: string }> {
  return fetch(`${AUTH_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then((res) => handleResponse<{ token: string }>(res))
}
