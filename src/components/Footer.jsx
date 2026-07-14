import React from 'react'
import { MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#080b13] border-t border-white/5 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-[#f97316] flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white font-display">
              Lost<span className="text-[#f97316]">ify</span>
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 font-medium">
            Campus Lost & Found Platform. Connect, report, and recover.
          </p>

          {/* Copyright */}
          <div className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Lostify. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
