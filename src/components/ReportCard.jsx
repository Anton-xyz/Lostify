import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, Tag, Edit, Trash2 } from 'lucide-react'

const ReportCard = ({ report, isOwner = false, onDelete = null }) => {
  const { id, title, description, category, status, location, created_at, image_url, profiles } = report

  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="group glass-panel rounded-2xl overflow-hidden hover:border-[#f97316]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#f97316]/5 hover:-translate-y-1 flex flex-col h-full relative">
      {/* Status Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider shadow-md ${
            status === 'Lost'
              ? 'bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/30'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}
        >
          {status}
        </span>
      </div>

      {/* Image Preview */}
      <div className="h-48 w-full overflow-hidden bg-slate-900 relative">
        {image_url ? (
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 bg-slate-900">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category & Date */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="flex items-center space-x-1">
            <Tag className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium">{category}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow">
          {description}
        </p>

        {/* Location */}
        <div className="flex items-center text-xs text-gray-400 mb-4 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
          <MapPin className="w-3.5 h-3.5 text-[#f97316] mr-1.5 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        {/* Reporter profile or actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          {isOwner ? (
            <div className="flex items-center space-x-2 w-full justify-end">
              <Link
                to={`/edit-report/${id}`}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600/25 border border-blue-500/20 hover:border-blue-500/40 rounded-lg text-xs font-semibold transition-all"
                title="Edit Report"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
              {onDelete && (
                <button
                  onClick={() => onDelete(id)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/25 border border-rose-500/20 hover:border-rose-500/40 rounded-lg text-xs font-semibold transition-all"
                  title="Delete Report"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Reporter Info */}
              <div className="flex items-center space-x-2">
                {profiles?.avatar_url ? (
                  <img
                    src={profiles.avatar_url}
                    alt={profiles.username || 'User'}
                    className="w-6 h-6 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {profiles?.username ? profiles.username[0].toUpperCase() : 'U'}
                  </div>
                )}
                <span className="text-xs text-gray-300 truncate max-w-[100px]" title={profiles?.username || 'User'}>
                  {profiles?.username || 'Anonymous'}
                </span>
              </div>

              {/* View Details Link */}
              <Link
                to={`/report/${id}`}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center"
              >
                View Details &rarr;
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportCard
