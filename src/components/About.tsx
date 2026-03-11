import Card from "@/components/ui/Card";
import { RESTAURANT_INFO } from "@/lib/config";

const INFO_CARDS = [
  {
    icon: "\uD83D\uDCCD",
    title: "Location",
    detail: RESTAURANT_INFO.address,
  },
  {
    icon: "\uD83D\uDD70\uFE0F",
    title: "Hours",
    detail: "Tue-Thu 12-21 | Fri-Sat 12-22 | Sun 13-21",
  },
  {
    icon: "\uD83D\uDCB0",
    title: "Price Range",
    detail: RESTAURANT_INFO.priceRange,
  },
  {
    icon: "\uD83C\uDF71",
    title: "Services",
    detail: "Dine-in, Delivery & Collection",
  },
] as const;

export default function About() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-brand text-3xl md:text-4xl font-bold text-text-primary text-center mb-12">
          About Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INFO_CARDS.map((card) => (
            <Card key={card.title} className="text-center p-6">
              <div className="text-4xl mb-3">{card.icon}</div>
              <h3 className="font-bold text-text-primary mb-2">{card.title}</h3>
              <p className="text-text-secondary text-sm">{card.detail}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
