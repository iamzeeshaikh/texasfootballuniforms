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
  // Once the visitor picks an image themselves, stop the auto-rotation so
  // their selection stays put instead of being swapped away 4.5s later.
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    if (images.length < 2 || interacted) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [images.length, interacted]);

  const selectImage = (index: number) => {
    setInteracted(true);
    setActiveIndex(index);
  };

  // Every slide is mounted once the page is idle, so switching is an opacity
  // change rather than a fresh download of a 1400px image.
  const [warmed, setWarmed] = useState(false);

  useEffect(() => {
    if (images.length < 2) {
      return;
    }

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const handle = idle(() => setWarmed(true));

    return () => {
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(handle as number);
      } else {
        window.clearTimeout(handle as number);
      }
    };
  }, [images.length]);

  const slides = warmed ? images : [images[activeIndex] ?? images[0]];

  return (
    <div className="space-y-4">
      <div
        className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 ${
          frameClassName ?? ""
        }`}
      >
        {slides.map((image, index) => {
          const isActive = !warmed || index === activeIndex;
          // The first slide stays in flow so the frame keeps its height; the
          // rest are stacked on top of it and cross-faded.
          return (
            <Image
              key={image}
              src={image}
              alt={`${altBase} image ${index + 1}`}
              width={1400}
              height={1100}
              // Without `sizes` Next only emits a 1x/2x density srcset off the
              // 1400px width, so a 412px phone was pulling the w=1920 and
              // w=3840 renditions. A width-based srcset gets it w=640.
              sizes="(min-width: 1024px) 620px, 100vw"
              priority={priority && index === 0}
              // Warmed slides fetch straight away so a thumbnail click is a fade, not a download.
              loading={index === 0 ? undefined : "eager"}
              className={`aspect-[4/3] w-full object-cover transition-opacity duration-150 ${
                index > 0 ? "absolute inset-0 h-full" : ""
              } ${isActive ? "opacity-100" : "opacity-0"} ${imageClassName ?? ""}`}
              aria-hidden={!isActive}
            />
          );
        })}
        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => selectImage((activeIndex - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[rgba(11,31,58,0.7)] text-white transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => selectImage((activeIndex + 1) % images.length)}
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
            onClick={() => selectImage(index)}
            // Hovering / touching a thumb warms the full-size slides immediately
            // (before the idle callback fires) so the swap is instant.
            onPointerEnter={() => setWarmed(true)}
            onTouchStart={() => setWarmed(true)}
            aria-label={`View image ${index + 1} of ${altBase}`}
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
              sizes="(min-width: 1024px) 120px, 20vw"
              className={`aspect-square w-full object-cover ${thumbnailImageClassName ?? ""}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
