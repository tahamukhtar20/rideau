function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[calc(100vh-15.5rem)] flex flex-col items-center py-20 ">
      {children}
    </main>
  );
}

export default layout;
