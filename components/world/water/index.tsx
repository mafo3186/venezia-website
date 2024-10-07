/**
 * @see https://github.com/mrdoob/three.js/blob/dev/examples/jsm/objects/Water2.js
 */

import { useTexture } from "@react-three/drei";
import { extend, Object3DNode } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { PlaneGeometry, RepeatWrapping, Vector2 } from "three";
import {
  Water as WaterImpl,
  WaterOptions,
} from "three/examples/jsm/objects/Water2.js";
import water1MNormal from "./Water_1_M_Normal.jpg";
import water2MNormal from "./Water_2_M_Normal.jpg";

extend({ WaterImpl });

declare module "@react-three/fiber" {
  interface ThreeElements {
    waterImpl: Object3DNode<WaterImpl, typeof WaterImpl>;
  }
}

export function Water() {
  const ref = useRef<WaterImpl>(null!);
  const normalMap0 = useTexture(water1MNormal.src);
  const normalMap1 = useTexture(water2MNormal.src);
  normalMap0.wrapS = normalMap0.wrapT = RepeatWrapping;
  normalMap1.wrapS = normalMap1.wrapT = RepeatWrapping;
  const geometry = useMemo(() => new PlaneGeometry(1000, 1000), []);
  const options = useMemo<WaterOptions>(
    () => ({
      color: "#aabbbb",
      scale: 70,
      reflectivity: 0.02,
      flowSpeed: 0.03,
      flowDirection: new Vector2(1, 1).normalize(),
      textureWidth: water1MNormal.width,
      textureHeight: water1MNormal.height,
      normalMap0,
      normalMap1,
    }),
    [normalMap0, normalMap1],
  );
  return (
    <>
      <waterImpl
        ref={ref}
        args={[geometry, options]}
        rotation-x={-Math.PI / 2}
        position={[0, 0, 0]}
      />
      {/* catch shadows */}
      <mesh
        geometry={geometry}
        rotation-x={-Math.PI / 2}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <shadowMaterial opacity={0.5} />
      </mesh>
    </>
  );
}
