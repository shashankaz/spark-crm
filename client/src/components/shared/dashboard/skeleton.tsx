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
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-72 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>

      <div className="rounded-lg border overflow-hidden">
        <div className="flex items-center gap-4 border-b bg-muted/40 px-4 py-3">
          <Skeleton className="h-4 w-4 rounded" />
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>

        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="flex items-center gap-4 border-b last:border-0 px-4 py-4"
          >
            <Skeleton className="h-4 w-4 rounded" />
            {Array.from({ length: cols }).map((_, colIdx) => (
              <Skeleton
                key={colIdx}
                className="h-4 flex-1"
                style={{ opacity: 1 - colIdx * 0.08 }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
