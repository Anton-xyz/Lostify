import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserReports, deleteReport } from '../services/supabaseService'
import ReportCard from '../components/ReportCard'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'
import { PlusCircle, User, AlertCircle, ShieldCheck, ClipboardList, Info } from 'lucide-react'

const Dashboard = () => {
  const { user, profile } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUserReports = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await getUserReports(user.id)
      setReports(data || [])
    } catch (error) {
      console.error('Error fetching user reports:', error.message)
      toast.error('Failed to load your reports.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserReports()
  }, [user])

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this report?')
    if (!confirmDelete) return

    const deletePromise = deleteReport(id)
    
    toast.promise(deletePromise, {
      loading: 'Deleting report...',
      success: 'Report deleted successfully!',
      error: 'Failed to delete report. Please try again.',
    })

    try {
      await deletePromise
      // Remove from state
      setReports((prev) => prev.filter((r) => r.id !== id))
    } catch (error) {
      console.error('Error deleting report:', error.message)
    }
  }

  // Calculate stats
  const stats = useMemo(() => {
    const total = reports.length
    const lost = reports.filter((r) => r.status === 'Lost').length
    const found = reports.filter((r) => r.status === 'Found').length
    return { total, lost, found }
  }, [reports])

  if (loading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <Loading message="Loading dashboard data..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white font-display">
              Hello, <span className="text-[#f97316]">{profile?.username || 'User'}</span>
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Manage your lost and found campus reports and view performance metrics.
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Link
              to="/create-report"
              className="flex-1 md:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#f97316] hover:bg-[#f97316]/90 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-[#f97316]/10"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Report</span>
            </Link>
            <Link
              to="/profile"
              className="flex-1 md:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-900 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Total Reports */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center space-x-4">
            <div className="p-3.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/10">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">My Total Reports</p>
              <h3 className="text-2xl font-bold text-white mt-0.5">{stats.total}</h3>
            </div>
          </div>

          {/* Lost Reports */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center space-x-4">
            <div className="p-3.5 rounded-xl bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/10">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">My Lost Items</p>
              <h3 className="text-2xl font-bold text-[#f97316] mt-0.5">{stats.lost}</h3>
            </div>
          </div>

          {/* Found Reports */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center space-x-4">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">My Found Items</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-0.5">{stats.found}</h3>
            </div>
          </div>
        </div>

        {/* My Reports Listing */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">My Active Listings</h2>
            <p className="text-xs text-gray-400 mt-0.5">Edit, update, or remove your campus reports.</p>
          </div>

          {reports.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  isOwner={true}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="glass-panel rounded-3xl p-12 text-center border border-white/5 max-w-lg mx-auto w-full">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-5 text-[#f97316]">
                <Info className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Reports Listed</h3>
              <p className="text-sm text-gray-400 mb-6">
                You haven't posted any lost or found items yet. Create one now to notify the campus!
              </p>
              <Link
                to="/create-report"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create First Report</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Dashboard
