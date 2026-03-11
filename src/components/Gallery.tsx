"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const GALLERY_IMAGES = [
  { src: "/images/gallery-1.jpg", alt: "Sushi platter presentation" },
  { src: "/images/gallery-2.jpg", alt: "Restaurant interior" },
  { src: "/images/gallery-3.jpg", alt: "Chef preparing sushi" },
  { src: "/images/gallery-4.jpg", alt: "Fresh salmon nigiri" },
  { src: "/images/gallery-5.jpg", alt: "Maki rolls close-up" },
  { src: "/images/gallery-6.jpg", alt: "Dining atmosphere" },
] as const;

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null
        ? null
        : prev === 0
          ? GALLERY_IMAGES.length - 1
          : prev - 1
    );
  }, []);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null
        ? null
        : prev === GALLERY_IMAGES.length - 1
          ? 0
          : prev + 1
    );
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, closeLightbox, goToPrev, goToNext]);

  return (
    <section id="gallery" className="py-20 px-4 bg-bg-surface/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-brand text-3xl md:text-4xl font-bold text-text-primary text-center mb-12">
          Gallery
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GALLERY_IMAGES.map((image, index) => (
            <button
              key={image.src}
              onClick={() => setLightboxIndex(index)}
              className="relative h-64 rounded-xl overflow-hidden group cursor-pointer"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal={true}
          aria-label="Image lightbox"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-4 right-4 text-white text-4xl hover:text-accent transition-colors z-10"
            aria-label="Close lightbox"
          >
            &times;
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            className="absolute left-4 text-white text-4xl hover:text-accent transition-colors z-10"
            aria-label="Previous image"
          >
            &#8249;
          </button>

          <div
            className="relative w-full max-w-4xl h-[80vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={GALLERY_IMAGES[lightboxIndex].src}
              alt={GALLERY_IMAGES[lightboxIndex].alt}
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 text-white text-4xl hover:text-accent transition-colors z-10"
            aria-label="Next image"
          >
            &#8250;
          </button>
        </div>
      )}
    </section>
  );
}
