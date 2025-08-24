"use client"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { useMemo, useCallback, memo } from "react"

interface PaginationComponentProps {
  totalPages: number
  currentPage: number
  handleInputChange: (e: { target: { name: string; value: number } }) => void
}

/**
 * Pagination component
 */
const PaginationComponent = memo(function PaginationComponent({
  totalPages,
  currentPage,
  handleInputChange,
}: PaginationComponentProps) {
  // Memoize page numbers to prevent unnecessary recalculations
  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  )

  // Memoize visible page numbers to prevent unnecessary recalculations
  const visiblePages = useMemo(() => {
    const pages = []
    for (let page = 1; page <= totalPages; page++) {
      if (
        page === currentPage - 1 ||
        page === currentPage ||
        page === currentPage + 1
      ) {
        pages.push(page)
      }
    }
    return pages
  }, [currentPage, totalPages])

  // Memoize pagination handlers to prevent unnecessary re-renders
  const handlePageChange = useCallback(
    (page: number) => {
      handleInputChange({
        target: { name: "page", value: page },
      })
    },
    [handleInputChange]
  )

  const handleFirstPage = useCallback(() => {
    handlePageChange(1)
  }, [handlePageChange])

  const handlePreviousPage = useCallback(() => {
    handlePageChange(currentPage - 1)
  }, [handlePageChange, currentPage])

  const handleNextPage = useCallback(() => {
    handlePageChange(currentPage + 1)
  }, [handlePageChange, currentPage])

  const handleLastPage = useCallback(() => {
    handlePageChange(totalPages)
  }, [handlePageChange, totalPages])

  // Memoize pagination visibility conditions
  const showFirstPage = currentPage > 1
  const showPreviousPage = currentPage > 1
  const showNextPage = currentPage < totalPages
  const showLastPage = currentPage < totalPages
  const showLeftEllipsis = pageNumbers.length > 5 && currentPage > 2
  const showRightEllipsis =
    pageNumbers.length > 5 && currentPage < totalPages - 1

  return (
    <div className="my-4 flex items-center justify-center">
      <Pagination>
        <PaginationContent>
          {showFirstPage && (
            <PaginationItem>
              <PaginationLink href="#" size="default" onClick={handleFirstPage}>
                First
              </PaginationLink>
            </PaginationItem>
          )}
          {showPreviousPage && (
            <PaginationItem>
              <PaginationPrevious
                href={"#"}
                size="default"
                onClick={handlePreviousPage}
              />
            </PaginationItem>
          )}
          {showLeftEllipsis && <PaginationEllipsis />}
          {visiblePages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                size="default"
                className={`mx-2 rounded-lg px-4 py-2 ${
                  page === currentPage ? "bg-primary text-white" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          {showRightEllipsis && <PaginationEllipsis />}
          {showNextPage && (
            <PaginationItem>
              <PaginationNext
                href={"#"}
                size="default"
                onClick={handleNextPage}
              />
            </PaginationItem>
          )}
          {showLastPage && (
            <PaginationItem>
              <PaginationLink href="#" size="default" onClick={handleLastPage}>
                Last
              </PaginationLink>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
})

export default PaginationComponent
