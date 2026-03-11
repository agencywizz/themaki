# MAKI Sushi Website Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page restaurant website for MAKI Sushi with simulated online ordering and table reservation, integrated with n8n webhooks.

**Architecture:** Next.js 14+ App Router with Tailwind CSS. Single page composed of section components. Two modal components for ordering and reservations. Centralized n8n webhook config with env vars. All data (menu, reviews) stored as TypeScript constants.

**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Inter + Outfit fonts (Google Fonts via next/font)

**Spec:** `docs/superpowers/specs/2026-03-11-maki-sushi-website-design.md`

---

## File Map

| File | Responsibility |
|------|---------------|
| `src/lib/types.ts` | All TypeScript types (MenuItem, Review, CartItem, OrderPayload, ReservationPayload) |
| `src/lib/config.ts` | n8n webhook URLs, feature flags from env vars |
| `src/lib/menu-data.ts` | Menu items array with categories, names, prices, descriptions, image paths |
| `src/lib/reviews-data.ts` | Reviews array with author, text, rating |
| `src/lib/webhook.ts` | submitOrder() and submitReservation() functions that POST to n8n |
| `src/components/ui/Button.tsx` | Reusable button (primary/secondary/ghost variants) |
| `src/components/ui/Modal.tsx` | Reusable modal with overlay, close on Escape, focus trap |
| `src/components/ui/Toast.tsx` | Toast notification system (top-right, 5s auto-dismiss) |
| `src/components/ui/Card.tsx` | Reusable card component for menu items, info cards |
| `src/components/Navbar.tsx` | Sticky navbar with logo, nav links, order button |
| `src/components/Hero.tsx` | Fullscreen hero with bg image, logo, CTAs |
| `src/components/About.tsx` | Restaurant info cards (location, hours, price, services) |
| `src/components/Menu.tsx` | Category tabs + menu item grid |
| `src/components/Reviews.tsx` | Rating display + review carousel |
| `src/components/Gallery.tsx` | Image grid + lightbox |
| `src/components/Contact.tsx` | Google Maps embed + contact info |
| `src/components/Footer.tsx` | Links, social icons, copyright |
| `src/components/OrderModal.tsx` | Multi-step order form with cart |
| `src/components/ReserveModal.tsx` | Reservation form with date/time validation |
| `src/app/layout.tsx` | Root layout, fonts, metadata, SEO |
| `src/app/page.tsx` | Main page composing all sections |
| `src/app/globals.css` | Tailwind directives + custom CSS |
| `public/logo.svg` | Reimagined circular salmon-stripe logo |
| `public/images/` | All placeholder images |
| `.env.example` | Environment variable template |
| `tailwind.config.ts` | Custom colors, fonts, breakpoints |

---

## Chunk 1: Project Setup & Foundation

### Task 1: Scaffold Next.js Project

- [ ] **Step 1: Create Next.js project**

```bash
cd /Users/juniordameto/Documents/projects/themaki
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Select: Yes to all defaults. App Router, src/ directory, Tailwind, TypeScript, ESLint.

- [ ] **Step 2: Verify project runs**

```bash
npm run dev
```

Expected: Dev server starts at http://localhost:3000, default Next.js page loads.

- [ ] **Step 3: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js project with Tailwind and TypeScript"
```

### Task 2: Configure Tailwind Theme & Fonts

- [ ] **Step 1: Install Outfit font**

Next.js has `next/font` built in. No install needed. Both Inter and Outfit are Google Fonts available via `next/font/google`.

- [ ] **Step 2: Update `tailwind.config.ts`**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0A0A0A",
        "bg-surface": "#1A1A1A",
        accent: "#F97316",
        "accent-light": "#FDBA74",
        "text-primary": "#F5F5F5",
        "text-secondary": "#A3A3A3",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        brand: ["var(--font-outfit)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 3: Update `src/app/layout.tsx` with fonts and metadata**

```typescript
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "MAKI Sushi | Fresh Japanese Cuisine in Roscommon",
  description:
    "Order sushi online or reserve a table at MAKI Sushi, Roscommon. Fresh, delicious Japanese cuisine. Dine-in, takeaway & contactless delivery.",
  openGraph: {
    title: "MAKI Sushi | Fresh Japanese Cuisine in Roscommon",
    description:
      "Order sushi online or reserve a table at MAKI Sushi, Roscommon.",
    images: ["/images/hero-bg.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-bg-primary text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Update `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  *:focus-visible {
    outline: 2px solid #F97316;
    outline-offset: 2px;
  }
}
```

- [ ] **Step 5: Verify dev server shows dark background**

```bash
npm run dev
```

Expected: Page has dark `#0A0A0A` background.

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.ts src/app/layout.tsx src/app/globals.css
git commit -m "feat: configure Tailwind theme with dark palette and custom fonts"
```

### Task 3: Create Types & Data Files

- [ ] **Step 1: Create `src/lib/types.ts`**

```typescript
export interface MenuItem {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: MenuCategory;
  readonly image: string;
}

export type MenuCategory =
  | "Sushi Rolls"
  | "Nigiri"
  | "Starters"
  | "Specials"
  | "Desserts";

export interface CartItem {
  readonly item: MenuItem;
  readonly quantity: number;
}

export interface Review {
  readonly id: string;
  readonly author: string;
  readonly text: string;
  readonly rating: number;
}

