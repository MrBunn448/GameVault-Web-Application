import React from 'react';

export default function Footer({ totalCount, visibleCount }) {
  return (
    <footer className="mt-4 flex flex-col justify-between gap-2 border-t border-[#d3d3d3] pt-6 text-[12px] text-[#717171] sm:flex-row">
      <span data-cy="footer-count">
        Showing {visibleCount === totalCount ? 'all ' : ''}
        {visibleCount} {visibleCount === 1 ? 'game' : 'games'}
      </span>
      <span>GameVault &bull; Semester 3 Full-Stack &bull; Fontys ICT</span>
    </footer>
  );
}
