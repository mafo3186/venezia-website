"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useCompoundBody } from "@react-three/cannon";

export function Model() {
  const model = useGLTF("/assets/scene.gltf");
  const scene = useMemo(() => {
    model.scene.castShadow = true
    model.scene.receiveShadow = true
    model.scene.traverse((node) => {
      if (node.type === "Mesh") {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return model.scene
  }, [model]);
  const [ref] = useCompoundBody(() => ({
    type: "Static",
    shapes: [
      // ground, expands throughout the whole world
      {
        type: "Plane", rotation: [-0.5 * Math.PI, 0, 0],
        position: [0, 1.05, 0],
      },
      // bridge top
      {
        type: "Box", args: [2.6, 2, 3],
        position: [0, 0.65, 0],
      },
      // bridge stairs
      {
        type: "Box", args: [2.6, 2, 3],
        position: [-2.46, 0.27, 0],
        rotation: [0, 0, 0.3],
      },
      {
        type: "Box", args: [2.6, 2, 3],
        position: [2.46, 0.27, 0],
        rotation: [0, 0, -0.3],
      },
      //bridge railings
      {
        type: "Box", args: [8, 4, 3],
        position: [-0.2, 2, 2.8],
      },
      {
        type: "Box", args: [8, 4, 3],
        position: [-0.2, 2, -2.7],
      },
      // buildings
      {
        type: "Box", args: [30, 6, 3],
        position: [0, 3, 2.9],
      },
      {
        type: "Box", args: [30, 6, 3],
        position: [0, 3, -3.4],
      },
    ],
  }));
  return <>
    {scene && <mesh>
      <primitive object={scene} position={[-0.67, 0, 0]} />
      <mesh ref={ref as any}></mesh>
    </mesh>}
  </>;
}
