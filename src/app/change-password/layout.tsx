function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[calc(100vh-15.5rem)] py-7 flex flex-col items-center lg:justify-center">
      {children}
    </main>
  );
}

export default layout;
