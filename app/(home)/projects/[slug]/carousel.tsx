"use client";

import React, { useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { EmblaOptionsType } from 'embla-carousel';
import { Children, PropsWithChildren } from 'react'


export function EmblaCarousel(props: PropsWithChildren<{ direction?: EmblaOptionsType["axis"] }>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, axis: props.direction ?? "x" })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])


  return (
    <div style={{
      overflow: "hidden",
      aspectRatio: 3 / 2,
      maxHeight: "80vh", // sucks but I can't get it to not overflow otherwise :/
      borderRadius: "var(--border-radius-content)",
    }} ref={emblaRef}>
      <div style={{ display: "flex", height: "100%" }}>
        {Children.map(props.children, child =>
          <div style={{ flex: "0 0 100%", width: "100%", height: "100%" }}>{child}</div>
        )}
      </div>
      <button onClick={scrollPrev}>Prev</button>
      <button onClick={scrollNext}>Next</button>
    </div>
  )
}
