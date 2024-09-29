"use client";

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType } from 'embla-carousel';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';  // FontAwesome Icon
import { Children, PropsWithChildren } from 'react';
import styles from './carousel.module.css';

export function EmblaCarousel(props: PropsWithChildren<{
  direction?: EmblaOptionsType["axis"],
  aspectRatio?: number,
}>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, axis: props.direction ?? "x" });
  const [canScroll, setCanScroll] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  useEffect(() => {
    if (emblaApi) {
      setCanScroll(emblaApi.slideNodes().length > 1);
      setSlideCount(emblaApi.slideNodes().length);
      emblaApi.on('select', () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      });
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
    <div className={styles.emblaWrapper}>
      <div className={styles.embla} ref={emblaRef}>
        <div className={styles.embla__container}>
          {Children.map(props.children, child =>
            <div className={styles.embla__slide}>{child}</div>
          )}
        </div>
        {canScroll && (
          <>
            <button className={`${styles.embla__button} ${styles.prev}`} onClick={scrollPrev}><FaChevronLeft/></button>
            <button className={`${styles.embla__button} ${styles.next}`} onClick={scrollNext}><FaChevronRight/></button>
          </>
        )}
      </div>
      {canScroll && (
        <div className={styles.embla__dots}>
          {Array.from({ length: slideCount }).map((_, index) => (
            <button
              key={index}
              className={`${styles.embla__dot} ${index === selectedIndex ? styles.embla__dot__active : ''}`}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
