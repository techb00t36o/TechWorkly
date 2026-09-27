import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import NotificationBell from './NotificationBell.jsx'

export default function Header() {
  const { user, role, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  // Safely extract up to 2 initials; null if user has no name
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : null

  // Route to the correct dashboard based on user role
  const dashboardPath =
    role === 'company' ? '/dashboard/company' : role === 'admin' ? '/dashboard/admin' : '/dashboard/worker'

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-300 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
              TW
            </span>
            <span className="text-lg font-semibold text-neutral-900">TechWorkly</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-neutral-500 md:flex">
            <Link to="/browse-companies" className="hover:text-neutral-900">Browse Companies</Link>
            <Link to="/browse-jobs" className="hover:text-neutral-900">Browse Jobs</Link>
            <Link to="/browse-gigs" className="hover:text-neutral-900">Browse Gigs</Link>
            <Link to="/browse-workers" className="hover:text-neutral-900">Browse Workers</Link>
            <Link to="/#how-it-works" className="hover:text-neutral-900">How It Works</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NotificationBell />
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                    {initials || 'U'}
                  </div>
                  <span className="hidden md:inline">{user.name}</span>
                  <svg className="h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {menuOpen && (
                  <>
                    {/* Invisible backdrop catches clicks outside the menu to close it */}
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-neutral-300 bg-white py-2 shadow-lg">
                      <Link
                        to={dashboardPath}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/messages"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        Messages
                      </Link>
                      <Link
                        to="/account"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        Profile
                      </Link>
                    <Link
                      to="/account/settings"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      Settings
                    </Link>
                    <hr className="my-1 border-neutral-200" />
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        logout()
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      Log Out
                    </button>
                  </div>
                </>
              )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                Log In
              </Link>
              <Link
                to="/role-selection"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
