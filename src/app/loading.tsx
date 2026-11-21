export default function Loading() {
  return (
    <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
      <div className="mx-auto max-w-[1264px] animate-pulse px-6 py-10">
        <div className="h-3 w-28 rounded bg-black/[0.06] dark:bg-white/[0.06]" />
        <div className="mt-4 h-9 w-[min(420px,90%)] rounded-md bg-black/[0.07] dark:bg-white/[0.07]" />
        <div className="mt-3 h-4 w-[min(560px,100%)] rounded bg-black/[0.05] dark:bg-white/[0.05]" />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="h-11 flex-1 rounded-[11px] border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]" />
          <div className="h-11 w-full rounded-[11px] border border-[#e5e1d6] bg-white sm:w-[180px] dark:border-white/[0.08] dark:bg-[#101a16]" />
          <div className="h-11 w-full rounded-[11px] bg-[#0e6b54]/20 sm:w-[120px] dark:bg-[#63e6b6]/20" />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-8 w-24 rounded-[8px] border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]"
            />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-[18px] border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]"
            >
              <div className="aspect-[16/10] bg-black/[0.04] dark:bg-white/[0.04]" />
              <div className="grid gap-3 p-4">
                <div className="h-5 w-4/5 rounded bg-black/[0.07] dark:bg-white/[0.07]" />
                <div className="h-3 w-2/3 rounded bg-black/[0.05] dark:bg-white/[0.05]" />
                <div className="h-3 w-1/2 rounded bg-black/[0.05] dark:bg-white/[0.05]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
