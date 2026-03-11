# MAKI Sushi Website - Design Spec

## Overview

Single-page restaurant website for MAKI Sushi (Roscommon, Ireland) built with Next.js + Tailwind CSS. Dark minimalist theme with orange/salmon accents. Simulated online ordering and table reservation with n8n webhook integration points.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Fonts**: Inter (body/headings), Outfit (brand accent)
- **Deploy**: Any Node.js host (Vercel recommended)

## Visual Design

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| bg-primary | `#0A0A0A` | Page background |
| bg-surface | `#1A1A1A` | Cards, modals |
| accent | `#F97316` | Primary orange (buttons, highlights) |
| accent-light | `#FDBA74` | Secondary salmon (hover, subtle accents) |
| text-primary | `#F5F5F5` | Headings, body text |
| text-secondary | `#A3A3A3` | Muted text, labels |

### Typography

- Headings: Inter Bold
- Body: Inter Regular
- Brand/Logo: Outfit Bold

### Logo

- SVG reimagination of the circular salmon-stripe logo
- Navbar: 40px height, left-aligned
- Hero: 120px height, centered
- File: `public/logo.svg`
- Fallback: `public/logo.png`

### Accessibility

- All color combinations meet WCAG AA contrast ratio (4.5:1 minimum)
- `text-secondary` (#A3A3A3) on `bg-primary` (#0A0A0A) = 9.6:1 (passes)
- Focus states: 2px solid `#F97316` outline on all interactive elements
- Keyboard navigation supported (Tab, Enter, Escape for modals)

## Page Structure

Single page with smooth scroll navigation. 7 sections + 2 modals.

### 1. Navbar (sticky)

- Logo (left)
- Nav links: About, Menu, Reviews, Gallery, Contact (center)
- "Order Online" button (right, accent color)

### 2. Hero Section

- Full-viewport height
- Background image: `hero-bg.jpg` (sushi spread, darkened overlay)
- Centered: Logo + "MAKI Sushi" + tagline "Fresh Japanese Cuisine in Roscommon"
- Two CTA buttons: "Order Online" (opens modal), "Reserve a Table" (opens modal)

### 3. About Section

- Brief description of the restaurant
- Key info cards: Location, Hours, Price Range (EUR 20-30), Service types (Dine-in, Takeaway, Contactless Delivery)
- Address: The Square, Ardnanagh, Roscommon, F42 NN90

**Hours:**
- Thu-Sun: 13:00 - 21:00
- Mon-Wed: Closed

### 4. Menu Section

- Category tabs: Sushi Rolls, Nigiri, Starters, Specials, Desserts
- Grid of cards per category, each card: image, name, description, price
- "View Full Menu" link to drive.google.com (external)

**Menu Items:**

| Category | Item | Price |
|----------|------|-------|
| Sushi Rolls | Salmon Roll | EUR 8 |
| Sushi Rolls | Tuna Roll | EUR 9 |
| Sushi Rolls | California Roll | EUR 7 |
| Sushi Rolls | Dragon Roll | EUR 12 |
| Sushi Rolls | Veggie Roll | EUR 7 |
| Nigiri | Salmon Nigiri | EUR 6 |
| Nigiri | Tuna Nigiri | EUR 7 |
| Nigiri | Prawn Nigiri | EUR 7 |
| Nigiri | Eel Nigiri | EUR 8 |
| Starters | Gyoza (6pc) | EUR 7 |
| Starters | Edamame | EUR 5 |
| Starters | Miso Soup | EUR 4 |
| Starters | Prawn Tempura | EUR 9 |
| Specials | Sashimi Platter | EUR 18 |
| Specials | Maki Combo | EUR 22 |
| Specials | Chef's Special | EUR 25 |
| Desserts | Brownie | EUR 6 |
| Desserts | Mochi Ice Cream | EUR 5 |
| Desserts | Matcha Cheesecake | EUR 7 |

### 5. Reviews Section

- Large "4.8" rating display with 80 reviews count
- Star visualization
- Carousel of 3 review cards:
  1. Thays Rodrigues: "Fresh and wonderful food, excellent service, cozy atmosphere."
  2. Warwick Tours Switzerland: "Sushi was really delicious. Went three times in one week."
  3. Grainne C: "If you love sushi, this is the place! Great selection at a great price."
- "See all reviews on Google" link

### 6. Gallery Section

- 6-image responsive grid (3x2 desktop, 2x3 tablet, 1x6 mobile)
- Placeholder images: `gallery-1.jpg` through `gallery-6.jpg`
- Lightbox on click: single image view with prev/next arrows, close button (X), Escape key to close, arrow keys to navigate. No preloading.

### 7. Contact Section

- Google Maps embed (Roscommon location)
- Contact info: phone (083 026 0220), address, website (themakisushi.com)
- Opening hours summary

### 8. Footer

- Logo, copyright
- Quick links: Menu, Order, Reserve, Contact
- Social media: Instagram, Facebook, TikTok (placeholder URLs, easy to replace)
- All external links open in new tab with `rel="noopener noreferrer"`

## Modals

### Order Online Modal

**UX Flow:**
1. User clicks "Order Online" -> modal opens
2. Step 1: Select order type (Delivery / Takeaway radio buttons)
3. Step 2: Browse menu items in a scrollable list grouped by category. Each item has a +/- counter to add quantity. Selected items appear in a cart sidebar within the modal.
4. Step 3: Cart review showing items, quantities, unit prices, total. User can adjust quantities or remove items.
5. Step 4: Customer details form (see fields below)
6. Submit

**Form fields:**
- Customer name (required, 2-100 chars)
- Phone (required, Irish format: 08x xxx xxxx or international +353)
- Delivery address (conditional, required for delivery, free text)
- Notes (optional, max 500 chars)

**Cart clears when modal closes.**

**On submit:**
- POST to n8n webhook URL
- Success: show toast (top-right, 5s auto-dismiss, accent orange): "Order received! We'll contact you shortly."
- Error (network/webhook fail): show toast (red): "Something went wrong. Please call us at 083 026 0220."
- Simulated mode (N8N_ENABLED=false): skip POST, show success toast anyway

### Reserve a Table Modal

**Form fields:**
- Date (date picker, min: tomorrow, only Thu-Sun selectable, Mon-Wed disabled)
- Time (select, 30-min intervals: 13:00, 13:30, ... 20:00. Last slot 20:00 to allow dining before 21:00 close)
- Number of guests (1-10, select)
- Name (required, 2-100 chars)
- Phone (required, Irish format: 08x xxx xxxx or international +353)
- Email (optional, standard email validation)
- Special requests (optional, max 500 chars)

**Validation rules:**
- Date must be at least tomorrow (no same-day reservations)
- Date must be Thu, Fri, Sat, or Sun
- Time within 13:00-20:00 range
- If all validations fail, show inline error below the field

**On submit:**
- POST to n8n webhook URL
- Success: toast (top-right, 5s, accent orange): "Reservation confirmed! We'll send you a confirmation."
- Error: toast (red): "Something went wrong. Please call us at 083 026 0220."
- Simulated mode (N8N_ENABLED=false): skip POST, show success toast anyway

## n8n Integration

### Configuration

Centralized in `lib/config.ts`:

```typescript
export const N8N_CONFIG = {
  // ============================================
  // TODO: n8n Integration Point
  // Replace these URLs with your n8n webhook URLs
  // ============================================
  ORDER_WEBHOOK_URL: process.env.NEXT_PUBLIC_N8N_ORDER_WEBHOOK || "",
  RESERVE_WEBHOOK_URL: process.env.NEXT_PUBLIC_N8N_RESERVE_WEBHOOK || "",
  ENABLED: process.env.NEXT_PUBLIC_N8N_ENABLED === "true",
};
```

### Order Webhook Payload

```json
{
  "type": "order",
  "orderType": "delivery | takeaway",
  "items": [{ "name": "string", "quantity": "number", "price": "number" }],
  "customer": { "name": "string", "phone": "string", "address": "string?" },
  "notes": "string",
  "total": "number",
  "createdAt": "ISO 8601"
}
```

### Reservation Webhook Payload

```json
{
  "type": "reservation",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "guests": "number",
  "customer": { "name": "string", "phone": "string", "email": "string?" },
  "notes": "string",
  "createdAt": "ISO 8601"
}
```

### Suggested n8n Workflows

Comments in code will suggest:
- Order: webhook receive -> validate -> notify owner (WhatsApp/Email) -> confirm to customer
- Reserve: webhook receive -> check availability -> notify owner -> send confirmation

## Placeholder Images

All in `public/images/`, easy names for replacement:

| File | Usage |
|------|-------|
| `hero-bg.jpg` | Hero background |
| `salmon-roll.jpg` | Salmon Roll menu item |
| `tuna-roll.jpg` | Tuna Roll menu item |
| `california-roll.jpg` | California Roll menu item |
| `dragon-roll.jpg` | Dragon Roll menu item |
| `veggie-roll.jpg` | Veggie Roll menu item |
| `salmon-nigiri.jpg` | Salmon Nigiri |
| `tuna-nigiri.jpg` | Tuna Nigiri |
| `prawn-nigiri.jpg` | Prawn Nigiri |
| `eel-nigiri.jpg` | Eel Nigiri |
| `gyoza.jpg` | Gyoza |
| `edamame.jpg` | Edamame |
| `miso-soup.jpg` | Miso Soup |
| `prawn-tempura.jpg` | Prawn Tempura |
| `sashimi-platter.jpg` | Sashimi Platter |
| `maki-combo.jpg` | Maki Combo |
| `chefs-special.jpg` | Chef's Special |
| `brownie.jpg` | Brownie |
| `mochi.jpg` | Mochi Ice Cream |
| `matcha-cheesecake.jpg` | Matcha Cheesecake |
| `gallery-1.jpg` to `gallery-6.jpg` | Gallery section |

## File Structure

```
themaki/
  public/
    images/          # All placeholder images
    logo.svg         # Reimagined logo
  src/
    app/
      layout.tsx     # Root layout with fonts, metadata
      page.tsx       # Main page composing all sections
      globals.css    # Tailwind + custom styles
    components/
      Navbar.tsx
      Hero.tsx
      About.tsx
      Menu.tsx
      Reviews.tsx
      Gallery.tsx
      Contact.tsx
      Footer.tsx
      OrderModal.tsx
      ReserveModal.tsx
      ui/            # Reusable UI (Button, Modal, Toast, Card)
    lib/
      config.ts      # n8n webhook URLs + feature flags
      menu-data.ts   # Menu items data
      reviews-data.ts # Reviews data
      types.ts       # TypeScript types
      webhook.ts     # Webhook submission helper
  .env.example       # Environment variable template
  tailwind.config.ts
  package.json
```

## Responsive Breakpoints

- Mobile: < 640px (single column, stacked)
- Tablet: 640-1024px (2 columns)
- Desktop: > 1024px (full layout)

## SEO & Meta

- Title: "MAKI Sushi | Fresh Japanese Cuisine in Roscommon"
- Description: "Order sushi online or reserve a table at MAKI Sushi, Roscommon. Fresh, delicious Japanese cuisine. Dine-in, takeaway & contactless delivery."
- Open Graph tags with hero image
- Structured data (Restaurant schema)

## Out of Scope

- Real payment processing
- User authentication
- Admin panel
- Real-time order tracking
- Multi-language support
