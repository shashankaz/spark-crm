import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

interface PaginationProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;

  nextCursor: string | null;
  prevCursor: string | null;

  onNext: () => void;
  onPrevious: () => void;

  totalRows?: number;
  placeholder: string;
  selectedRowsCount: number;
}

export const Pagination = ({
  pageSize,
  onPageSizeChange,
  nextCursor,
  prevCursor,
  onNext,
  onPrevious,
  totalRows,
  placeholder,
  selectedRowsCount,
}: PaginationProps) => {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap pt-1">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {selectedRowsCount > 0 && (
          <span className="font-medium text-foreground">
            {selectedRowsCount} selected ·
          </span>
        )}

        {totalRows ? (
          <>
            <span>Showing</span>

            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                onPageSizeChange(Number(val));
              }}
            >
              <SelectTrigger className="h-8 w-18">
                <SelectValue />
              </SelectTrigger>

              <SelectContent side="top">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span>per page</span>
          </>
        ) : (
          <span>No {placeholder} found</span>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={onPrevious}
          disabled={!prevCursor}
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={onNext}
          disabled={!nextCursor}
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
