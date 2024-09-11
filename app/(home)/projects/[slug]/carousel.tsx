"use client";

import React, { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { EmblaOptionsType } from 'embla-carousel';
import { Children, PropsWithChildren } from 'react'


export function EmblaCarousel(props: PropsWithChildren<{ direction?: EmblaOptionsType["axis"] }>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, axis: props.direction ?? "x" })

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes()) // Access API
    }
  }, [emblaApi])

  return (
    <div style={{ overflow: "hidden" }} ref={emblaRef}>
      <div style={
        { display: "flex" }
      }>
        {Children.map(props.children, child =>
          <div style={{ flex: "0 0 100%" }}>{child}</div>
        )}
      </div>
    </div>
  )
}
