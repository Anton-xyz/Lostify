import React from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-[#0b0f19] text-gray-100">
      
      {/* 404 Graphic */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-[#f97316]/10 border border-[#f97316]/20 rounded-3xl flex items-center justify-center mx-auto text-[#f97316] animate-pulse">
          <HelpCircle className="w-12 h-12" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-black opacity-5 select-none font-display pointer-events-none">
          404
        </div>
      </div>

      {/* Message */}
      <h1 className="text-3xl font-bold tracking-tight text-white mb-2 font-display">
        Page Not Found
      </h1>
      <p className="text-sm text-gray-400 max-w-sm mb-8">
        The page you are looking for doesn't exist, was deleted, or moved to another location.
      </p>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-slate-900 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-sm font-semibold rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
        <Link
          to="/"
          className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/10"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </Link>
      </div>
      
    </div>
  )
}

export default NotFound
