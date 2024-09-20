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
    }} ref={emblaRef}>
      <div className={styles.viewport}>
        {Children.map(props.children, child =>
          <div className={styles.slide}>
            {child}
          </div>
        )}
      </div>
      <button className={styles.button} onClick={scrollPrev}>←</button>
      <button className={styles.button} onClick={scrollNext}>→</button>
    </div>
  );
}