"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

interface NavbarProps {
  readonly onOrderClick: () => void;
}

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Reviews", href: "#reviews" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
] as const;

export default function Navbar({ onOrderClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-bg-primary/90 backdrop-blur-md border-b border-bg-surface">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MAKI" width={40} height={40} />
          <span className="font-brand text-xl font-bold text-text-primary">
            MAKI
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-text-secondary hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button onClick={onOrderClick}>Order Online</Button>
        </div>

        <button
          className="md:hidden text-text-primary p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-bg-primary/95 backdrop-blur-md border-t border-bg-surface">
          <ul className="flex flex-col items-center gap-4 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-text-secondary hover:text-accent transition-colors"
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Button
                onClick={() => {
                  closeMenu();
                  onOrderClick();
                }}
              >
                Order Online
              </Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
