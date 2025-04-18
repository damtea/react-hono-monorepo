import { useCallback } from "react";
import { Button } from "./ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import Combobox from "./combobox";

type Pagination = {
  currentPage: number;
  rowsPerPage?: number;
  totalRows: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  hideLabel?: boolean;
};
export const Pagination = ({
  currentPage,
  rowsPerPage = 10,
  setRowsPerPage,
  setCurrentPage,
  hideLabel = false,
  totalRows,
}: Pagination) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleFirst = useCallback(() => {
    if (currentPage !== 1) setCurrentPage(1);
  }, [currentPage, setCurrentPage]);

  const handleLast = useCallback(() => {
    if (currentPage !== totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages, setCurrentPage]);

  const rowStart = (currentPage - 1) * rowsPerPage + 1;
  const rowEnd = Math.min(currentPage * rowsPerPage, totalRows);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex justify-center sm:justify-end items-center gap-2 my-2">
      <span className="text-sm">Rows per page:</span>
      <Combobox
        value={rowsPerPage}
        setValue={(value) => setRowsPerPage(value as number)}
        options={[
          {
            label: "10",
            value: 10,
          },
          {
            label: "20",
            value: 20,
          },
          {
            label: "50",
            value: 50,
          },
        ]}
        title="Rows per Page"
        className="w-24"
        hideSearch
      />
      {!hideLabel && (
        <span className="text-sm">
          {rowStart}-{rowEnd} of {totalRows}
        </span>
      )}
      <div className="flex justify-end items-center gap-1 rounded-md">
        {!hideLabel && (
          <Button
            title="First Page"
            size="icon"
            variant="secondary"
            onClick={handleFirst}
            disabled={isFirstPage}
            aria-label="First Page"
          >
            <ChevronsLeftIcon size={18} />
          </Button>
        )}
        <Button
          title="Previous"
          size="icon"
          variant="secondary"
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={isFirstPage}
          aria-label="Previous Page"
        >
          <ChevronLeftIcon size={16} />
        </Button>
        <Button
          title="Next"
          size="icon"
          variant="secondary"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={hideLabel ? totalRows < rowsPerPage : isLastPage}
          aria-label="Next Page"
        >
          <ChevronRightIcon size={16} />
        </Button>
        {!hideLabel && (
          <Button
            title="Last"
            size="icon"
            variant="secondary"
            onClick={handleLast}
            disabled={isLastPage}
            aria-label="Last Page"
          >
            <ChevronsRightIcon size={18} />
          </Button>
        )}
      </div>
    </div>
  );
};
