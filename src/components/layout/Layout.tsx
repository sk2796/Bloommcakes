import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useCartStore } from '@/features/cart/store/useCartStore'

export function Layout() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { items } = useCartStore()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Sum total quantities of items in the cart
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="font-body-md text-body-md antialiased overflow-x-hidden min-h-screen flex flex-col bg-background text-on-background">
      {/* Top Navigation Bar */}
      <nav 
        className={`bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md text-primary dark:text-primary-fixed w-full top-0 sticky z-50 border-b border-outline-variant/30 dark:border-outline/20 transition-all duration-300 ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`} 
        id="main-nav"
      >
        <div className="flex justify-between items-center w-full px-margin-desktop py-4 max-w-container-max mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.jpg" alt="BloomCakes Logo" className="w-10 h-10 rounded-full object-cover border border-primary/20" />
            <span className="text-headline-md font-headline-lg text-primary dark:text-primary-fixed font-bold tracking-tight">BloomCakes</span>
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link 
              className={`font-label-md text-label-md transition-colors ${
                location.pathname === '/' 
                  ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                  : 'text-on-surface-variant hover:text-primary'
              }`} 
              to="/"
            >
              Home
            </Link>
            <Link 
              className={`font-label-md text-label-md transition-colors ${
                location.pathname === '/about' 
                  ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                  : 'text-on-surface-variant hover:text-primary'
              }`} 
              to="/about"
            >
              About Us
            </Link>
            <Link 
              className={`font-label-md text-label-md transition-colors ${
                location.pathname.startsWith('/shop') 
                  ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                  : 'text-on-surface-variant hover:text-primary'
              }`} 
              to="/shop"
            >
              Menu
            </Link>
            <Link 
              className={`font-label-md text-label-md transition-colors ${
                location.pathname === '/custom-cake' 
                  ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                  : 'text-on-surface-variant hover:text-primary'
              }`} 
              to="/custom-cake"
            >
              Custom Cakes
            </Link>
            <Link 
              className={`font-label-md text-label-md transition-colors ${
                location.pathname === '/contact' 
                  ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                  : 'text-on-surface-variant hover:text-primary'
              }`} 
              to="/contact"
            >
              Contact
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-primary hover:bg-surface-container rounded-full transition-colors">
              <span className="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary-container text-on-primary-container text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link to="/shop" className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-md hidden sm:block">ORDER NOW</Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined" data-icon="menu">{isMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer overlay panel */}
        {isMenuOpen && (
          <div className="md:hidden bg-surface border-t border-outline-variant/30 py-4 px-margin-desktop flex flex-col gap-4 animate-fade-in">
            <Link onClick={() => setIsMenuOpen(false)} to="/" className={`font-semibold py-2 border-b border-outline-variant/10 text-sm ${location.pathname === '/' ? 'text-primary' : 'text-on-surface-variant'}`}>Home</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/about" className={`font-semibold py-2 border-b border-outline-variant/10 text-sm ${location.pathname === '/about' ? 'text-primary' : 'text-on-surface-variant'}`}>About Us</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/shop" className={`font-semibold py-2 border-b border-outline-variant/10 text-sm ${location.pathname.startsWith('/shop') ? 'text-primary' : 'text-on-surface-variant'}`}>Menu</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/custom-cake" className={`font-semibold py-2 border-b border-outline-variant/10 text-sm ${location.pathname === '/custom-cake' ? 'text-primary' : 'text-on-surface-variant'}`}>Custom Cakes</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/contact" className={`font-semibold py-2 text-sm ${location.pathname === '/contact' ? 'text-primary' : 'text-on-surface-variant'}`}>Contact</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/shop" className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-center font-bold text-xs uppercase tracking-wider shadow-md mt-2">ORDER NOW</Link>
          </div>
        )}
      </nav>

      {/* Main page content wrapper */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant dark:border-outline mt-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-section-gap max-w-container-max mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <img src="/logo.jpg" alt="BloomCakes Logo" className="w-8 h-8 rounded-full object-cover border border-primary/20" />
              <span className="font-headline-md text-headline-md text-primary dark:text-primary-fixed-dim font-bold">BloomCakes</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-on-secondary-fixed-variant italic">
              Beautifully Crafted. Happily Celebrated.
            </p>
            <div className="flex gap-4 mt-2">
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="https://wa.me/918793058057" target="_blank" rel="noreferrer" title="WhatsApp">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.248 8.477 3.517 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.8.001-2.618-1.01-5.08-2.859-6.931C16.378 2.025 13.92 1.015 11.999 1.015c-5.412 0-9.816 4.404-9.82 9.81-.001 1.936.568 3.826 1.648 5.446l-.999 3.65 3.82-.967zm12.355-6.52c-.3-.15-1.77-.875-2.045-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-1.025-.512-1.745-.882-2.427-2.05-.181-.31.181-.287.519-.96.062-.125.031-.237-.015-.337-.046-.1-.476-1.144-.652-1.569-.172-.412-.344-.356-.476-.362-.125-.006-.268-.007-.412-.007s-.377.05-.575.268c-.198.219-.756.738-.756 1.8s.772 2.088.88 2.238c.108.15 1.517 2.316 3.675 3.248 1.25.541 1.9.619 2.583.518.775-.115 2.378-.973 2.712-1.916.335-.943.335-1.75.235-1.9-.1-.15-.4-.25-.7-.4z"/>
                </svg>
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="https://twitter.com" target="_blank" rel="noreferrer" title="Twitter">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface mb-2">Quick Links</h4>
            <Link className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-body-md text-body-md" to="/">Home</Link>
            <Link className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-body-md text-body-md" to="/about">About Us</Link>
            <Link className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-body-md text-body-md" to="/shop">Menu</Link>
            <Link className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-body-md text-body-md" to="/custom-cake">Custom Cakes</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface mb-2">Information</h4>
            <a className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-body-md text-body-md" href="#">Shipping &amp; Delivery</a>
            <a className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-body-md text-body-md" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-body-md text-body-md" href="#">Terms &amp; Conditions</a>
            <a className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-body-md text-body-md" href="#">Refund Policy</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface mb-2">Contact Info</h4>
            <div className="flex items-center gap-2 text-on-surface-variant dark:text-on-secondary-fixed-variant">
              <span className="material-symbols-outlined text-sm" data-icon="call">call</span>
              <span className="font-body-md text-body-md">+91 87930 58057</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant dark:text-on-secondary-fixed-variant">
              <span className="material-symbols-outlined text-sm" data-icon="mail">mail</span>
              <span className="font-body-md text-body-md">hello@bloomcakes.co</span>
            </div>
            <div className="flex items-start gap-2 text-on-surface-variant dark:text-on-secondary-fixed-variant">
              <span className="material-symbols-outlined text-sm mt-1" data-icon="location_on">location_on</span>
              <span className="font-body-md text-body-md">Ahmedabad, Gujarat<br/>We Deliver In Ahmedabad</span>
            </div>
          </div>
        </div>
        <div className="border-t border-outline-variant/50 py-6 text-center">
          <p className="font-label-sm text-label-sm text-on-surface-variant">© 2024 BloomCakes. Beautifully Crafted. Happily Celebrated.</p>
        </div>
      </footer>
    </div>
  )
}
