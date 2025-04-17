import { useEffect, useState } from "react";

export function usePagination<T>({
  items,
  itemsPerPage = 10,
}: {
  items: T[] | undefined;
  itemsPerPage?: number;
}) {
  const [currentPage, setCurrentPage] = useState(0);

  const isEmpty = !items || items.length === 0;
  const totalPages = isEmpty ? 0 : Math.ceil(items.length / itemsPerPage);

  const paginatedItems = isEmpty
    ? []
    : items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(0);
  }, [items]);

  return {
    currentPage,
    setCurrentPage,
    paginatedItems,
    totalPages,
    isEmpty,
    handlePageChange,
  };
}
