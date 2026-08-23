import { Link } from 'react-router-dom'

export default function AboutPlaceholder() {
  return (
    <div className="max-w-container-max mx-auto px-margin-desktop py-16 animate-fade-in">
      {/* Header Section */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="font-headline-xl text-headline-xl text-primary mb-3">About Us</h2>
        <p className="text-on-surface-variant font-body-lg">
          Crafting sweet moments, spreading joy, and celebrating life's special occasions.
        </p>
        <div className="flex items-center justify-center gap-2 text-primary mt-4">
          <div className="h-px w-12 bg-primary/30"></div>
          <span className="material-symbols-outlined text-sm">favorite</span>
          <div className="h-px w-12 bg-primary/30"></div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Editorial Brand Image Container */}
        <div className="relative w-full aspect-square max-w-md mx-auto">
          <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-3xl scale-90"></div>
          <img
            className="w-full h-full object-cover rounded-3xl soft-shadow relative z-10 border-4 border-surface"
            alt="Artisanal bakers at BloomCakes"
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
          />
        </div>

        {/* 100-words Description Section */}
        <div className="flex flex-col gap-6 text-left">
          <h3 className="font-headline-lg text-headline-lg text-on-surface">Our Baking Philosophy</h3>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            At BloomCakes, we believe that every celebration deserves a touch of sweet perfection. Our journey started in a small kitchen with a simple passion for blending pure, premium ingredients with artistic cake craftsmanship. From our decadent signature chocolates to our custom-made milestone creations, we bake everything fresh daily with deep love and care. We are committed to crafting premium, hygienic, and incredibly appetizing delights that bring comfort to everyday moments and elevate life's biggest milestones. Every single bite is meticulously whipped to spread pure happiness and make your beautiful memories bloom with flavor.
          </p>
          <div className="flex gap-4 mt-2">
            <Link to="/shop" className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-md">
              EXPLORE OUR MENU
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
