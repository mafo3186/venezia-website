"use client";

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { EmblaOptionsType } from 'embla-carousel';
import { Children, PropsWithChildren } from 'react'
import styles from './carousel.module.css'

export function EmblaCarousel(props: PropsWithChildren<{
  direction?: EmblaOptionsType["axis"],
  aspectRatio?: number,
}>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, axis: props.direction ?? "x" })
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    if (emblaApi) {
      setCanScroll(emblaApi.slideNodes().length > 1);
    }
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      if (emblaApi.canScrollPrev()) {
        emblaApi.scrollPrev();
      } else {
        emblaApi.scrollTo(emblaApi.slideNodes().length - 1);
      }
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }
  }, [emblaApi]);


  return (
    <div
      className={styles.embla}
      style={{ aspectRatio: props.aspectRatio ?? (3 / 2), }}
      ref={emblaRef}
    >
      <div className={styles.embla__container}>
        {Children.map(props.children, child =>
          <div className={styles.embla__slide}>{child}</div>
        )}
      </div>{canScroll && (
        <>
          <button className={`${styles.embla__button} ${styles.prev}`} onClick={scrollPrev}>←</button>
          <button className={`${styles.embla__button} ${styles.next}`} onClick={scrollNext}>→</button>
        </>
      )}
    </div>
  )
}
