// components/SearchFilterBar.tsx
'use client';

import { useState } from 'react';

const SearchFilterBar = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="bg-blue-50 p-3 flex flex-wrap gap-3 rounded-md mb-4">
      <input
        type="text"
        placeholder="Search anything ..."
        className="flex-1 px-3 py-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select className="px-3 py-2 border rounded">
        <option>Role: Admin</option>
        <option>Doctor</option>
        <option>Staff</option>
      </select>

      <select className="px-3 py-2 border rounded">
        <option>Location: TPHCM</option>
        <option>Hanoi</option>
        <option>Danang</option>
      </select>

      <select className="px-3 py-2 border rounded">
        <option>Sort: A - Z</option>
        <option>Z - A</option>
      </select>
    </div>
  );
};

export default SearchFilterBar;
