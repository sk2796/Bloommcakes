import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  name?: string
  type?: string
  image?: string
  url?: string
}

export function SEO({
  title = 'BloomCakes | Beautifully Crafted. Happily Celebrated.',
  description = 'Order fresh, artisanal birthday cakes, wedding cakes, and custom desserts online. Fast delivery in your city. Crafted with love and the finest ingredients.',
  name = 'BloomCakes',
  type = 'website',
  image = 'https://res.cloudinary.com/bloomcakes/image/upload/v1/og-banner.jpg', // Placeholder optimized image
  url = 'https://bloomcakes.in' // Replace with actual domain when live
}: SEOProps) {
  
  const schemaOrgJSONLD = {
    "@context": "http://schema.org",
    "@type": "Bakery",
    "name": name,
    "description": description,
    "url": url,
    "image": image,
    "priceRange": "₹₹",
    "servesCuisine": "Desserts, Cakes, Bakery",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "IN"
    }
  }

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* OpenGraph tags for Facebook, LinkedIn, WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={name} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>
    </Helmet>
  )
}
