"use client";

import { MeshProps, ThreeEvent } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Mesh } from "three";

export function ProjectBox({ href, ...props }: { href?: string } & MeshProps) {
  const router = useRouter();
  const ref = useRef<Mesh | null>(null);
  const [hovered, setHovered] = useState(false);
  return (
    <mesh
      {...props}
      ref={ref}
      castShadow
      receiveShadow
      onClick={useCallback(
        (event: ThreeEvent<MouseEvent>) => {
          if (href) {
            event.stopPropagation();
            router.push(href);
          }
        },
        [href, router],
      )}
      onPointerOver={useCallback(
        (event: ThreeEvent<PointerEvent>) => {
          if (href) {
            event.stopPropagation();
            setHovered(true);
          }
        },
        [href],
      )}
      onPointerOut={useCallback(
        (event: ThreeEvent<PointerEvent>) => {
          if (href) {
            event.stopPropagation();
            setHovered(false);
          }
        },
        [href],
      )}
    >
      <boxGeometry args={[0.4, 0.05, 0.6]} />
      <meshPhysicalMaterial
        color={href ? (hovered ? "yellow" : "khaki") : "lightgray"}
      />
    </mesh>
  );
}
