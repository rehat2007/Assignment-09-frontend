export default function Home() {
  return (
    <main className="relative flex-1 overflow-hidden bg-[#f6f5f0] dark:bg-[#050d09]">
      {/* Soft green glow like the reference background. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_15%,rgba(17,130,87,0.10),transparent_42%)] dark:bg-[radial-gradient(circle_at_78%_15%,rgba(33,160,112,0.14),transparent_42%)]" />
    </main>
  );
}