export type OrderType = "delivery" | "takeaway";

export interface OrderPayload {
  readonly type: "order";
  readonly orderType: OrderType;
  readonly items: ReadonlyArray<{
    readonly name: string;
    readonly quantity: number;
    readonly price: number;
  }>;
  readonly customer: {
    readonly name: string;
    readonly phone: string;
    readonly address?: string;
  };
  readonly notes: string;
  readonly total: number;
  readonly createdAt: string;
}

export interface ReservationPayload {
  readonly type: "reservation";
  readonly date: string;
  readonly time: string;
  readonly guests: number;
  readonly customer: {
    readonly name: string;
    readonly phone: string;
    readonly email?: string;
  };
  readonly notes: string;
  readonly createdAt: string;
}
```

- [ ] **Step 2: Create `src/lib/config.ts`**

```typescript
// ============================================
// TODO: n8n Integration Point
// Replace these URLs with your n8n webhook URLs
// Workflow suggestion for orders:
//   webhook receive -> validate -> notify owner (WhatsApp/Email) -> confirm to customer
// Workflow suggestion for reservations:
//   webhook receive -> check availability -> notify owner -> send confirmation
// ============================================
export const N8N_CONFIG = {
  ORDER_WEBHOOK_URL: process.env.NEXT_PUBLIC_N8N_ORDER_WEBHOOK || "",
  RESERVE_WEBHOOK_URL: process.env.NEXT_PUBLIC_N8N_RESERVE_WEBHOOK || "",
  ENABLED: process.env.NEXT_PUBLIC_N8N_ENABLED === "true",
} as const;

export const RESTAURANT_INFO = {
  name: "MAKI Sushi",
  tagline: "Fresh Japanese Cuisine in Roscommon",
  address: "The Square, Ardnanagh, Roscommon, F42 NN90",
  phone: "083 026 0220",
  website: "https://themakisushi.com",
  googleMapsQuery: "MAKI+Sushi+Roscommon",
  priceRange: "€20–30",
  rating: 4.8,
  totalReviews: 80,
  hours: {
    open: "13:00",
    close: "21:00",
    days: "Thu–Sun",
    closedDays: "Mon–Wed",
  },
  social: {
    // TODO: Replace with actual social media URLs
    instagram: "https://instagram.com/makisushi",
    facebook: "https://facebook.com/makisushi",
    tiktok: "https://tiktok.com/@makisushi",
  },
} as const;
```

- [ ] **Step 3: Create `src/lib/menu-data.ts`**

```typescript
import { MenuItem } from "./types";

export const MENU_ITEMS: ReadonlyArray<MenuItem> = [
  { id: "salmon-roll", name: "Salmon Roll", description: "Fresh salmon, avocado, cucumber, sesame seeds", price: 8, category: "Sushi Rolls", image: "/images/salmon-roll.jpg" },
  { id: "tuna-roll", name: "Tuna Roll", description: "Premium tuna, spring onion, spicy mayo", price: 9, category: "Sushi Rolls", image: "/images/tuna-roll.jpg" },
  { id: "california-roll", name: "California Roll", description: "Crab stick, avocado, cucumber, tobiko", price: 7, category: "Sushi Rolls", image: "/images/california-roll.jpg" },
  { id: "dragon-roll", name: "Dragon Roll", description: "Eel, avocado, cucumber, unagi sauce", price: 12, category: "Sushi Rolls", image: "/images/dragon-roll.jpg" },
  { id: "veggie-roll", name: "Veggie Roll", description: "Avocado, cucumber, carrot, asparagus", price: 7, category: "Sushi Rolls", image: "/images/veggie-roll.jpg" },
  { id: "salmon-nigiri", name: "Salmon Nigiri", description: "Two pieces of fresh salmon over rice", price: 6, category: "Nigiri", image: "/images/salmon-nigiri.jpg" },
  { id: "tuna-nigiri", name: "Tuna Nigiri", description: "Two pieces of premium tuna over rice", price: 7, category: "Nigiri", image: "/images/tuna-nigiri.jpg" },
  { id: "prawn-nigiri", name: "Prawn Nigiri", description: "Two pieces of cooked prawn over rice", price: 7, category: "Nigiri", image: "/images/prawn-nigiri.jpg" },
  { id: "eel-nigiri", name: "Eel Nigiri", description: "Two pieces of grilled eel over rice", price: 8, category: "Nigiri", image: "/images/eel-nigiri.jpg" },
  { id: "gyoza", name: "Gyoza (6pc)", description: "Pan-fried pork and vegetable dumplings", price: 7, category: "Starters", image: "/images/gyoza.jpg" },
  { id: "edamame", name: "Edamame", description: "Steamed soybeans with sea salt", price: 5, category: "Starters", image: "/images/edamame.jpg" },
  { id: "miso-soup", name: "Miso Soup", description: "Traditional miso with tofu and wakame", price: 4, category: "Starters", image: "/images/miso-soup.jpg" },
  { id: "prawn-tempura", name: "Prawn Tempura", description: "Crispy battered prawns with dipping sauce", price: 9, category: "Starters", image: "/images/prawn-tempura.jpg" },
  { id: "sashimi-platter", name: "Sashimi Platter", description: "Chef's selection of premium raw fish", price: 18, category: "Specials", image: "/images/sashimi-platter.jpg" },
  { id: "maki-combo", name: "Maki Combo", description: "Assorted maki rolls with miso soup", price: 22, category: "Specials", image: "/images/maki-combo.jpg" },
  { id: "chefs-special", name: "Chef's Special", description: "Daily special curated by our chef", price: 25, category: "Specials", image: "/images/chefs-special.jpg" },
  { id: "brownie", name: "Brownie", description: "Rich chocolate brownie with ice cream", price: 6, category: "Desserts", image: "/images/brownie.jpg" },
  { id: "mochi", name: "Mochi Ice Cream", description: "Assorted Japanese rice cake ice cream", price: 5, category: "Desserts", image: "/images/mochi.jpg" },
  { id: "matcha-cheesecake", name: "Matcha Cheesecake", description: "Creamy matcha-flavored cheesecake", price: 7, category: "Desserts", image: "/images/matcha-cheesecake.jpg" },
];

