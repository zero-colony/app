import { useState } from "react";

export function usePagination<T>({
  items,
  itemsPerPage = 10,
}: {
  items: T[];
  itemsPerPage?: number;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const isEmpty = totalItems === 0;

  return {
    currentPage,
    setCurrentPage,
    paginatedItems,
    totalPages,
    totalItems,
    isEmpty,
  };
}
