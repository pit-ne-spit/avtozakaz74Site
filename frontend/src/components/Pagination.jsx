/**
 * Pagination component
 */
export default function Pagination({ page, total, pageSize = 10, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  
  if (totalPages <= 1) return null;

  const goToPage = (p) => {
    const newPage = Math.min(totalPages, Math.max(1, p));
    if (newPage !== page) {
      onChange(newPage);
    }
  };

  // Generate page numbers to display (max 9: 1 ... prev-2 prev-1 current next+1 next+2 ... last)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 9; // 1 + ... + 5 pages + ... + last
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page (2 pages on each side)
      const rangeStart = Math.max(2, page - 2);
      const rangeEnd = Math.min(totalPages - 1, page + 2);
      
      // Add ellipsis after first page if needed
      if (rangeStart > 2) {
        pages.push('...');
      }
      
      // Add pages around current page
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (rangeEnd < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 bg-white rounded-xl shadow-md p-4">
      <button
        className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Предыдущая
      </button>
      
      <div className="flex gap-1.5">
        {getPageNumbers().map((pageNum, idx) => {
          if (pageNum === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500 font-medium">
                •••
              </span>
            );
          }
          
          return (
            <button
              key={pageNum}
              className={`min-w-[44px] h-11 rounded-lg font-semibold transition-all duration-200 ${
                pageNum === page
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md transform scale-110'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow'
              }`}
              onClick={() => goToPage(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
      
      <button
        className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
      >
        Следующая
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
