"use client";

import React, { useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { EmblaOptionsType } from 'embla-carousel';
import { Children, PropsWithChildren } from 'react'
import styles from './carousel.module.css'

export function EmblaCarousel(props: PropsWithChildren<{
  direction?: EmblaOptionsType["axis"],
  aspectRatio?: number,
}>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, axis: props.direction ?? "x" })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])


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
      </div>
      <button className={`${styles.embla__button} ${styles.prev}`} onClick={scrollPrev}>←</button>
      <button className={`${styles.embla__button} ${styles.next}`} onClick={scrollNext}>→</button>
    </div>
  )
}
