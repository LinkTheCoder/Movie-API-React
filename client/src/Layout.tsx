import { Link, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

function Layout() {
  const { isAuthenticated, username, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 text-left">
      <nav className="mb-6 flex items-center justify-between gap-6">
        <Link to="/" className="text-3xl font-bold text-gray-100">
          Movie API
        </Link>

        <div className="flex items-center gap-4 text-sm text-gray-300">
          {isAuthenticated ? (
            <>
              <span>Inloggad som {username}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded bg-gray-700 px-3 py-1.5 font-medium text-white hover:bg-gray-600"
              >
                Logga ut
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded bg-blue-600 px-3 py-1.5 font-medium text-white hover:bg-blue-700"
            >
              Logga in
            </Link>
          )}
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
