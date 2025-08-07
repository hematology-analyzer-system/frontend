'use client';
import { FC } from 'react';

interface Props {
  searchText: string;
  onSearch: (q: string) => void;
  sortKey: 'nameAsc' | 'nameDesc';
  onSort: (s: 'nameAsc' | 'nameDesc') => void;
}

const FilterBar: FC<Props> = ({ 
  searchText, 
  onSearch, 
  sortKey, 
  onSort
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

      
      </div>
  );
};

export default FilterBar;