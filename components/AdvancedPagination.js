"use client"

import { useRouter } from "next/router"
import { generatePageNumbers } from "../utils/paginationHelpers"

export default function AdvancedPagination({ currentPage, totalPages, onPageChange, urlParam = "page" }) {
  const router = useRouter()

  // Don't render if only 1 page or no pages
  if (totalPages <= 1) return null

  const pageNumbers = generatePageNumbers(currentPage, totalPages)

  const handlePageClick = (page) => {
    onPageChange(page)

    // Update URL parameters for bookmarking/SEO
    const query = { ...router.query }
    if (page === 1) {
      delete query[urlParam] // Remove page param for page 1
    } else {
      query[urlParam] = page
    }

    router.push(
      {
        pathname: router.pathname,
        query: query,
      },
      undefined,
      { shallow: true },
    )
  }

  const PageButton = ({ page, isActive = false, isDisabled = false, children }) => (
    <button
      onClick={() => !isDisabled && handlePageClick(page)}
      disabled={isDisabled}
      className={`
        px-3 py-2 mx-1 rounded text-sm font-medium transition-colors
        ${
          isActive
            ? "bg-[#B22234] text-white"
            : "bg-white text-[#3C3B6E] border border-gray-300 hover:bg-[#B22234] hover:text-white"
        }
        ${isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "cursor-pointer"}
        hidden sm:inline-block
      `}
    >
      {children || page}
    </button>
  )

  const MobilePageButton = ({ page, isActive = false, isDisabled = false, children }) => (
    <button
      onClick={() => !isDisabled && handlePageClick(page)}
      disabled={isDisabled}
      className={`
        px-2 py-1 mx-0.5 rounded text-xs font-medium transition-colors
        ${
          isActive
            ? "bg-[#B22234] text-white"
            : "bg-white text-[#3C3B6E] border border-gray-300 hover:bg-[#B22234] hover:text-white"
        }
        ${isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "cursor-pointer"}
        sm:hidden
      `}
    >
      {children || page}
    </button>
  )

  const ArrowButton = ({ direction, page, isDisabled }) => (
    <button
      onClick={() => !isDisabled && handlePageClick(page)}
      disabled={isDisabled}
      className={`
        px-4 py-2 mx-1 rounded font-medium transition-colors
        ${
          isDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#3C3B6E] text-white hover:bg-[#B22234] cursor-pointer"
        }
      `}
    >
      {direction === "prev" ? "‹ Previous" : "Next ›"}
    </button>
  )

  return (
    <div className="flex flex-col items-center mt-6 space-y-4">
      {/* Desktop Pagination */}
      <div className="hidden sm:flex items-center justify-center flex-wrap">
        <ArrowButton direction="prev" page={currentPage - 1} isDisabled={currentPage === 1} />

        {pageNumbers.map((item, index) => {
          if (item === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-500">
                ...
              </span>
            )
          }

          return <PageButton key={item} page={item} isActive={item === currentPage} />
        })}

        <ArrowButton direction="next" page={currentPage + 1} isDisabled={currentPage === totalPages} />
      </div>

      {/* Mobile Pagination - Simplified */}
      <div className="flex sm:hidden items-center justify-center flex-wrap">
        <ArrowButton direction="prev" page={currentPage - 1} isDisabled={currentPage === 1} />

        {/* Show fewer pages on mobile */}
        {generatePageNumbers(currentPage, totalPages, true).map((item, index) => {
          if (item === "...") {
            return (
              <span key={`mobile-ellipsis-${index}`} className="px-1 py-1 text-gray-500 text-xs">
                ...
              </span>
            )
          }

          return <MobilePageButton key={`mobile-${item}`} page={item} isActive={item === currentPage} />
        })}

        <ArrowButton direction="next" page={currentPage + 1} isDisabled={currentPage === totalPages} />
      </div>

      {/* Page Info */}
      <div className="text-sm text-gray-600 text-center">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}
