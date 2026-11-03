import React from 'react';

export default function LibraryStats({ items = [] }) {
  const normalize = (status) => (status ? status.toUpperCase() : '');

  const counts = {
    'Total Games': items.length,
    Playing: items.filter((g) => normalize(g.status) === 'PLAYING').length,
    Completed: items.filter((g) => normalize(g.status) === 'COMPLETED').length,
    Backlog: items.filter((g) => normalize(g.status) === 'BACKLOG').length,
    Dropped: items.filter((g) => normalize(g.status) === 'DROPPED').length,
  };

  return (
    <section
      aria-label="Library statistics"
      className="grid grid-cols-2 gap-4 md:grid-cols-5"
    >
      {Object.entries(counts).map(([label, value]) => (
        <div
          key={label}
          className="flex h-[100px] flex-col justify-center gap-1 rounded-[6px] border border-[#d3d3d3] bg-white px-5 py-4 shadow-xs"
        >
          <span className="text-[12px] font-medium text-[#717171]">
            {label}
          </span>
          <strong className="text-[30px] font-semibold leading-tight text-[#242424]">
            {value}
          </strong>
        </div>
      ))}
    </section>
  );
}
