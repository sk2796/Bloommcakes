export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased">
      <header className="border-b border-border py-4 px-6 bg-card">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-primary">BLOOMCAKES</h1>
          <nav className="flex space-x-4">
            <span className="text-sm text-muted-foreground">Foundation Ready</span>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {/* Placeholder layout content */}
        <div className="py-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Bloomcakes Technical Setup</h2>
          <p className="text-muted-foreground">The foundation structure is ready for Phase 2 styling and UI implementation.</p>
        </div>
      </main>
      <footer className="border-t border-border py-4 px-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Bloomcakes. All rights reserved.
      </footer>
    </div>
  )
}
