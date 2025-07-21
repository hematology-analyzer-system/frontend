'use client';
import { FC, useState } from 'react';

interface Props { onSearch: (q:string)=>void; onSort: (s:string)=>void; onFilter: ()=>void; }
const FilterBar: FC<Props> = ({ onSearch, onSort, onFilter }) => {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('nameAsc');
  return (
    <div className="flex p-4 space-x-4">
      <input placeholder="Search test..." className="flex-1 p-2 border rounded-lg"
        value={q} onChange={e=>setQ(e.target.value)}
        onKeyDown={e=>e.key==='Enter'&&onSearch(q)}
      />
      <select className="p-2 border rounded-lg" value={sort}
        onChange={e=>{ setSort(e.target.value); onSort(e.target.value); }}>
        <option value="nameAsc">Name: A-Z</option>
        <option value="nameDesc">Name: Z-A</option>
      </select>
      <button onClick={onFilter} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Apply filter</button>
    </div>
  );
};
export default FilterBar;