import React from "react";

export function ProductCardSkeleton() {
    return (
        <div className="group relative overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-900 animate-pulse">
            <div className="aspect-square bg-gray-200 dark:bg-gray-800 w-full" />
            <div className="p-4">
                <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 9 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-8">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}
