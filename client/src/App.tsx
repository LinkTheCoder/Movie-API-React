import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { createMovie, deleteMovie, getMovies, updateMovie } from './api'
import Layout from './Layout'
import Login from './Login'
import MovieDetail from './MovieDetail'
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
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <>
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
            </>
          }
        />
        <Route path="movies/:id" element={<MovieDetail />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  )
}

export default App
