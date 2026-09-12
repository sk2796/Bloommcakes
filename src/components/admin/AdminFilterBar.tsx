import React from 'react'
import { Search, X, Filter, Calendar, ArrowUpDown, RotateCcw } from 'lucide-react'

export interface FilterOption {
  label: string
  value: string
}

export interface DropdownFilter {
  id: string
  label: string
  value: string
  options: FilterOption[]
  onChange: (val: string) => void
}

export interface SortOption {
  label: string
  value: string
}

export interface AdminFilterBarProps {
  // Search
  search: string
  onSearchChange: (val: string) => void
  searchPlaceholder?: string

  // Categorical dropdown filters
  dropdownFilters?: DropdownFilter[]

  // Date range preset (optional)
  dateRange?: string
  onDateRangeChange?: (range: string) => void
  dateRangeOptions?: FilterOption[]

  // Sorting (optional)
  sortBy?: string
  onSortChange?: (val: string) => void
  sortOptions?: SortOption[]

  // Counter
  totalCount: number
  filteredCount: number

  // Reset
  onResetAll?: () => void
  hasActiveFilters?: boolean
}

export const AdminFilterBar: React.FC<AdminFilterBarProps> = ({
  search,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  dropdownFilters = [],
  dateRange,
  onDateRangeChange,
  dateRangeOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
  ],
  sortBy,
  onSortChange,
  sortOptions = [],
  totalCount,
  filteredCount,
  onResetAll,
  hasActiveFilters
}) => {
  const isFiltered = hasActiveFilters !== undefined 
    ? hasActiveFilters 
    : (search.trim() !== '' || (dateRange && dateRange !== 'all') || dropdownFilters.some(d => d.value !== 'all'))

  return (
    <div className="bg-white rounded-2xl border border-[#ebd8d0] shadow-sm p-4 space-y-3.5 transition-all">
      {/* Top Controls Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 justify-between">
        {/* Search Input Box */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#916b61]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2 text-sm rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] bg-[#fdfaf8] text-[#2d1b18] placeholder:text-[#916b61]/60 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#916b61] hover:text-[#2d0e17] p-0.5 rounded-full hover:bg-[#faeee8]"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters and Controls Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Preset Selector */}
          {dateRange !== undefined && onDateRangeChange && (
            <div className="relative inline-flex items-center">
              <span className="absolute left-3 text-[#916b61] pointer-events-none">
                <Calendar size={14} />
              </span>
              <select
                value={dateRange}
                onChange={(e) => onDateRangeChange(e.target.value)}
                className="pl-8 pr-7 py-2 text-xs font-medium rounded-xl border border-[#e5d5cf] bg-[#fdfaf8] text-[#2d0e17] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#e76f51] transition-colors cursor-pointer appearance-none"
              >
                {dateRangeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 text-[#916b61] pointer-events-none text-[10px]">▼</span>
            </div>
          )}

          {/* Dynamic Categorical Dropdowns */}
          {dropdownFilters.map((filter) => (
            <div key={filter.id} className="relative inline-flex items-center">
              <span className="absolute left-3 text-[#916b61] pointer-events-none">
                <Filter size={13} />
              </span>
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className={`
                  pl-8 pr-7 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer appearance-none
                  ${filter.value !== 'all' 
                    ? 'border-[#e76f51] bg-[#fdf2ee] text-[#b23b1e] font-semibold' 
                    : 'border-[#e5d5cf] bg-[#fdfaf8] text-[#2d0e17] hover:bg-white'}
                  focus:outline-none focus:ring-2 focus:ring-[#e76f51]
                `}
                aria-label={filter.label}
              >
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 text-[#916b61] pointer-events-none text-[10px]">▼</span>
            </div>
          ))}

          {/* Sort By Dropdown */}
          {sortBy !== undefined && onSortChange && sortOptions.length > 0 && (
            <div className="relative inline-flex items-center">
              <span className="absolute left-3 text-[#916b61] pointer-events-none">
                <ArrowUpDown size={13} />
              </span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="pl-8 pr-7 py-2 text-xs font-medium rounded-xl border border-[#e5d5cf] bg-[#fdfaf8] text-[#2d0e17] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#e76f51] transition-colors cursor-pointer appearance-none"
                aria-label="Sort options"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 text-[#916b61] pointer-events-none text-[10px]">▼</span>
            </div>
          )}

          {/* Reset All Button */}
          {isFiltered && onResetAll && (
            <button
              type="button"
              onClick={onResetAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-all cursor-pointer shadow-xs"
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Summary Bar: Record count & Active Filter Indicators */}
      <div className="flex flex-wrap items-center justify-between text-xs text-[#735751] pt-1 border-t border-[#ebd8d0]/40">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-[#2d0e17]">{filteredCount}</strong> of {totalCount} {totalCount === 1 ? 'record' : 'records'}
          </span>
          {isFiltered && (
            <span className="px-2 py-0.5 rounded-full bg-[#faeee8] text-[#e76f51] font-semibold text-[11px] border border-[#ebd8d0]">
              Filtered
            </span>
          )}
        </div>

        {isFiltered && onResetAll && (
          <button
            type="button"
            onClick={onResetAll}
            className="text-xs text-[#e76f51] hover:underline font-medium cursor-pointer"
          >
            Clear active filters
          </button>
        )}
      </div>
    </div>
  )
}
