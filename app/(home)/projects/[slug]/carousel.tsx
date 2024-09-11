"use client";

import React, { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import styles from './styles.module.css'
import { Children, PropsWithChildren } from 'react'


export function EmblaCarousel(props: PropsWithChildren<{}>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes()) // Access API
    }
  }, [emblaApi])

  return (
    <div className={styles.embla} ref={emblaRef}>
      <div className={styles.embla__container}>
        {Children.map(props.children, child =>
          <div className={styles.embla__slide}>{child}</div>
        )}
      </div>
    </div>
  )
}
