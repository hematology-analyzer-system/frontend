'use client';
import { FC } from 'react';

interface Props {
  searchText: string;
  onSearch: (q: string) => void;
  sortKey: 'nameAsc' | 'nameDesc';
  onSort: (s: 'nameAsc' | 'nameDesc') => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClearDateFilter: () => void;
}

const FilterBar: FC<Props> = ({ 
  searchText, 
  onSearch, 
  sortKey, 
  onSort,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearDateFilter
}) => {
  return (
    <div className="p-4 space-y-4">
      {/* First row: Search and Sort */}
      <div className="flex space-x-4">
        <input
          autoFocus   
          type="text"
          placeholder="Search patient name..."
          className="flex-1 p-2 border rounded-lg"
          value={searchText}
          onChange={e => onSearch(e.target.value)}
        />

        <select
          className="p-2 border rounded-lg"
          value={sortKey}
          onChange={e => onSort(e.target.value as 'nameAsc' | 'nameDesc')}
        >
          <option value="nameAsc">Name: A–Z</option>
          <option value="nameDesc">Name: Z–A</option>
        </select>
      </div>

      {/* Second row: Date Range Filter */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">
          Date Range:
        </label>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">From:</label>
          <input
            type="date"
            className="p-2 border rounded-lg"
            value={startDate}
            onChange={e => onStartDateChange(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">To:</label>
          <input
            type="date"
            className="p-2 border rounded-lg"
            value={endDate}
            onChange={e => onEndDateChange(e.target.value)}
          />
        </div>

        <button
          onClick={onClearDateFilter}
          className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Clear Dates
        </button>

        {/* Show active date filter indicator */}
        {(startDate || endDate) && (
          <div className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {startDate && endDate 
              ? `${startDate} to ${endDate}`
              : startDate 
                ? `From ${startDate}`
                : `Until ${endDate}`
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;