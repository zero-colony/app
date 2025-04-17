import ReactPaginate from "react-paginate";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: ({ selected }: { selected: number }) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex justify-center">
      <ReactPaginate
        previousLabel={
          <div className="flex items-center gap-1.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rotate-90"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="#838383"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back</span>
          </div>
        }
        nextLabel={
          <div className="flex items-center gap-1.5">
            <span>Next</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="-rotate-90"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="#838383"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        }
        breakLabel="..."
        pageCount={totalPages}
        forcePage={currentPage}
        onPageChange={onPageChange}
        containerClassName="flex items-center gap-1.5"
        pageLinkClassName="flex items-center cursor-pointer justify-center h-8 w-8 text-[#838383] text-xs rounded-lg border border-white/10 bg-white/5 backdrop-blur-md"
        activeLinkClassName="!cursor-default !text-white !border-[#FF2E58] !font-medium"
        previousClassName="h-8 px-1 pr-2 cursor-pointer flex items-center text-[#838383] text-xs rounded-lg border border-white/10 bg-white/5 backdrop-blur-md"
        nextClassName="h-8 px-1 pl-2 cursor-pointer flex items-center text-[#838383] text-xs rounded-lg border border-white/10 bg-white/5 backdrop-blur-md"
        breakClassName="flex items-center justify-center h-8 w-8 text-[#838383] text-xs rounded-lg border border-white/10 bg-white/5 backdrop-blur-md"
        disabledClassName="opacity-50 !cursor-default"
      />
    </div>
  );
}
