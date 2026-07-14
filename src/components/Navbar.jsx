import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, MapPin, LogOut, User, PlusCircle, LayoutDashboard, Home as HomeIcon } from 'lucide-react'

const Navbar = () => {
  const { user, profile, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsOpen(false)
  }

  const activeClassName = ({ isActive }) =>
    `flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/25'
        : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`

  const activeMobileClassName = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
      isActive
        ? 'bg-[#f97316]/15 text-[#f97316] border-l-4 border-[#f97316]'
        : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`

  return (
    <nav className="sticky top-0 z-50 glass-panel shadow-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-[#f97316] flex items-center justify-center shadow-md shadow-[#f97316]/20">
                <MapPin className="w-5 h-5 text-white animate-bounce-slow" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Lost<span className="text-[#f97316]">ify</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" className={activeClassName}>
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </NavLink>

            {user && (
              <>
                <NavLink to="/dashboard" className={activeClassName}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink to="/create-report" className={activeClassName}>
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Report</span>
                </NavLink>
              </>
            )}
          </div>

          {/* Profile & Auth Section (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 border-l border-white/10 pl-4">
                <Link to="/profile" className="flex items-center space-x-2 hover:opacity-85 transition-opacity">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.username || 'User Avatar'}
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold border border-white/20">
                      {profile?.username ? profile.username[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-200">{profile?.username || 'User'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-[#f97316] hover:bg-[#f97316]/5 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-600/15"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-white/5 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" onClick={() => setIsOpen(false)} className={activeMobileClassName}>
              <HomeIcon className="w-5 h-5" />
              <span>Home</span>
            </NavLink>

            {user && (
              <>
                <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className={activeMobileClassName}>
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink to="/create-report" onClick={() => setIsOpen(false)} className={activeMobileClassName}>
                  <PlusCircle className="w-5 h-5" />
                  <span>Create Report</span>
                </NavLink>

                <NavLink to="/profile" onClick={() => setIsOpen(false)} className={activeMobileClassName}>
                  <User className="w-5 h-5" />
                  <span>Profile Settings</span>
                </NavLink>
              </>
            )}

            {user ? (
              <div className="border-t border-white/10 pt-4 pb-2 mt-4">
                <div className="flex items-center px-5 mb-4">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.username || 'User Avatar'}
                      className="w-10 h-10 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-base font-semibold border border-white/20">
                      {profile?.username ? profile.username[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{profile?.username || 'User'}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-5 py-3 text-left text-gray-400 hover:text-[#f97316] hover:bg-[#f97316]/5 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4 px-4 pb-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-gray-300 hover:text-white border border-white/10 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-600/10"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
