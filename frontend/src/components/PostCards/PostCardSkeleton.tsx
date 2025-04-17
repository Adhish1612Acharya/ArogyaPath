import { Skeleton } from '@/components/ui/skeleton';

export function PostCardSkeleton() {
  return (
    <div className="overflow-hidden border-0 shadow-sm bg-white rounded-lg">
      <div className="p-4">
        <div className="flex items-start space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>

        <div className="my-4 space-y-3">
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <Skeleton className="h-48 w-full rounded-lg mb-4" />

        <div className="flex flex-wrap gap-2 mb-4">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>

      <div className="border-t bg-gray-50 px-4 py-3">
        <div className="flex justify-between items-center w-full">
          <div className="flex space-x-6">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}