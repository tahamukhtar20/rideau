export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[calc(100vh-15.5rem)] font-secondary text-primary bg-secondary flex flex-col">
      {children}
    </main>
  );
}
