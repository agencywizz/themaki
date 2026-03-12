import Card from "@/components/ui/Card";
import ScrollReveal from "@/components/ScrollReveal";
import { RESTAURANT_INFO } from "@/lib/config";
import { REVIEWS } from "@/lib/reviews-data";

function StarRating({ rating }: { readonly rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "text-accent" : "text-bg-surface"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" delay={0}>
          <h2 className="font-brand text-3xl md:text-4xl font-bold text-text-primary text-center mb-12">
            What Our Guests Say
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150}>
          <div className="text-center mb-12">
            <div className="text-6xl font-brand font-bold text-accent mb-2">
              {RESTAURANT_INFO.rating}
            </div>
            <StarRating rating={Math.round(RESTAURANT_INFO.rating)} />
            <p className="text-text-secondary mt-2">
              Based on {RESTAURANT_INFO.totalReviews} reviews
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <ScrollReveal key={review.id} direction="up" delay={i * 150}>
              <Card className="p-6 h-full">
                <StarRating rating={review.rating} />
                <p className="text-text-secondary mt-4 mb-4 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="text-text-primary font-bold text-sm">
                  {review.author}
                </p>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={300}>
          <div className="text-center mt-10">
            <a
              href={`https://www.google.com/maps/search/${RESTAURANT_INFO.googleMapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-light transition-colors underline"
            >
              See all reviews on Google
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
