"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageCarouselProps = {
  images: string[];
  altBase: string;
  priority?: boolean;
  imageClassName?: string;
  frameClassName?: string;
  thumbnailsClassName?: string;
  thumbnailImageClassName?: string;
};

export function ImageCarousel({
  images,
  altBase,
  priority = false,
  imageClassName,
  frameClassName,
  thumbnailsClassName,
  thumbnailImageClassName,
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [images.length]);

  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="space-y-4">
      <div
        className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 ${
          frameClassName ?? ""
        }`}
      >
        <Image
          src={activeImage}
          alt={`${altBase} image ${activeIndex + 1}`}
          width={1400}
          height={1100}
          priority={priority}
          className={`aspect-[4/3] w-full object-cover ${imageClassName ?? ""}`}
        />
        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[rgba(11,31,58,0.7)] text-white transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[rgba(11,31,58,0.7)] text-white transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>
      <div className={`grid grid-cols-5 gap-3 ${thumbnailsClassName ?? ""}`}>
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`overflow-hidden rounded-2xl border transition ${
              index === activeIndex
                ? "border-[var(--color-gold)] shadow-[0_14px_30px_rgba(255,209,102,0.28)]"
                : "border-white/10"
            }`}
          >
            <Image
              src={image}
              alt={`${altBase} thumbnail ${index + 1}`}
              width={240}
              height={240}
              className={`aspect-square w-full object-cover ${thumbnailImageClassName ?? ""}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
