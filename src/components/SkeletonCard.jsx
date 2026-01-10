export default function SkeletonCard() {
    return (
      <div className="animate-pulse">
      <div className="bg-gray-700 rounded-lg h-[260px] mb-3"></div>
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    </div>
  )
}