export const MENU_CATEGORIES = [
  "Sushi Rolls",
  "Nigiri",
  "Starters",
  "Specials",
  "Desserts",
] as const;
```

- [ ] **Step 4: Create `src/lib/reviews-data.ts`**

```typescript
import { Review } from "./types";

export const REVIEWS: ReadonlyArray<Review> = [
  {
    id: "review-1",
    author: "Thays Rodrigues",
    text: "Fresh and wonderful food, excellent service, cozy atmosphere. My husband and I will definitely come back.",
    rating: 5,
  },
  {
    id: "review-2",
    author: "Warwick Tours Switzerland",
    text: "The sushi was really delicious. I liked it so much that we went three times in one week. The staff were also very friendly.",
    rating: 5,
  },
  {
    id: "review-3",
    author: "Grainne C",
    text: "If you love sushi, this is the place! Absolutely delicious! Great selection at a great price. The brownie is also wonderful.",
    rating: 5,
  },
];
```

- [ ] **Step 5: Create `src/lib/webhook.ts`**

```typescript
import { N8N_CONFIG } from "./config";
import { OrderPayload, ReservationPayload } from "./types";

interface WebhookResult {
  readonly success: boolean;
  readonly error?: string;
}

export async function submitOrder(
  payload: OrderPayload
): Promise<WebhookResult> {
  if (!N8N_CONFIG.ENABLED) {
    // Simulated mode: pretend success
    return { success: true };
  }

  try {
    const response = await fetch(N8N_CONFIG.ORDER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function submitReservation(
  payload: ReservationPayload
): Promise<WebhookResult> {
  if (!N8N_CONFIG.ENABLED) {
    return { success: true };
  }

  try {
    const response = await fetch(N8N_CONFIG.RESERVE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}
```

- [ ] **Step 6: Create `.env.example`**

```bash
# n8n Webhook Integration
# Set NEXT_PUBLIC_N8N_ENABLED=true when webhooks are configured
NEXT_PUBLIC_N8N_ENABLED=false
NEXT_PUBLIC_N8N_ORDER_WEBHOOK=https://your-n8n-instance.com/webhook/maki-order
NEXT_PUBLIC_N8N_RESERVE_WEBHOOK=https://your-n8n-instance.com/webhook/maki-reserve
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/ .env.example
git commit -m "feat: add types, data files, config, and webhook helpers"
```

### Task 4: Create Reusable UI Components

- [ ] **Step 1: Create `src/components/ui/Button.tsx`**

```typescript
"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: "primary" | "secondary" | "ghost";
  readonly size?: "sm" | "md" | "lg";
}

const VARIANTS = {
  primary: "bg-accent hover:bg-accent-light text-bg-primary font-bold",
  secondary:
    "bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-bg-primary",
  ghost: "bg-transparent text-text-secondary hover:text-text-primary",
} as const;

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
} as const;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-lg transition-colors duration-200 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Create `src/components/ui/Modal.tsx`**

```typescript
"use client";

import { useEffect, useCallback, ReactNode } from "react";

interface ModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-bg-surface p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/ui/Toast.tsx`**

```typescript
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Toast {
  readonly id: string;
  readonly message: string;
  readonly variant: "success" | "error";
}

interface ToastContextValue {
  readonly showToast: (message: string, variant: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export function ToastProvider({ children }: { readonly children: ReactNode }) {
  const [toasts, setToasts] = useState<ReadonlyArray<Toast>>([]);

  const showToast = useCallback(
    (message: string, variant: "success" | "error") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-3 rounded-lg shadow-lg text-sm font-medium animate-slide-in ${
              toast.variant === "success"
                ? "bg-accent text-bg-primary"
                : "bg-red-600 text-white"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
```

- [ ] **Step 4: Create `src/components/ui/Card.tsx`**

```typescript
import { ReactNode } from "react";

interface CardProps {
  readonly className?: string;
  readonly children: ReactNode;
}

export function Card({ className = "", children }: CardProps) {
  return (
    <div
      className={`rounded-xl bg-bg-surface p-4 transition-transform hover:scale-[1.02] ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Add slide-in animation to `tailwind.config.ts`**

Add inside `theme.extend`:

```typescript
keyframes: {
  "slide-in": {
    "0%": { transform: "translateX(100%)", opacity: "0" },
    "100%": { transform: "translateX(0)", opacity: "1" },
  },
},
animation: {
  "slide-in": "slide-in 0.3s ease-out",
},
```

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/ tailwind.config.ts
git commit -m "feat: add reusable UI components (Button, Modal, Toast, Card)"
```

### Task 5: Create Logo SVG & Download Placeholder Images

- [ ] **Step 1: Create directory and logo**

```bash
mkdir -p public/images
```

Create `public/logo.svg` — a reimagined circular salmon-stripe logo:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <clipPath id="circle">
      <circle cx="100" cy="100" r="95"/>
    </clipPath>
  </defs>
  <circle cx="100" cy="100" r="95" fill="#F97316"/>
  <g clip-path="url(#circle)">
    <path d="M-10 140 Q50 120 100 130 Q150 140 210 120" stroke="#FDBA74" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M-10 110 Q60 85 110 100 Q160 115 210 90" stroke="#FDBA74" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M-10 80 Q50 60 110 70 Q170 80 210 55" stroke="#FDBA74" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M-10 55 Q60 35 120 45 Q180 55 210 30" stroke="#FDBA74" stroke-width="6" fill="none" stroke-linecap="round"/>
  </g>
  <text x="100" y="175" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="48" fill="#0A0A0A">MAKI</text>
</svg>
```

- [ ] **Step 2: Download placeholder images from Unsplash**

Use `curl` to download placeholder food images. Each image is named with a simple, descriptive filename:

```bash
# Hero background
curl -L "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1920&q=80" -o public/images/hero-bg.jpg

# Sushi Rolls
curl -L "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80" -o public/images/salmon-roll.jpg
curl -L "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&q=80" -o public/images/tuna-roll.jpg
curl -L "https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=600&q=80" -o public/images/california-roll.jpg
curl -L "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=600&q=80" -o public/images/dragon-roll.jpg
curl -L "https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=600&q=80" -o public/images/veggie-roll.jpg

# Nigiri
curl -L "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=600&q=80" -o public/images/salmon-nigiri.jpg
curl -L "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80" -o public/images/tuna-nigiri.jpg
curl -L "https://images.unsplash.com/photo-1620105710446-a8af2e529249?w=600&q=80" -o public/images/prawn-nigiri.jpg
curl -L "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=80" -o public/images/eel-nigiri.jpg

# Starters
curl -L "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80" -o public/images/gyoza.jpg
curl -L "https://images.unsplash.com/photo-1564093497595-593b96d80571?w=600&q=80" -o public/images/edamame.jpg
curl -L "https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=600&q=80" -o public/images/miso-soup.jpg
curl -L "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=600&q=80" -o public/images/prawn-tempura.jpg

# Specials
curl -L "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80" -o public/images/sashimi-platter.jpg
curl -L "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80" -o public/images/maki-combo.jpg
curl -L "https://images.unsplash.com/photo-1540648639573-8c848de23f0a?w=600&q=80" -o public/images/chefs-special.jpg

# Desserts
curl -L "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600&q=80" -o public/images/brownie.jpg
curl -L "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80" -o public/images/mochi.jpg
curl -L "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80" -o public/images/matcha-cheesecake.jpg

# Gallery
curl -L "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80" -o public/images/gallery-1.jpg
curl -L "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80" -o public/images/gallery-2.jpg
curl -L "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&q=80" -o public/images/gallery-3.jpg
curl -L "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800&q=80" -o public/images/gallery-4.jpg
curl -L "https://images.unsplash.com/photo-1562802378-063ec186a863?w=800&q=80" -o public/images/gallery-5.jpg
curl -L "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80" -o public/images/gallery-6.jpg
```

- [ ] **Step 3: Commit**

```bash
git add public/
git commit -m "feat: add logo SVG and placeholder images"
```

---

## Chunk 2: Section Components

### Task 6: Navbar Component

- [ ] **Step 1: Create `src/components/Navbar.tsx`**

```typescript
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/Button";

interface NavbarProps {
  readonly onOrderClick: () => void;
}

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#reviews", label: "Reviews" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
] as const;

export function Navbar({ onOrderClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-bg-primary/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="MAKI Sushi"
              width={40}
              height={40}
              priority
            />
            <span className="font-brand text-xl font-bold text-accent">
              MAKI
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-text-primary transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <Button size="sm" onClick={onOrderClick}>
              Order Online
            </Button>
          </div>

          <button
            className="md:hidden text-text-secondary hover:text-text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button size="sm" onClick={onOrderClick}>
              Order Online
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: add Navbar component with mobile menu"
```

### Task 7: Hero Component

- [ ] **Step 1: Create `src/components/Hero.tsx`**

```typescript
import Image from "next/image";
import { Button } from "./ui/Button";

interface HeroProps {
  readonly onOrderClick: () => void;
  readonly onReserveClick: () => void;
}

export function Hero({ onOrderClick, onReserveClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <Image
        src="/images/hero-bg.jpg"
        alt="MAKI Sushi spread"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 text-center px-4">
        <Image
          src="/logo.svg"
          alt="MAKI Sushi logo"
          width={120}
          height={120}
          className="mx-auto mb-6"
          priority
        />
        <h1 className="font-brand text-5xl md:text-7xl font-bold mb-4">
          MAKI <span className="text-accent">Sushi</span>
        </h1>
        <p className="text-text-secondary text-lg md:text-xl mb-8 max-w-md mx-auto">
          Fresh Japanese Cuisine in Roscommon
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={onOrderClick}>
            Order Online
          </Button>
          <Button size="lg" variant="secondary" onClick={onReserveClick}>
            Reserve a Table
          </Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: add Hero component with CTAs"
```

### Task 8: About Component

- [ ] **Step 1: Create `src/components/About.tsx`**

```typescript
import { Card } from "./ui/Card";
import { RESTAURANT_INFO } from "@/lib/config";

const INFO_CARDS = [
  {
    icon: "📍",
    title: "Location",
    content: RESTAURANT_INFO.address,
  },
  {
    icon: "🕐",
    title: "Hours",
    content: `${RESTAURANT_INFO.hours.days}: ${RESTAURANT_INFO.hours.open} – ${RESTAURANT_INFO.hours.close}`,
    subtitle: `${RESTAURANT_INFO.hours.closedDays}: Closed`,
  },
  {
    icon: "💰",
    title: "Price Range",
    content: `${RESTAURANT_INFO.priceRange} per person`,
  },
  {
    icon: "🍣",
    title: "Services",
    content: "Dine-in · Takeaway · Contactless Delivery",
  },
] as const;

export function About() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          About <span className="text-accent">Us</span>
        </h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-12">
          Experience authentic Japanese cuisine in the heart of Roscommon.
          Every dish is crafted with fresh ingredients and traditional techniques,
          bringing the best of Japan to Ireland.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INFO_CARDS.map((card) => (
            <Card key={card.title} className="text-center">
              <span className="text-4xl mb-3 block">{card.icon}</span>
              <h3 className="font-bold text-lg mb-2">{card.title}</h3>
              <p className="text-text-secondary text-sm">{card.content}</p>
              {"subtitle" in card && card.subtitle && (
                <p className="text-text-secondary text-xs mt-1">
                  {card.subtitle}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/About.tsx
git commit -m "feat: add About component with info cards"
```

### Task 9: Menu Component

- [ ] **Step 1: Create `src/components/Menu.tsx`**

```typescript
"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "./ui/Card";
import { MENU_ITEMS, MENU_CATEGORIES } from "@/lib/menu-data";
import type { MenuCategory } from "@/lib/types";

export function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("Sushi Rolls");

  const filteredItems = MENU_ITEMS.filter(
    (item) => item.category === activeCategory
  );

  return (
    <section id="menu" className="py-20 px-4 bg-bg-surface/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Our <span className="text-accent">Menu</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {MENU_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-accent text-bg-primary"
                  : "bg-bg-surface text-text-secondary hover:text-text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden p-0">
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <span className="text-accent font-bold">€{item.price}</span>
                </div>
                <p className="text-text-secondary text-sm">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-light transition-colors underline"
          >
            View Full Menu →
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Menu.tsx
git commit -m "feat: add Menu component with category tabs"
```

### Task 10: Reviews Component

- [ ] **Step 1: Create `src/components/Reviews.tsx`**

```typescript
import { Card } from "./ui/Card";
import { REVIEWS } from "@/lib/reviews-data";
import { RESTAURANT_INFO } from "@/lib/config";

function StarRating({ rating }: { readonly rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-accent" : "text-text-secondary/30"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-6xl font-bold text-accent mb-2">
            {RESTAURANT_INFO.rating}
          </div>
          <StarRating rating={5} />
          <p className="text-text-secondary mt-2">
            Based on {RESTAURANT_INFO.totalReviews} reviews
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <Card key={review.id} className="flex flex-col gap-3">
              <StarRating rating={review.rating} />
              <p className="text-text-secondary text-sm italic">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="font-bold text-sm mt-auto">{review.author}</p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.google.com/maps/place/MAKI+Sushi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-light transition-colors underline"
          >
            See all reviews on Google →
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Reviews.tsx
git commit -m "feat: add Reviews component with star ratings"
```

### Task 11: Gallery Component with Lightbox

- [ ] **Step 1: Create `src/components/Gallery.tsx`**

```typescript
"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

const GALLERY_IMAGES = Array.from({ length: 6 }, (_, i) => ({
  src: `/images/gallery-${i + 1}.jpg`,
  alt: `MAKI Sushi gallery photo ${i + 1}`,
}));

export function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % GALLERY_IMAGES.length : null
        );
      if (e.key === "ArrowLeft")
        setLightboxIndex((prev) =>
          prev !== null
            ? (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
            : null
        );
    },
    [lightboxIndex]
  );

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [lightboxIndex, handleKeyDown]);

  return (
    <section id="gallery" className="py-20 px-4 bg-bg-surface/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="text-accent">Gallery</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GALLERY_IMAGES.map((img, index) => (
            <button
              key={img.src}
              onClick={() => setLightboxIndex(index)}
              className="relative aspect-[4/3] overflow-hidden rounded-xl group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white text-3xl hover:text-accent z-10"
            aria-label="Close lightbox"
          >
            &times;
          </button>

          <button
            onClick={() =>
              setLightboxIndex(
                (lightboxIndex - 1 + GALLERY_IMAGES.length) %
                  GALLERY_IMAGES.length
              )
            }
            className="absolute left-4 text-white text-4xl hover:text-accent z-10"
            aria-label="Previous image"
          >
            &#8249;
          </button>

          <div className="relative w-full max-w-4xl aspect-[4/3] mx-4">
            <Image
              src={GALLERY_IMAGES[lightboxIndex].src}
              alt={GALLERY_IMAGES[lightboxIndex].alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <button
            onClick={() =>
              setLightboxIndex((lightboxIndex + 1) % GALLERY_IMAGES.length)
            }
            className="absolute right-4 text-white text-4xl hover:text-accent z-10"
            aria-label="Next image"
          >
            &#8250;
          </button>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Gallery.tsx
git commit -m "feat: add Gallery component with lightbox navigation"
```

### Task 12: Contact Component

- [ ] **Step 1: Create `src/components/Contact.tsx`**

```typescript
import { RESTAURANT_INFO } from "@/lib/config";

export function Contact() {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Find <span className="text-accent">Us</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-xl overflow-hidden h-[400px]">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${RESTAURANT_INFO.googleMapsQuery}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MAKI Sushi location"
            />
          </div>

          <div className="flex flex-col justify-center gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Address</h3>
              <p className="text-text-secondary">{RESTAURANT_INFO.address}</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Phone</h3>
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="text-accent hover:text-accent-light transition-colors"
              >
                {RESTAURANT_INFO.phone}
              </a>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Website</h3>
              <a
                href={RESTAURANT_INFO.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-light transition-colors"
              >
                themakisushi.com
              </a>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Opening Hours</h3>
              <p className="text-text-secondary">
                {RESTAURANT_INFO.hours.days}: {RESTAURANT_INFO.hours.open} –{" "}
                {RESTAURANT_INFO.hours.close}
              </p>
              <p className="text-text-secondary">
                {RESTAURANT_INFO.hours.closedDays}: Closed
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Contact.tsx
git commit -m "feat: add Contact component with Google Maps embed"
```

### Task 13: Footer Component

- [ ] **Step 1: Create `src/components/Footer.tsx`**

```typescript
import Image from "next/image";
import { RESTAURANT_INFO } from "@/lib/config";

const QUICK_LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#about", label: "About" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-surface py-12 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image src="/logo.svg" alt="MAKI Sushi" width={32} height={32} />
            <span className="font-brand text-lg font-bold text-accent">
              MAKI
            </span>
          </div>
          <p className="text-text-secondary text-sm">
            Fresh Japanese Cuisine in Roscommon
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-4">Quick Links</h3>
          <ul className="flex flex-col gap-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-text-secondary hover:text-accent transition-colors text-sm"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            {/* TODO: Replace with actual social media URLs */}
            <a
              href={RESTAURANT_INFO.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a
              href={RESTAURANT_INFO.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a
              href={RESTAURANT_INFO.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors"
              aria-label="TikTok"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/5 text-center">
        <p className="text-text-secondary text-sm">
          &copy; {currentYear} {RESTAURANT_INFO.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: add Footer component with social links"
```

---

## Chunk 3: Modal Components & Page Assembly

### Task 14: Order Modal Component

- [ ] **Step 1: Create `src/components/OrderModal.tsx`**

```typescript
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { useToast } from "./ui/Toast";
import { MENU_ITEMS, MENU_CATEGORIES } from "@/lib/menu-data";
import { submitOrder } from "@/lib/webhook";
import type { CartItem, OrderType, MenuItem } from "@/lib/types";

interface OrderModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

type Step = 1 | 2 | 3 | 4;

export function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>(1);
  const [orderType, setOrderType] = useState<OrderType>("takeaway");
  const [cart, setCart] = useState<ReadonlyArray<CartItem>>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = useMemo(
    () => cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0),
    [cart]
  );

  function handleClose() {
    setStep(1);
    setCart([]);
    setName("");
    setPhone("");
    setAddress("");
    setNotes("");
    setErrors({});
    onClose();
  }

  function addToCart(item: MenuItem) {
    const existing = cart.find((ci) => ci.item.id === item.id);
    if (existing) {
      setCart(
        cart.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      );
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
  }

  function removeFromCart(itemId: string) {
    const existing = cart.find((ci) => ci.item.id === itemId);
    if (!existing) return;
    if (existing.quantity <= 1) {
      setCart(cart.filter((ci) => ci.item.id !== itemId));
    } else {
      setCart(
        cart.map((ci) =>
          ci.item.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
        )
      );
    }
  }

  function validateStep4(): boolean {
    const newErrors: Record<string, string> = {};
    if (name.length < 2 || name.length > 100) newErrors.name = "Name must be 2-100 characters";
    if (!/^(\+353|08)\d[\s\d]{6,}$/.test(phone.replace(/\s/g, ""))) newErrors.phone = "Enter a valid Irish phone number";
    if (orderType === "delivery" && !address.trim()) newErrors.address = "Delivery address is required";
    if (notes.length > 500) newErrors.notes = "Notes must be under 500 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validateStep4()) return;
    setIsSubmitting(true);

    const result = await submitOrder({
      type: "order",
      orderType,
      items: cart.map((ci) => ({
        name: ci.item.name,
        quantity: ci.quantity,
        price: ci.item.price,
      })),
      customer: {
        name,
        phone,
        ...(orderType === "delivery" ? { address } : {}),
      },
      notes,
      total,
      createdAt: new Date().toISOString(),
    });

    setIsSubmitting(false);

    if (result.success) {
      showToast("Order received! We'll contact you shortly.", "success");
      handleClose();
    } else {
      showToast("Something went wrong. Please call us at 083 026 0220.", "error");
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Order Online">
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-text-secondary">How would you like your order?</p>
          <div className="flex gap-4">
            {(["takeaway", "delivery"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors capitalize ${
                  orderType === type
                    ? "border-accent text-accent"
                    : "border-white/10 text-text-secondary hover:border-white/20"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <Button onClick={() => setStep(2)} className="w-full">
            Next — Choose Items
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button onClick={() => setStep(1)} className="text-accent text-sm">&larr; Back</button>
            {cart.length > 0 && (
              <span className="text-sm text-text-secondary">{cart.length} items · €{total}</span>
            )}
          </div>
          <div className="max-h-[50vh] overflow-y-auto space-y-6">
            {MENU_CATEGORIES.map((category) => (
              <div key={category}>
                <h3 className="font-bold text-sm text-accent mb-2">{category}</h3>
                <div className="space-y-2">
                  {MENU_ITEMS.filter((i) => i.category === category).map((item) => {
                    const inCart = cart.find((ci) => ci.item.id === item.id);
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-bg-primary/50">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-accent">€{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {inCart && (
                            <>
                              <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-full bg-bg-surface text-text-secondary hover:text-text-primary flex items-center justify-center text-sm">-</button>
                              <span className="text-sm w-4 text-center">{inCart.quantity}</span>
                            </>
                          )}
                          <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-full bg-accent text-bg-primary flex items-center justify-center text-sm font-bold">+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {cart.length > 0 && (
            <Button onClick={() => setStep(3)} className="w-full">
              Review Cart (€{total})
            </Button>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <button onClick={() => setStep(2)} className="text-accent text-sm">&larr; Back</button>
          <div className="space-y-2">
            {cart.map((ci) => (
              <div key={ci.item.id} className="flex justify-between items-center p-2 rounded-lg bg-bg-primary/50">
                <div>
                  <p className="text-sm font-medium">{ci.item.name}</p>
                  <p className="text-xs text-text-secondary">€{ci.item.price} x {ci.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => removeFromCart(ci.item.id)} className="w-7 h-7 rounded-full bg-bg-surface text-text-secondary hover:text-text-primary flex items-center justify-center text-sm">-</button>
                  <span className="text-sm w-4 text-center">{ci.quantity}</span>
                  <button onClick={() => addToCart(ci.item)} className="w-7 h-7 rounded-full bg-accent text-bg-primary flex items-center justify-center text-sm font-bold">+</button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-4">
            <span>Total</span>
            <span className="text-accent">€{total}</span>
          </div>
          <Button onClick={() => setStep(4)} className="w-full">
            Continue to Details
          </Button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <button onClick={() => setStep(3)} className="text-accent text-sm">&larr; Back</button>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-lg bg-bg-primary border border-white/10 text-text-primary focus:border-accent outline-none" placeholder="Your name" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1">Phone *</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 rounded-lg bg-bg-primary border border-white/10 text-text-primary focus:border-accent outline-none" placeholder="083 xxx xxxx" />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>
            {orderType === "delivery" && (
              <div>
                <label className="block text-sm mb-1">Delivery Address *</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 rounded-lg bg-bg-primary border border-white/10 text-text-primary focus:border-accent outline-none" placeholder="Your delivery address" />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>
            )}
            <div>
              <label className="block text-sm mb-1">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-3 rounded-lg bg-bg-primary border border-white/10 text-text-primary focus:border-accent outline-none resize-none" rows={3} placeholder="Any special requests?" maxLength={500} />
              {errors.notes && <p className="text-red-400 text-xs mt-1">{errors.notes}</p>}
            </div>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-4">
            <span>Total</span>
            <span className="text-accent">€{total}</span>
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : `Place Order — €${total}`}
          </Button>
        </div>
      )}
    </Modal>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/OrderModal.tsx
git commit -m "feat: add OrderModal with multi-step cart and n8n webhook"
```

### Task 15: Reserve Modal Component

- [ ] **Step 1: Create `src/components/ReserveModal.tsx`**

```typescript
"use client";

import { useState } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { useToast } from "./ui/Toast";
import { submitReservation } from "@/lib/webhook";

interface ReserveModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => {
  const hour = 13 + Math.floor(i / 2);
  const minute = (i % 2) * 30;
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
});

function isValidDay(dateStr: string): boolean {
  const date = new Date(dateStr + "T00:00:00");
  const day = date.getDay();
  return day >= 4 || day === 0; // Thu=4, Fri=5, Sat=6, Sun=0
}

function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export function ReserveModal({ isOpen, onClose }: ReserveModalProps) {
  const { showToast } = useToast();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleClose() {
    setDate("");
    setTime("");
    setGuests("2");
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setErrors({});
    onClose();
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!date) newErrors.date = "Please select a date";
    else if (date < getTomorrow()) newErrors.date = "Must be at least tomorrow";
    else if (!isValidDay(date)) newErrors.date = "We're only open Thu–Sun";
    if (!time) newErrors.time = "Please select a time";
    if (name.length < 2 || name.length > 100) newErrors.name = "Name must be 2-100 characters";
    if (!/^(\+353|08)\d[\s\d]{6,}$/.test(phone.replace(/\s/g, ""))) newErrors.phone = "Enter a valid Irish phone number";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Enter a valid email";
    if (notes.length > 500) newErrors.notes = "Notes must be under 500 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setIsSubmitting(true);

    const result = await submitReservation({
      type: "reservation",
      date,
      time,
      guests: parseInt(guests, 10),
      customer: {
        name,
        phone,
        ...(email ? { email } : {}),
      },
      notes,
      createdAt: new Date().toISOString(),
    });

    setIsSubmitting(false);

    if (result.success) {
      showToast("Reservation confirmed! We'll send you a confirmation.", "success");
      handleClose();
    } else {
      showToast("Something went wrong. Please call us at 083 026 0220.", "error");
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reserve a Table">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Date *</label>
            <input
              type="date"
              value={date}
              min={getTomorrow()}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 rounded-lg bg-bg-primary border border-white/10 text-text-primary focus:border-accent outline-none"
            />
            {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Time *</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 rounded-lg bg-bg-primary border border-white/10 text-text-primary focus:border-accent outline-none"
            >
              <option value="">Select time</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Number of Guests *</label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full p-3 rounded-lg bg-bg-primary border border-white/10 text-text-primary focus:border-accent outline-none"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? "guest" : "guests"}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-lg bg-bg-primary border border-white/10 text-text-primary focus:border-accent outline-none" placeholder="Your name" />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Phone *</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 rounded-lg bg-bg-primary border border-white/10 text-text-primary focus:border-accent outline-none" placeholder="083 xxx xxxx" />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-lg bg-bg-primary border border-white/10 text-text-primary focus:border-accent outline-none" placeholder="your@email.com (optional)" />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Special Requests</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-3 rounded-lg bg-bg-primary border border-white/10 text-text-primary focus:border-accent outline-none resize-none" rows={3} placeholder="Any special requests or dietary needs?" maxLength={500} />
          {errors.notes && <p className="text-red-400 text-xs mt-1">{errors.notes}</p>}
        </div>

        <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Confirm Reservation"}
        </Button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ReserveModal.tsx
git commit -m "feat: add ReserveModal with date/time validation and n8n webhook"
```

### Task 16: Assemble Main Page

- [ ] **Step 1: Update `src/app/layout.tsx` to include ToastProvider**

Add import and wrap children:

```typescript
import { ToastProvider } from "@/components/ui/Toast";

// In the body:
<body className="bg-bg-primary text-text-primary font-sans antialiased">
  <ToastProvider>
    {children}
  </ToastProvider>
</body>
```

- [ ] **Step 2: Create `src/app/page.tsx`**

```typescript
"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Menu } from "@/components/Menu";
import { Reviews } from "@/components/Reviews";
import { Gallery } from "@/components/Gallery";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { OrderModal } from "@/components/OrderModal";
import { ReserveModal } from "@/components/ReserveModal";

export default function Home() {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isReserveOpen, setIsReserveOpen] = useState(false);

  return (
    <>
      <Navbar onOrderClick={() => setIsOrderOpen(true)} />
      <main>
        <Hero
          onOrderClick={() => setIsOrderOpen(true)}
          onReserveClick={() => setIsReserveOpen(true)}
        />
        <About />
        <Menu />
        <Reviews />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <OrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
      />
      <ReserveModal
        isOpen={isReserveOpen}
        onClose={() => setIsReserveOpen(false)}
      />
    </>
  );
}
```

- [ ] **Step 3: Add Restaurant structured data to layout.tsx**

Add a `<script>` tag with JSON-LD in the `<head>`:

```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: "MAKI Sushi",
      image: "/images/hero-bg.jpg",
      address: {
        "@type": "PostalAddress",
        streetAddress: "The Square, Ardnanagh",
        addressLocality: "Roscommon",
        postalCode: "F42 NN90",
        addressCountry: "IE",
      },
      telephone: "+353830260220",
      url: "https://themakisushi.com",
      servesCuisine: "Japanese",
      priceRange: "€€",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "80",
      },
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Thursday", "Friday", "Saturday", "Sunday"], opens: "13:00", closes: "21:00" },
      ],
    }),
  }}
/>
```

- [ ] **Step 4: Verify the full site works**

```bash
npm run dev
```

Expected: Full site loads at http://localhost:3000 with all sections, modals open/close, form validation works.

- [ ] **Step 5: Run build to check for errors**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/ src/components/
git commit -m "feat: assemble main page with all sections and modals"
```

---

## Chunk 4: Final Polish

### Task 17: Add next.config.js for Unsplash images

- [ ] **Step 1: Update `next.config.ts`** (or `next.config.mjs` depending on scaffold)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
```

Note: Since we download images to `public/images/`, this may not be needed. Only add if using remote Unsplash URLs directly.

- [ ] **Step 2: Commit if changed**

```bash
git add next.config.*
git commit -m "chore: configure Next.js image domains"
```

### Task 18: Final Build & Verify

- [ ] **Step 1: Clean build**

```bash
rm -rf .next
npm run build
```

Expected: Build succeeds.

- [ ] **Step 2: Test production mode**

```bash
npm start
```

Expected: Site works at http://localhost:3000 in production mode.

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "chore: final polish and build verification"
```
