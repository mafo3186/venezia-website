"use client";

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType } from 'embla-carousel';
import { Children, PropsWithChildren } from 'react';
import styles from './carousel.module.css';

export function EmblaCarousel(props: PropsWithChildren<{
  direction?: EmblaOptionsType["axis"],
  aspectRatio?: number,
}>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, axis: props.direction ?? "x" });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className={styles.container} style={{
      aspectRatio: props.aspectRatio ?? (3 / 2),
      maxHeight: "80vh", // Ensure the container does not exceed 80% of the viewport height
    }}>
      <div className={styles.emblaViewport} ref={emblaRef}>
        <div className={styles.emblaContainer}>
          {Children.map(props.children, (child, index) =>
            <div className={styles.emblaSlide} key={index}>
              {child}
            </div>
          )}
        </div>
      </div>
      <button className={styles.emblaButtonPrev} onClick={scrollPrev}>←</button>
      <button className={styles.emblaButtonNext} onClick={scrollNext}>→</button>
    </div>
  );
}
