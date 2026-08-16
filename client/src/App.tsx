import { useEffect, useState } from 'react'
import { createMovie, deleteMovie, getMovies, updateMovie } from './api'
import MovieForm from './MovieForm'
import MovieList from './MovieList'
import type { Movie, MovieInput } from './types'

function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMovies(true)
  }, [])

  async function loadMovies(showLoading = false) {
    if (showLoading) setLoading(true)
    setError(null)
    try {
      const data = await getMovies()
      setMovies(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte hämta filmer')
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  async function handleCreateOrUpdate(input: MovieInput) {
    if (editingMovie) {
      await updateMovie(editingMovie.id, input)
      setEditingMovie(null)
    } else {
      await createMovie(input)
    }
    await loadMovies()
  }

  async function handleDelete(id: number) {
    try {
      await deleteMovie(id)
      setMovies((prev) => prev.filter((movie) => movie.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ta bort filmen')
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-8 text-left">
      <h1 className="mb-6 text-3xl font-semibold text-gray-100">Movie API</h1>

      <MovieForm
        editingMovie={editingMovie}
        onSubmit={handleCreateOrUpdate}
        onCancelEdit={() => setEditingMovie(null)}
      />

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-6 text-gray-400">Laddar filmer...</p>
      ) : (
        <MovieList movies={movies} onEdit={setEditingMovie} onDelete={handleDelete} />
      )}
    </main>
  )
}

export default App
