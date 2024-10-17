/**
 * Original implementation did not handle refs correctly.
 * 
 * @see https://github.com/pmndrs/drei/blob/4d574538f41ac0ce352b187c0f9671cbe1822500/src/core/PerspectiveCamera.tsx
 */

import * as THREE from "three";
import * as React from "react";
import { PerspectiveCamera as PerspectiveCameraImpl } from "three";
import { useThree } from "@react-three/fiber";
import { ForwardRefComponent } from "@react-three/drei/helpers/ts-utils";

type Props = JSX.IntrinsicElements["perspectiveCamera"] & {
  /** Registers the camera as the system default, fiber will start rendering with it */
  makeDefault?: boolean;
  /** Making it manual will stop responsiveness and you have to calculate aspect ratio yourself. */
  manual?: boolean;
};

export const PerspectiveCamera: ForwardRefComponent<
  Props,
  PerspectiveCameraImpl
// eslint-disable-next-line react/display-name
> = /* @__PURE__ */ React.forwardRef(
  (
    {
      makeDefault,
      children,
      // prevents ref from ending up in props and to be overwritten accidentally
      ref: _ref,
      ...props
    }: Props,
    ref,
  ) => {
    const set = useThree(({ set }) => set);
    const camera = useThree(({ camera }) => camera);
    const size = useThree(({ size }) => size);
    const cameraRef = React.useRef<PerspectiveCameraImpl>(null!);
    React.useImperativeHandle(ref, () => cameraRef.current, []);
    React.useLayoutEffect(() => {
      if (!props.manual) {
        cameraRef.current.aspect = size.width / size.height;
      }
    }, [size, props]);
    React.useLayoutEffect(() => {
      cameraRef.current.updateProjectionMatrix();
    });
    React.useLayoutEffect(() => {
      if (makeDefault) {
        const oldCam = camera;
        set(() => ({ camera: cameraRef.current! }));
        return () => set(() => ({ camera: oldCam }));
      }
      // The camera should not be part of the dependency list because this components camera is a stable reference
      // that must exchange the default, and clean up after itself on unmount.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cameraRef, makeDefault, set]);
    return (
      <perspectiveCamera ref={cameraRef} {...props}>
        {children}
      </perspectiveCamera>
    );
  },
);
