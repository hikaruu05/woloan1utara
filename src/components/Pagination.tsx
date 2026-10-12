import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemName?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemName = 'item'
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-wood-200">
      <div className="text-xs text-warm-700">
        Menampilkan <strong className="text-wood-950 font-bold">{startIdx} - {endIdx}</strong> dari <strong className="text-wood-950 font-bold">{totalItems}</strong> {itemName}
        <span className="text-warm-500 ml-1">({itemsPerPage} per halaman)</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
            currentPage === 1
              ? 'border-warm-200 text-warm-400 bg-warm-50/50 cursor-not-allowed'
              : 'border-wood-200 text-wood-900 bg-white hover:bg-wood-100 hover:border-wood-400 shadow-2xs'
          }`}
          aria-label="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-wood-800 text-white shadow-warm-sm border border-wood-800'
                  : 'bg-white text-warm-800 border border-warm-200 hover:bg-wood-50 hover:text-wood-900'
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
            currentPage === totalPages
              ? 'border-warm-200 text-warm-400 bg-warm-50/50 cursor-not-allowed'
              : 'border-wood-200 text-wood-900 bg-white hover:bg-wood-100 hover:border-wood-400 shadow-2xs'
          }`}
          aria-label="Halaman Berikutnya"
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
