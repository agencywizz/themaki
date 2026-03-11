import Image from "next/image";
import Button from "@/components/ui/Button";
import { RESTAURANT_INFO } from "@/lib/config";

interface HeroProps {
  readonly onOrderClick: () => void;
  readonly onReserveClick: () => void;
}

export default function Hero({ onOrderClick, onReserveClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <Image
        src="/images/hero-bg.jpg"
        alt="MAKI Sushi restaurant"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 text-center px-4">
        <Image
          src="/logo.svg"
          alt="MAKI Logo"
          width={120}
          height={120}
          className="mx-auto mb-6"
        />
        <h1 className="font-brand text-5xl md:text-7xl font-bold text-text-primary mb-4">
          {RESTAURANT_INFO.name}
        </h1>
        <p className="text-text-secondary text-lg md:text-xl mb-8 max-w-md mx-auto">
          {RESTAURANT_INFO.tagline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={onOrderClick}>
            Order Online
          </Button>
          <Button variant="secondary" size="lg" onClick={onReserveClick}>
            Reserve a Table
          </Button>
        </div>
      </div>
    </section>
  );
}
