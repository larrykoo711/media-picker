export function SkeletonGrid() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[4/3] w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
