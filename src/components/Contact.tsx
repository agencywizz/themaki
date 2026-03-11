import { RESTAURANT_INFO } from "@/lib/config";

const HOURS_ENTRIES = Object.entries(RESTAURANT_INFO.hours) as ReadonlyArray<
  readonly [string, string]
>;

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-brand text-3xl md:text-4xl font-bold text-text-primary text-center mb-12">
          Find Us
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-xl overflow-hidden h-80 lg:h-auto">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${RESTAURANT_INFO.googleMapsQuery}`}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MAKI Sushi location"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-text-primary mb-2">Phone</h3>
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="text-accent hover:text-accent-light transition-colors"
              >
                {RESTAURANT_INFO.phone}
              </a>
            </div>

            <div>
              <h3 className="font-bold text-text-primary mb-2">Address</h3>
              <p className="text-text-secondary">{RESTAURANT_INFO.address}</p>
            </div>

            <div>
              <h3 className="font-bold text-text-primary mb-2">Website</h3>
              <a
                href={RESTAURANT_INFO.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-light transition-colors"
              >
                {RESTAURANT_INFO.website}
              </a>
            </div>

            <div>
              <h3 className="font-bold text-text-primary mb-2">
                Opening Hours
              </h3>
              <ul className="space-y-1">
                {HOURS_ENTRIES.map(([day, hours]) => (
                  <li
                    key={day}
                    className="flex justify-between text-sm text-text-secondary"
                  >
                    <span className="capitalize">{day}</span>
                    <span>{hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
