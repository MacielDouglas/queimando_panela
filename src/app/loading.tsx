export default function Loading() {
  return (
    <main className="bg-white">
      <div className="editorial-container py-8">
        <div className="aspect-[3/1] border-2 border-[#0a0a0a] bg-[#f5f5f5] animate-pulse" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {['latest-1', 'latest-2', 'latest-3', 'latest-4'].map((key) => (
            <div
              key={key}
              className="border-2 border-[#e5e5e5] bg-white p-2 space-y-2"
            >
              <div className="aspect-[4/3] bg-[#f5f5f5]" />
              <div className="h-3 w-3/4 bg-[#0a0a0a]/10" />
            </div>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {['classic-1', 'classic-2'].map((key) => (
            <div
              key={key}
              className="border-2 border-[#0a0a0a] bg-white p-4 h-32 bg-[#f5f5f5] animate-pulse"
            />
          ))}
        </div>
        <div className="mt-8 h-40 border-2 border-[#0a0a0a] bg-[#ffb900] animate-pulse" />
      </div>
    </main>
  );
}
