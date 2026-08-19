import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { createReview, getMovieDetails } from './api'
import type { MovieDetail as MovieDetailType, ReviewInput } from './types'

const emptyReview: ReviewInput = {
  reviewerName: '',
  comment: '',
  rating: 5,
}

function MovieDetail() {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<MovieDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<ReviewInput>(emptyReview)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    getMovieDetails(Number(id))
      .then(setMovie)
      .catch((err) => setError(err instanceof Error ? err.message : 'Kunde inte hämta filmen'))
      .finally(() => setLoading(false))
  }, [id])

  function handleChange(field: keyof ReviewInput, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'rating' ? Number(value) : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    setFormError(null)
    setSubmitting(true)
    try {
      const review = await createReview(Number(id), form)
      setMovie((prev) => (prev ? { ...prev, reviews: [...prev.reviews, review] } : prev))
      setForm(emptyReview)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Kunde inte skicka recensionen')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="mt-6 text-gray-400">Laddar film...</p>
  }

  if (error || !movie) {
    return (
      <div>
        <p className="mt-4 text-sm text-red-600">{error ?? 'Filmen hittades inte'}</p>
        <Link to="/" className="mt-4 inline-block text-sm text-gray-300 underline">
          Tillbaka till startsidan
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/" className="text-sm text-gray-300 underline">
        Tillbaka till startsidan
      </Link>

      <div>
        <h2 className="text-2xl font-semibold text-gray-100">{movie.title}</h2>
        <p className="text-sm text-gray-400">
          {movie.year} · {movie.genre} · {movie.duration} min
        </p>
      </div>

      {movie.details && (
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-5">
          <h3 className="mb-2 text-lg font-medium text-gray-100">Om filmen</h3>
          <p className="mb-2 text-sm text-gray-300">{movie.details.synopsis}</p>
          <p className="text-sm text-gray-400">Språk: {movie.details.language}</p>
          <p className="text-sm text-gray-400">Budget: {movie.details.budget.toLocaleString()}</p>
        </div>
      )}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5">
        <h3 className="mb-2 text-lg font-medium text-gray-100">Skådespelare</h3>
        {movie.actors.length === 0 ? (
          <p className="text-sm text-gray-400">Inga skådespelare registrerade.</p>
        ) : (
          <ul className="flex flex-col gap-1 text-sm text-gray-300">
            {movie.actors.map((actor) => (
              <li key={actor.id}>
                {actor.name} ({actor.birthYear})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5">
        <h3 className="mb-2 text-lg font-medium text-gray-100">Recensioner</h3>
        {movie.reviews.length === 0 ? (
          <p className="text-sm text-gray-400">Inga recensioner än.</p>
        ) : (
          <ul className="flex flex-col gap-3 text-sm text-gray-300">
            {movie.reviews.map((review) => (
              <li key={review.id} className="border-b border-gray-700 pb-2">
                <p className="font-medium text-gray-100">
                  {review.reviewerName} · {review.rating}/5
                </p>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form
        className="flex flex-col gap-3 rounded-lg border border-gray-700 bg-gray-800 p-5"
        onSubmit={handleSubmit}
      >
        <h3 className="text-lg font-medium text-gray-100">Skriv en recension</h3>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Namn
          <input
            type="text"
            className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:border-white focus:outline-none"
            value={form.reviewerName}
            onChange={(e) => handleChange('reviewerName', e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Betyg (1-5)
          <input
            type="number"
            className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:border-white focus:outline-none"
            value={form.rating}
            onChange={(e) => handleChange('rating', e.target.value)}
            min={1}
            max={5}
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Kommentar
          <textarea
            className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:border-white focus:outline-none"
            value={form.comment}
            onChange={(e) => handleChange('comment', e.target.value)}
            required
          />
        </label>

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="self-start rounded border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
        >
          {submitting ? 'Skickar...' : 'Skicka recension'}
        </button>
      </form>
    </div>
  )
}

export default MovieDetail
