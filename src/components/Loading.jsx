import React from 'react'
import { Loader2 } from 'lucide-react'

const Loading = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.medium} text-[#f97316] animate-spin`} />
      {message && <p className="text-gray-400 text-sm font-medium animate-pulse">{message}</p>}
    </div>
  )
}

export default Loading
