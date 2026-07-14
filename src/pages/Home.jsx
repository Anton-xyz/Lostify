import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getReports } from '../services/supabaseService'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import ReportCard from '../components/ReportCard'
import Loading from '../components/Loading'
import { AlertCircle, PlusCircle, Search, Info, Award, ShieldCheck } from 'lucide-react'

const Home = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // Fetch reports on mount
  const fetchAllReports = async () => {
    setLoading(true)
    try {
      const data = await getReports()
      setReports(data || [])
    } catch (error) {
      console.error('Error fetching reports:', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllReports()
  }, [])

  // Calculate statistics from the complete list of reports
  const stats = useMemo(() => {
    const total = reports.length
    const lost = reports.filter((r) => r.status === 'Lost').length
    const found = reports.filter((r) => r.status === 'Found').length
    return { total, lost, found }
  }, [reports])

  // Filter and search logic on the client side for instant reactivity
  const filteredReports = useMemo(() => {
    let result = [...reports]

    // 1. Search by title
    if (query.trim()) {
      result = result.filter((r) =>
        r.title.toLowerCase().includes(query.trim().toLowerCase())
      )
    }

    // 2. Filter by status
    if (status) {
      result = result.filter((r) => r.status === status)
    }

    // 3. Filter by category
    if (category) {
      result = result.filter((r) => r.category === category)
    }

    // 4. Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    }

    return result
  }, [reports, query, status, category, sortBy])

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#f97316]/10 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 inline-block">
            Campus Lost & Found Hub
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-display mb-6">
            Recover Your Items, <br />
            <span className="text-gradient">Reconnect Your Campus</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 mb-8 font-medium">
            Lostify helps students and faculty easily report lost items, list found objects, and coordinate returns. Join our campus network to keep our community connected.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/create-report"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-blue-600/25"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Report an Item</span>
            </Link>
            <a
              href="#reports-section"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 border border-white/10 hover:border-white/20 text-gray-200 hover:text-white font-semibold rounded-2xl transition-colors"
            >
              Browse Lost & Found
            </a>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Total Reports */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center space-x-4 shadow-md">
            <div className="p-3.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/10">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Reports</p>
              <h3 className="text-3xl font-bold text-white mt-1">{loading ? '...' : stats.total}</h3>
            </div>
          </div>

          {/* Lost Reports */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center space-x-4 shadow-md">
            <div className="p-3.5 rounded-xl bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/10">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Lost Items</p>
              <h3 className="text-3xl font-bold text-[#f97316] mt-1">{loading ? '...' : stats.lost}</h3>
            </div>
          </div>

          {/* Found Reports */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center space-x-4 shadow-md">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Found Items</p>
              <h3 className="text-3xl font-bold text-emerald-400 mt-1">{loading ? '...' : stats.found}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Main Browse Section */}
      <section id="reports-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Recent Campus Reports</h2>
              <p className="text-sm text-gray-400 mt-1">Browse and search matching reports on campus.</p>
            </div>
            <SearchBar query={query} setQuery={setQuery} />
          </div>

          <FilterBar
            category={category}
            setCategory={setCategory}
            status={status}
            setStatus={setStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {loading ? (
            <div className="py-20">
              <Loading message="Loading campus reports..." />
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="glass-panel rounded-3xl p-12 text-center border border-white/5 max-w-lg mx-auto w-full my-8">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-5 text-[#f97316]">
                <Info className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Reports Found</h3>
              <p className="text-sm text-gray-400 mb-6">
                We couldn't find any reports matching your search filters. Try clearing some criteria or create a new post.
              </p>
              <Link
                to="/create-report"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Report</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
