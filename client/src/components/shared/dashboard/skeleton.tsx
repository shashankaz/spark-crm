import { Skeleton } from "@/components/ui/skeleton";

export const TableSkeleton = ({
  rows = 8,
  cols = 6,
}: {
  rows?: number;
  cols?: number;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4 gap-2">
        <Skeleton className="h-10 w-1/3 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>

      <div className="overflow-hidden rounded-md border">
        <div className="border-b bg-muted/40 px-5 py-3">
          <div className="flex items-center gap-4">
            {Array.from({ length: cols }).map((_, i) => (
              <Skeleton key={`header-${i}`} className="h-4 flex-1" />
            ))}
          </div>
        </div>

        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={`row-${rowIdx}`}
            className="flex items-center gap-4 border-b last:border-0 px-5 py-4"
          >
            {Array.from({ length: cols }).map((_, colIdx) => (
              <Skeleton
                key={`cell-${rowIdx}-${colIdx}`}
                className="h-4 flex-1"
                style={{ opacity: 1 - colIdx * 0.08 }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap pt-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-14 rounded-md" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
};
