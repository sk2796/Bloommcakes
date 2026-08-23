import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export function Layout() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

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
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-4xl" data-icon="cake">cake</span>
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
                location.pathname === '/gallery' 
                  ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                  : 'text-on-surface-variant hover:text-primary'
              }`} 
              to="/gallery"
            >
              Gallery
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
              <span className="absolute top-0 right-0 bg-primary-container text-on-primary-container text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">2</span>
            </Link>
            <Link to="/shop" className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-md hidden sm:block">ORDER NOW</Link>
            <button className="md:hidden p-2 text-primary">
              <span className="material-symbols-outlined" data-icon="menu">menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main page content wrapper */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant dark:border-outline mt-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-section-gap max-w-container-max mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-3xl text-primary" data-icon="cake">cake</span>
              <span className="font-headline-md text-headline-md text-primary dark:text-primary-fixed-dim font-bold">BloomCakes</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-on-secondary-fixed-variant italic">
              Beautifully Crafted. Happily Celebrated.
            </p>
            <div className="flex gap-4 mt-2">
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined" data-icon="camera_alt">camera_alt</span>
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined" data-icon="facebook">qr_code_2</span>
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined" data-icon="chat">chat</span>
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
