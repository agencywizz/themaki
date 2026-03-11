"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import { MENU_ITEMS } from "@/lib/menu-data";
import type { MenuCategory } from "@/lib/types";

const CATEGORIES: readonly MenuCategory[] = [
  "Sushi Rolls",
  "Nigiri",
  "Starters",
  "Specials",
  "Desserts",
];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "All">(
    "All"
  );

  const filteredItems = useMemo(
    () =>
      activeCategory === "All"
        ? MENU_ITEMS
        : MENU_ITEMS.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  return (
    <section id="menu" className="py-20 px-4 bg-bg-surface/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-brand text-3xl md:text-4xl font-bold text-text-primary text-center mb-12">
          Our Menu
        </h2>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {(["All", ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-accent text-bg-primary"
                  : "bg-bg-surface text-text-secondary hover:text-text-primary"
              }`}
            >
              {cat}
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
                />
                {item.isPopular && (
                  <span className="absolute top-2 right-2 bg-accent text-bg-primary text-xs font-bold px-2 py-1 rounded">
                    Popular
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-text-primary">{item.name}</h3>
                  <span className="text-accent font-bold">
                    &euro;{item.price}
                  </span>
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
            View Full Menu
          </a>
        </div>
      </div>
    </section>
  );
}
