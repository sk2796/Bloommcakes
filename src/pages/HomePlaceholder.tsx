import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function HomePlaceholder() {
  useEffect(() => {
    // Left empty since scroll events are handled globally on navigation elements
  }, [])

  return (
    <div className="bg-background text-on-background">
      {/* Hero Section */}
      <header className="relative pt-12 pb-24 lg:pt-24 lg:pb-32 overflow-hidden bg-gradient-to-br from-surface to-surface-container-low animate-fade-in">
        <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <h1 className="font-headline-xl text-headline-xl text-primary max-w-2xl mx-auto lg:mx-0">
              <span className="block text-on-surface font-light italic mb-2">Beautifully Crafted.</span>
              Happily Celebrated.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto lg:mx-0">
              From everyday moments to life's biggest celebrations, we craft artisanal cakes and desserts that make every moment bloom with flavor and joy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
              <Link to="/shop" className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-lg flex items-center justify-center gap-2">
                ORDER NOW
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
              <Link to="/shop" className="border-2 border-primary text-primary px-8 py-3 rounded-full font-label-md text-label-md hover:bg-primary/5 transition-colors flex items-center justify-center">
                EXPLORE MENU
              </Link>
            </div>
            <div className="flex justify-center lg:justify-start gap-8 mt-8 opacity-80">
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-primary">eco</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant text-center">Premium<br/>Ingredients</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-primary">favorite</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant text-center">Made<br/>with Love</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-primary">bakery_dining</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant text-center">Freshly<br/>Baked</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-green-600 font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant text-center">100% Pure<br/>Veg Only</span>
              </div>
            </div>
          </div>
          <div className="relative w-full aspect-square max-w-lg mx-auto">
            <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-3xl scale-90"></div>
            <img 
              className="w-full h-full object-cover rounded-full soft-shadow relative z-10 border-8 border-surface transform hover:scale-105 transition-transform duration-700" 
              alt="A spectacular celebration cake"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo24FowZT4dx61_yrgUcj5_C8U2l7zG4e6WCTDMEFvSLEouWlqsu_xi4gaIZlKmxqbsL2jhCNQD-rCFJrN_8MPldEOEE1qUDNCfdAseQ6N4NkoWv0SSkAMSlqiH0Ce-WSjzrjRt8Lc6B1glKPOmwwka2RHWt4hfSMc1A8JXE9usy-k_oCUlTKNrS-mabM-kvFOMilVpvR0gyV69Wu6Sdbua9qjrKFnPDhGGS-6iiZo-Vtb6FrIKMsc"
            />
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 glass-panel rounded-full p-4 flex flex-col items-center justify-center w-28 h-28 shadow-xl z-20 animate-bounce" style={{ animationDuration: '3s' }}>
              <span className="text-primary font-headline-md text-headline-md font-bold leading-none">5k+</span>
              <span className="text-on-surface-variant font-label-sm text-label-sm text-center leading-tight mt-1">Happy<br/>Customers</span>
            </div>
          </div>
        </div>
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-container/10 to-transparent pointer-events-none"></div>
      </header>

      {/* Trust Banner */}
      <div className="bg-primary/5 py-6 border-y border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            <span className="font-label-md text-label-md text-on-surface">Same Day Delivery</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-primary">health_and_safety</span>
            <span className="font-label-md text-label-md text-on-surface">Safe &amp; Hygienic</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-primary">cake</span>
            <span className="font-label-md text-label-md text-on-surface">Custom Occasions</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-primary">verified_user</span>
            <span className="font-label-md text-label-md text-on-surface">Secure Payments</span>
          </div>
        </div>
      </div>

      {/* Signature Collection (Horizontal Scroll) */}
      <section className="py-section-gap bg-surface">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="text-center mb-12">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Our Signature Collection</h2>
            <div className="flex items-center justify-center gap-2 text-primary">
              <div className="h-px w-12 bg-primary/30"></div>
              <span className="material-symbols-outlined text-sm">favorite</span>
              <div className="h-px w-12 bg-primary/30"></div>
            </div>
          </div>
          <div className="relative">
            <div className="flex overflow-x-auto gap-6 pb-8 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
              {/* Card 1 */}
              <div className="min-w-[280px] w-[280px] snap-center bg-surface-container-lowest rounded-2xl p-4 soft-shadow hover:shadow-lg transition-shadow group">
                <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-surface-container flex items-center justify-center p-4">
                  <img 
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500" 
                    alt="Belgian Chocolate cake"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuApZkJY6QschRPOB3x6-l8poxgy8aQmmu6tGSdCweuEr9GNxx80MjOyL-V6aPDgzTXkEnt9bEzdyvHM3ga5_WHNlz99MLqqUyBTHztAdF_idQhxFek4LpY-SmLqxAfqyqVxVny-1zqHSV2-gzfj4fTrvflbGADllc3ezN69kDBRlwKBGK0zMgF6JYbTMKgXCd5-z5NpSN_aixjKyGNho7lOOpf1I9w80b4lx0UvbJtdmE8ScIVfKKtY"
                  />
                </div>
                <h3 className="font-label-md text-label-md text-on-surface text-center mb-1">Belgian Chocolate</h3>
                <p className="text-primary text-center font-bold">₹799</p>
              </div>
              {/* Card 2 */}
              <div className="min-w-[280px] w-[280px] snap-center bg-surface-container-lowest rounded-2xl p-4 soft-shadow hover:shadow-lg transition-shadow group">
                <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-surface-container flex items-center justify-center p-4">
                  <img 
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500" 
                    alt="Red Velvet cake"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRETRfPtfP-bA2VzWu7WPbBxbhNYY76Q1TcRPWK3-1uePZp3K7FTHbOseYXPGLtmZMnkanxiOD87rQA0RemZpgdYi97UuWcAQMXFt69fXeVf0vwG8PPIGcen0XTGcLPdyxQsTr0FEBRrLj8ol-Pb2sUfyZqju1v2Mp6HABFVwkXaygqIU4QCIwkGa1fet73QovnbVHj1zVI7GYgAx88F8cSF66dqKjwCzVW-meuvpmB1AhE_l5joSO"
                  />
                </div>
                <h3 className="font-label-md text-label-md text-on-surface text-center mb-1">Red Velvet</h3>
                <p className="text-primary text-center font-bold">₹899</p>
              </div>
              {/* Card 3 */}
              <div className="min-w-[280px] w-[280px] snap-center bg-surface-container-lowest rounded-2xl p-4 soft-shadow hover:shadow-lg transition-shadow group">
                <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-surface-container flex items-center justify-center p-4">
                  <img 
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500" 
                    alt="Butterscotch Crunch cake"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5SWy7Qb6lqjOSFNcx6Uwk_csTMEYN27Hz5UU6BNCYyyP9eRfO32aVA4mxwePVyXvwEL-KL-BieXmP_yx0xe2RKPhqF1PmkdNxqao4CSfuXuzomKbfs4i2FeC4wLa-eD7NcOD3iocw8XrmDUWJPumldtnptojchgKRsQOcKdNco4gjtJl2U3cg0kzrQBZi46c-wgkJWwY_spYT3BBCzCrSaXlni_8cKqA0UkGyD1np9xUDfGYhIwbE"
                  />
                </div>
                <h3 className="font-label-md text-label-md text-on-surface text-center mb-1">Butterscotch Crunch</h3>
                <p className="text-primary text-center font-bold">₹749</p>
              </div>
              {/* Card 4 */}
              <div className="min-w-[280px] w-[280px] snap-center bg-surface-container-lowest rounded-2xl p-4 soft-shadow hover:shadow-lg transition-shadow group">
                <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-surface-container flex items-center justify-center p-4">
                  <img 
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500" 
                    alt="Blueberry Cheesecake"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdx960xx5hnckATCpxOit7JMiNmp3wfnsQCXlJK3sCQDEdDETTHq7li5kRsBZwgyE7xa0TNAGJFZTehhmbUVjEySFFC6lmT6nxjwpNxoGrRaTAnx4j9PJLIhvyiIPVpOGUdTtLUF7yFFCDH_4-V8AETSibCU4NLfEUbPRI7ls0Z8T_9FTeeXtHuUhivZDLAWikMSltarpEgZApbhwkjhuUA1499xI1Wz4PjgaVyDEsPB6Wd81lC_Mh"
                  />
                </div>
                <h3 className="font-label-md text-label-md text-on-surface text-center mb-1">Blueberry Cheesecake</h3>
                <p className="text-primary text-center font-bold">₹999</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link to="/shop" className="border-2 border-outline text-on-surface px-8 py-2 rounded-full font-label-md text-label-md hover:bg-surface-container transition-colors inline-block">
                VIEW ALL
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Cake Banner */}
      <section className="py-12 bg-surface">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="bg-gradient-to-r from-primary to-surface-tint rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden soft-shadow">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none"></div>
            <div className="relative z-10 text-center md:text-left text-on-primary mb-8 md:mb-0 md:w-1/2">
              <h2 className="font-headline-lg text-headline-lg mb-4">Custom Cake for<br/>Every Celebration!</h2>
              <p className="font-body-md text-body-md opacity-90 mb-6">Birthday | Anniversary | Wedding | Corporate</p>
              <Link to="/custom-cake" className="bg-surface-container-lowest text-primary px-6 py-2 rounded-full font-label-md text-label-md hover:bg-surface transition-colors shadow-md inline-block">
                ORDER CUSTOM CAKE
              </Link>
            </div>
            <div className="relative z-10 md:w-1/2 flex justify-center md:justify-end">
              <div className="w-64 h-64 md:w-80 md:h-80 relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
                <img 
                  className="w-full h-full object-contain relative z-10 drop-shadow-2xl" 
                  alt="Custom celebration cake design showcase"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWAGPl05WO82u_W2MYmijYeb_UUXtt0Ir7w_93OIStop9JXN21OJGU2Z1ktUNCIz1wT43yDbx-5FsgYYNjENemUB9Nc-Ecfrj4OgbUx_VZWLUVWv0dRf7IASDg5OVaByHjedyyu7K5LOD0IKXUn6e1Hy4MrH1eAgBpgEANxyAuVpmjA7QcFH62RGKJSRQ0HJXJBg4ggK7Buo0VG7BtpEagcqAIXkEJNslvoc-LUMwHNRrKL7UeY87h"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
