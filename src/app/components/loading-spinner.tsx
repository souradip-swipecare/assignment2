export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-rose-600"></div>
      <p className="mt-4 text-gray-700">Loading projects...</p>
    </div>
  )
}
