import { useEffect, useState } from 'react'
import type { Movie, MovieInput } from './types'

const emptyForm: MovieInput = {
  title: '',
  year: new Date().getFullYear(),
  duration: 90,
  genreId: 1,
}

interface MovieFormProps {
  editingMovie: Movie | null
  onSubmit: (movie: MovieInput) => Promise<void>
  onCancelEdit: () => void
}

function MovieForm({ editingMovie, onSubmit, onCancelEdit }: MovieFormProps) {
  const [form, setForm] = useState<MovieInput>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (editingMovie) {
      setForm({
        title: editingMovie.title,
        year: editingMovie.year,
        duration: editingMovie.duration,
        genreId: 1,
      })
    } else {
      setForm(emptyForm)
    }
  }, [editingMovie])

  function handleChange(field: keyof MovieInput, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'title' ? value : Number(value),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSubmit(form)
      if (!editingMovie) {
        setForm(emptyForm)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      className="mb-8 flex flex-col gap-3 rounded-lg border border-gray-700 bg-gray-800 p-5"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-medium text-gray-100">
        {editingMovie ? 'Redigera film' : 'Lägg till film'}
      </h2>

      <label className="flex flex-col gap-1 text-sm text-gray-300">
        Titel
        <input
          type="text"
          className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:border-purple-500 focus:outline-none"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-300">
        År
        <input
          type="number"
          className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:border-purple-500 focus:outline-none"
          value={form.year}
          onChange={(e) => handleChange('year', e.target.value)}
          min={1888}
          max={2100}
          required
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-300">
        Speltid (min)
        <input
          type="number"
          className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:border-purple-500 focus:outline-none"
          value={form.duration}
          onChange={(e) => handleChange('duration', e.target.value)}
          min={1}
          max={600}
          required
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-300">
        GenreId
        <input
          type="number"
          className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:border-purple-500 focus:outline-none"
          value={form.genreId}
          onChange={(e) => handleChange('genreId', e.target.value)}
          min={1}
          required
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {editingMovie ? 'Spara' : 'Lägg till'}
        </button>
        {editingMovie && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={submitting}
            className="rounded border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
          >
            Avbryt
          </button>
        )}
      </div>
    </form>
  )
}

export default MovieForm
