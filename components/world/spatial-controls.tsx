import { extend, Object3DNode, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { SpatialControls as SpatialControlsImpl } from "spatial-controls";
import { Quaternion } from "three";

extend({ SpatialControlsImpl });

declare module "@react-three/fiber" {
  interface ThreeElements {
    spatialControlsImpl: Object3DNode<
      SpatialControlsImpl,
      typeof SpatialControlsImpl
    >;
  }
}

export function SpatialControls({
  domElement,
  enabled = true,
  initialRotation,
  ...props
}: Omit<
  Object3DNode<SpatialControlsImpl, typeof SpatialControlsImpl>,
  "domElement"
> & {
  domElement?: HTMLElement | string | null;
  initialRotation?: Quaternion;
}) {
  const ref = useRef<SpatialControlsImpl>(null!);
  const camera = useThree(({ camera }) => {
    return camera;
  });
  useLayoutEffect(() => {
    console.log("reset")
    if (initialRotation) {
      camera.quaternion.copy(initialRotation);
    }
  }, [camera, initialRotation]);
  const get = useThree((state) => state.get);
  const set = useThree((state) => state.set);
  useEffect(() => {
    if (enabled) {
      const previousControls = get().controls;
      set({ controls: ref.current });
      return () => {
        set({ controls: previousControls });
      };
    }
  }, [enabled, get, set]);
  const interceptRef = useCallback(
    (node: SpatialControlsImpl) => {
      ref.current = node;
      if (node) {
        node.position = camera.position;
        node.quaternion = camera.quaternion;
      }
    },
    [camera.position, camera.quaternion, initialRotation],
  );
  useFrame((_, delta) => {
    ref.current.enabled && ref.current.update(delta);
  }, -1);
  const resolvedDomElement = useMemo(() => {
    return (
      (typeof domElement === "string"
        ? document.getElementById(domElement)
        : domElement) ?? null
    );
  }, [domElement]);
  return (
    <spatialControlsImpl
      ref={interceptRef}
      domElement={resolvedDomElement}
      enabled={enabled}
      {...props}
    />
  );
}
