import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getReportById, deleteReport } from '../services/supabaseService'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'
import { ArrowLeft, MapPin, Calendar, Tag, Phone, User, Edit, Trash2, ShieldAlert, LogIn } from 'lucide-react'

const ReportDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadReport = async () => {
    try {
      const data = await getReportById(id)
      setReport(data)
    } catch (error) {
      console.error('Error fetching report:', error.message)
      toast.error('Could not load report details.')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadReport()
    }
  }, [id])

  const handleDelete = async () => {
    if (!report) return
    const confirmDelete = window.confirm('Are you sure you want to delete this report?')
    if (!confirmDelete) return

    try {
      await deleteReport(report.id)
      toast.success('Report deleted successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error deleting report:', error.message)
      toast.error('Failed to delete report.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <Loading message="Loading item details..." />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#0b0f19] text-gray-400">
        <ShieldAlert className="w-16 h-16 text-[#f97316] mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Report Not Found</h2>
        <p className="text-sm mb-6">This listing may have been removed or does not exist.</p>
        <Link to="/" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold">
          Return Home
        </Link>
      </div>
    )
  }

  const { title, description, category, status, location, contact, image_url, created_at, profiles } = report
  const isOwner = user && report.user_id === user.id

  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Browse</span>
          </Link>
          
          {/* Owner Quick Actions */}
          {isOwner && (
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Link
                to={`/edit-report/${report.id}`}
                className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2 bg-blue-600/15 text-blue-400 hover:bg-blue-600/35 border border-blue-500/20 hover:border-blue-500/40 rounded-xl text-sm font-semibold transition-all"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Post</span>
              </Link>
              <button
                onClick={handleDelete}
                className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2 bg-rose-500/15 text-rose-400 hover:bg-rose-500/35 border border-rose-500/20 hover:border-rose-500/40 rounded-xl text-sm font-semibold transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Post</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Details Panel */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Image Column */}
            <div className="bg-slate-950 flex items-center justify-center relative min-h-[300px] md:min-h-full">
              <div className="absolute top-4 left-4 z-10">
                <span
                  className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider shadow-md ${
                    status === 'Lost'
                      ? 'bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {status}
                </span>
              </div>
              
              {image_url ? (
                <img
                  src={image_url}
                  alt={title}
                  className="w-full h-full object-cover max-h-[500px]"
                />
              ) : (
                <div className="text-gray-500 text-sm">No Image Provided</div>
              )}
            </div>

            {/* Details Column */}
            <div className="p-8 flex flex-col justify-between">
              
              <div className="space-y-6">
                
                {/* Meta details */}
                <div className="flex flex-wrap gap-3 items-center text-xs text-gray-400">
                  <span className="flex items-center space-x-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg">
                    <Tag className="w-3.5 h-3.5 text-blue-400" />
                    <span>{category}</span>
                  </span>
                  <span className="flex items-center space-x-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-[#f97316]" />
                    <span>{formattedDate}</span>
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    {title}
                  </h1>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {description}
                  </p>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Campus Location</h3>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4 text-[#f97316] mt-0.5 flex-shrink-0" />
                    <span>{location}</span>
                  </div>
                </div>

              </div>

              {/* Uploader & Contact Segment */}
              <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                
                {/* Profile row */}
                <div className="flex items-center space-x-3">
                  {profiles?.avatar_url ? (
                    <img
                      src={profiles.avatar_url}
                      alt={profiles.username || 'User'}
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      {profiles?.username ? profiles.username[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Reported by</p>
                    <p className="text-sm font-semibold text-white">{profiles?.username || 'Anonymous'}</p>
                  </div>
                </div>

                {/* Contact box */}
                <div className="bg-slate-950/60 rounded-2xl border border-white/5 p-4">
                  {user ? (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <Phone className="w-3.5 h-3.5 text-blue-400" />
                        <span>Direct Contact</span>
                      </p>
                      <p className="text-lg font-bold text-white tracking-wide select-all">
                        {contact}
                      </p>
                    </div>
                  ) : (
                    /* Blurred guest state */
                    <div className="relative overflow-hidden py-2 px-1 text-center">
                      <div className="filter blur-sm select-none opacity-40">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Direct Contact</p>
                        <p className="text-lg font-bold text-white tracking-wide">+1 (555) 012-3456</p>
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent space-y-2">
                        <p className="text-xs font-semibold text-gray-300">Sign in to view phone number</p>
                        <Link
                          to="/login"
                          state={{ from: `/report/${report.id}` }}
                          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-md shadow-blue-600/10"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Login</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default ReportDetail
