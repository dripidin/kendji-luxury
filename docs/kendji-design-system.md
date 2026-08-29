# KenDji Luxury Design System

## Visual Direction: Modern Monochrome Luxury

The design system embodies **Modern Monochrome Luxury**, prioritizing architectural precision, spatial rhythm, and material excellence. It is designed for a discerning, high-net-worth audience that values restraint over excess.

The aesthetic is a fusion of **Minimalism** and **High-Contrast Editorial**. It leans heavily on negative space to elevate products to the status of art objects.

### Colors
- **Ivory Canvas (#F9F9F7):** A clean, warm-white canvas that prevents the clinical feel of pure white.
- **Charcoal (#1A1A1A):** Provides structural weight, used for all primary typography, borders, and high-impact background blocks.
- **Rose Gold (#E5C1B3):** Used with extreme restraint as a "metallic light", reserved for micro-interactions, subtle highlights, and high-value indicators.

### Typography
- **Headlines (Bodoni Moda):** Utilized for large-scale storytelling and product titles. Its high contrast mimics the facets of a gemstone.
- **Body & Functional (Montserrat):** Handles all functional UI and body copy, often with generous tracking in uppercase to evoke signage of luxury boutiques.

### Layout & Spacing
- **Fixed Grid (Desktop):** 12-column grid, prioritizing wide "luxury gutters".
- **Generous Margins:** 80px on desktop, 160px+ section gaps.

### Elevation & Depth
- **Tonal Layers & Sharp Borders:** Rejects traditional shadows in favor of 1px solid borders with 10-20% opacity.
- **Materiality:** Interactive elements should feel grounded and heavy.

### Shapes
- **Sharp (0px):** Rectilinear containers, square-edged buttons, and sharp-cornered input fields reinforce the precision-cut nature of high jewelry.

## Storefront Global Guidelines (Phase 07)

### Storefront Layout
- The public storefront operates entirely independently from the Admin CMS.
- Every storefront page is wrapped by a shared `<StorefrontHeader>` and `<StorefrontFooter>`.
- Content should utilize the reusable `<Container>` (for constrained horizontal padding and max-width) and `<Section>` (for consistent vertical rhythm and full-bleed support) components.

### Header & Navigation
- The navigation structure prioritizes simple discovery: Shop, Categories, and Collections.
- **Scroll Behavior:** The header utilizes a subtle transition, maintaining a transparent overlay when at the very top of the homepage to support full-bleed editorial assets, and shifting to a solid Ivory background on scroll for legibility.
- **Triggers:** Search and Cart are implemented as lightweight visual icon entry points, avoiding heavy mega-menus or immediately opened drawers by default.

### Responsive Conventions
- **Desktop (Primary):** Max container width of 1440px with generous 80px (`px-20`) padding.
- **Mobile:** Horizontal padding reduces to 24px (`px-6`). Focus shifts to simple navigation, large readable typography, and accessible touch targets (e.g. mobile hamburger menu with full-screen takeover).
- Hierarchy and spacing rhythm are preserved proportionally across breakpoints.

### Accessibility
- Focus states and keyboard navigation must be maintained for all interactive elements.
- Semantic HTML tags (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`) define structure.
- Accessible aria-labels are applied to icon-only triggers (Mobile Menu, Search, Cart).

### Motion
- **Subtle & Intentional:** Motion is restricted to brief transitions (opacity, subtle scaling on hover for product images). 
- Avoid over-animation; the luxury feel comes from instantaneous solidity rather than bouncy or long transitions.
