import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte logga in')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-sm flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-100">Logga in</h2>

      <label className="flex flex-col gap-1 text-sm text-gray-300">
        Användarnamn
        <input
          className="rounded border border-gray-600 bg-gray-800 px-3 py-2 text-gray-100"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-300">
        Lösenord
        <input
          type="password"
          className="rounded border border-gray-600 bg-gray-800 px-3 py-2 text-gray-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'Loggar in...' : 'Logga in'}
      </button>
    </form>
  )
}

export default Login
