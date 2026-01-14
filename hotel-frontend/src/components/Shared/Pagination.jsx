// src/components/Shared/Pagination.jsx
import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null; // Không hiện nếu chỉ có 1 trang

  const pages = [];
  // Logic hiển thị số trang (Rút gọn nếu quá nhiều trang)
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border bg-white disabled:opacity-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        &lt; Trước
      </button>

      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`px-3 py-1 rounded border ${
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
          } ${page === '...' ? 'cursor-default border-none' : ''}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border bg-white disabled:opacity-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        Sau &gt;
      </button>
    </div>
  );
}