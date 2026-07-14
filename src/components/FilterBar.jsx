import React from 'react'
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react'

export const CATEGORIES = [
  'Electronics',
  'Documents & Cards',
  'Keys',
  'Books & Stationery',
  'Clothing & Accessories',
  'Bottles & Containers',
  'Other',
]

const FilterBar = ({ category, setCategory, status, setStatus, sortBy, setSortBy }) => {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/5 shadow-md flex flex-col md:flex-row gap-4 items-center justify-between w-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider space-x-1.5 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#f97316] focus:border-[#f97316] transition-all cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#f97316] focus:border-[#f97316] transition-all cursor-pointer"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Sorting */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t border-white/5 md:border-none pt-3 md:pt-0">
        <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider space-x-1.5 mr-1">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Sort By:</span>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#f97316] focus:border-[#f97316] transition-all cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  )
}

export default FilterBar
