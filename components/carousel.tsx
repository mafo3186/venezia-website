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
    <div className={styles.container} style={{
      aspectRatio: props.aspectRatio ?? (3 / 2),
      maxHeight: "80vh", // sucks but I can't get it to not overflow otherwise :/
    }} ref={emblaRef}>
      <div style={{ gridColumnStart: 1, gridColumnEnd: 4, gridRowStart: 1, gridRowEnd: 4, display: "flex", height: "100%" }}>
        {Children.map(props.children, child =>
          <div style={{ flex: "0 0 100%", width: "100%", height: "100%" }}>{child}</div>
        )}
      </div>
      <button style={{ gridColumn: 1, gridRow: 2 }} className={styles.button} onClick={scrollPrev}>←</button>
      <button style={{ gridColumn: 3, gridRow: 2 }} className={styles.button} onClick={scrollNext}>→</button>
    </div>
  )
}
