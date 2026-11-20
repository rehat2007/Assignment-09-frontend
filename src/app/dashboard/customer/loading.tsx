export default function CustomerLoading() {
  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] animate-pulse px-6 py-8">
        <div className="h-8 w-52 rounded-md bg-black/[0.07] dark:bg-white/[0.07]" />
        <div className="mt-3 h-4 w-80 max-w-full rounded-md bg-black/[0.05] dark:bg-white/[0.05]" />

        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[132px] rounded-2xl border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]"
            />
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          <div className="grid gap-4">
            <div className="h-[280px] rounded-2xl border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]" />
            <div className="h-[220px] rounded-2xl border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]" />
          </div>
          <div className="grid gap-4">
            <div className="h-[360px] rounded-2xl border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]" />
            <div className="h-[160px] rounded-2xl border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]" />
          </div>
        </div>
      </div>
    </main>
  );
}
