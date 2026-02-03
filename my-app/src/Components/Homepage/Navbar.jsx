import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, user, role, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="w-full border-b shadow-sm bg-blue-950 border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center">
              <img src="/assets/logo.svg" alt="EduFeed Logo" className="h-10 sm:h-12 md:h-14 w-auto" />
            </Link>
            <Link to="/Aboutpage" className="text-white transition hover:text-gray-300 text-sm sm:text-base md:text-xl">
              About
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="text-white text-sm sm:text-base">
                  Welcome, {user} ({role})
                </span>
                <Link
                  to={role === 'Teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                  className="rounded-md bg-blue-600 px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base md:text-lg font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="rounded-md bg-red-600 px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base md:text-lg font-medium text-white hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md bg-gray-100 px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base md:text-lg font-medium text-black shadow-sm hover:bg-gray-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-gray-100 px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base md:text-lg font-medium text-black hover:bg-gray-200 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="sm:hidden rounded-md bg-gray-100 p-2 text-gray-700 transition hover:text-gray-600"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden pb-4">
            <div className="flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <span className="text-white text-sm">
                    Welcome, {user} ({role})
                  </span>
                  <Link
                    to={role === 'Teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                    onClick={closeMenu}
                    className="w-full text-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      closeMenu();
                      onLogout();
                    }}
                    className="w-full text-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="w-full text-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-gray-200 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="w-full text-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-black hover:bg-gray-200 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
