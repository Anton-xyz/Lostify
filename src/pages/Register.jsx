import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MapPin, Loader2 } from 'lucide-react'

const Register = () => {
  const { signInWithGoogle, loading } = useAuth()

  const handleGoogleRegister = async () => {
    await signInWithGoogle()
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#0b0f19]">
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#f97316]/10 blur-[80px] pointer-events-none" />

      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-[#f97316] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-display">
              Lost<span className="text-[#f97316]">ify</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white tracking-tight">Create an Account</h2>
          <p className="text-sm text-gray-400 mt-1">Sign up with Google to report or claim campus items.</p>
        </div>

        {/* Google OAuth Action */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 py-3 bg-white text-gray-900 hover:bg-gray-100 disabled:bg-gray-250 font-semibold rounded-xl transition-all shadow-md shadow-white/5 cursor-pointer disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-900" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span>Sign Up with Google</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 pt-6 border-t border-white/5 text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#f97316] hover:text-[#f97316]/90 font-medium hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
