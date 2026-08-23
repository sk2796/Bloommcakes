import { useState } from 'react'

export function Layout() {
  const [isDemoActive, setIsDemoActive] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
      <header className="border-b border-border/10 py-5 px-6 bg-cream-dark/30 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight text-amber font-heading leading-none">
              BLOOMCAKES
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-chocolate font-sans font-bold mt-1">
              Artisanal Confectionery System
            </span>
          </div>
          <nav className="flex items-center space-x-6">
            <span className="font-accent text-lg text-amber leading-none select-none">
              Beautifully Crafted, Happily Celebrated
            </span>
            <button
              onClick={() => setIsDemoActive(!isDemoActive)}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-primary rounded hover:bg-amber-light hover:text-chocolate-dark transition-all duration-300 shadow-sm"
            >
              Toggle Demo Sandbox
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-12">
        {/* Verification sandbox demonstrating the Design Tokens */}
        {isDemoActive ? (
          <div className="space-y-12 animate-fade-in">
            {/* Typography scale demo */}
            <section className="bg-white p-8 rounded-xl shadow-ambient border border-border/10">
              <h2 className="text-xs uppercase tracking-wider text-chocolate font-bold mb-6 pb-2 border-b border-border/10">
                1. Typography Scale Showcase
              </h2>
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">display-lg (Poppins Bold 48px)</span>
                  <h3 className="text-4xl sm:text-5xl font-bold font-heading text-foreground mt-1">
                    Signature Wedding Cakes
                  </h3>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">accent-text (Dancing Script 28px)</span>
                  <p className="font-accent text-3xl text-amber mt-1">
                    Made with organic berries and pure vanilla bean infusion...
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">headline-md (Poppins SemiBold 24px)</span>
                  <h4 className="text-2xl font-semibold font-heading text-chocolate mt-1">
                    Velvety Chocolate Ganache
                  </h4>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">body-lg (Lato Regular 18px)</span>
                  <p className="text-lg text-foreground/80 mt-1 max-w-2xl leading-relaxed">
                    Our cakes are custom-layered with handmade creams and fine ingredients. We bake fresh every morning for your celebrations.
                  </p>
                </div>
              </div>
            </section>

            {/* Components showcase */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-ambient border border-border/10 flex flex-col justify-between">
                <div>
                  <h2 className="text-xs uppercase tracking-wider text-chocolate font-bold mb-6 pb-2 border-b border-border/10">
                    2. Interaction States & Shapes
                  </h2>
                  <div className="space-y-6">
                    {/* Buttons demo */}
                    <div className="flex flex-wrap gap-4">
                      <button className="px-6 py-2.5 bg-primary text-white font-bold rounded shadow-md hover:bg-amber-light hover:text-chocolate-dark transition-all duration-300 hover:shadow-ambient hover:-translate-y-0.5">
                        Primary Button
                      </button>
                      <button className="px-6 py-2.5 border border-chocolate text-chocolate font-bold rounded hover:bg-cream-dark/20 transition-all duration-300">
                        Secondary Button
                      </button>
                    </div>

                    {/* Chips & Badges */}
                    <div className="flex flex-wrap gap-3">
                      <span className="px-3 py-1 bg-cream-dark text-chocolate text-xs font-bold rounded-full">
                        EGGLESS
                      </span>
                      <span className="px-3 py-1 bg-cream-dark text-chocolate text-xs font-bold rounded-full">
                        100% VEG
                      </span>
                      <span className="px-3 py-1 bg-amber-light/20 text-amber text-xs font-bold rounded-full">
                        SEASONAL SPECIAL
                      </span>
                    </div>

                    {/* Input Field demo */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">
                        Custom Cake Message
                      </label>
                      <input
                        type="text"
                        placeholder="E.g., Happy Birthday Chloe"
                        className="w-full px-4 py-3 bg-cream/30 border border-chocolate/20 rounded focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card visual elements */}
              <div className="bg-white rounded-xl shadow-ambient border border-border/10 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div className="h-48 bg-cream-dark/40 flex items-center justify-center p-6 relative">
                  <div className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-700 bg-[url('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80')]"></div>
                  <span className="absolute top-4 right-4 px-3 py-1 bg-amber text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Bestseller
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold font-heading text-chocolate-dark group-hover:text-amber transition-colors duration-300">
                    Classic Belgian Raspberry
                  </h3>
                  <p className="text-sm text-foreground/70 mt-2 line-clamp-2">
                    Rich dark Belgian chocolate layers layered with fresh tart raspberries and cream.
                  </p>
                  <div className="flex items-center justify-between mt-6">
                    <span className="text-lg font-bold text-chocolate-dark">$45.00</span>
                    <button className="text-xs font-bold uppercase tracking-wider text-amber hover:text-chocolate-dark transition-colors duration-300">
                      View Details &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="py-24 text-center max-w-xl mx-auto">
            <h2 className="text-5xl font-bold font-heading text-chocolate mb-4 leading-tight">
              Crafting Joyful Moments
            </h2>
            <p className="font-accent text-3xl text-amber mb-8">
              Beautifully Crafted, Happily Celebrated
            </p>
            <p className="text-foreground/80 leading-relaxed mb-8 font-sans">
              Welcome to the foundation layout shell configured with the <strong className="text-amber">Artisanal Confectionery System</strong>. Click the button in the header navigation to preview the sandbox.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-border/10 py-6 px-6 text-center text-xs text-chocolate/60 bg-cream-dark/10">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} Bloomcakes. Beautifully Crafted.</span>
          <span className="font-accent text-sm text-amber">Handmade for your memories</span>
        </div>
      </footer>
    </div>
  )
}
