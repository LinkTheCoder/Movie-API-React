import { Link } from 'react-router-dom'
import type { Movie } from './types'

interface MovieListProps {
  movies: Movie[]
  onEdit: (movie: Movie) => void
  onDelete: (id: number) => void
}

function MovieList({ movies, onEdit, onDelete }: MovieListProps) {
  if (movies.length === 0) {
    return <p className="text-gray-400">Inga filmer hittades.</p>
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className="border-b border-gray-700 p-2.5 text-left font-medium text-gray-300">Titel</th>
          <th className="border-b border-gray-700 p-2.5 text-left font-medium text-gray-300">År</th>
          <th className="border-b border-gray-700 p-2.5 text-left font-medium text-gray-300">Genre</th>
          <th className="border-b border-gray-700 p-2.5 text-left font-medium text-gray-300">Speltid</th>
          <th className="border-b border-gray-700 p-2.5"></th>
        </tr>
      </thead>
      <tbody>
        {movies.map((movie) => (
          <tr key={movie.id}>
            <td className="border-b border-gray-800 p-2.5 text-gray-100">
              <Link to={`/movies/${movie.id}`} className="text-gray-100 underline hover:text-white">
                {movie.title}
              </Link>
            </td>
            <td className="border-b border-gray-800 p-2.5 text-gray-100">{movie.year}</td>
            <td className="border-b border-gray-800 p-2.5 text-gray-100">{movie.genre}</td>
            <td className="border-b border-gray-800 p-2.5 text-gray-100">{movie.duration} min</td>
            <td className="border-b border-gray-800 p-2.5">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(movie)}
                  className="rounded border border-gray-600 px-3 py-1 text-xs font-medium text-gray-300 hover:bg-gray-700"
                >
                  Redigera
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(movie.id)}
                  className="rounded border border-red-500 px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-950"
                >
                  Ta bort
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default MovieList
