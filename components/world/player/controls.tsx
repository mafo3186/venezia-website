/**
Inspired by https://github.com/mrdoob/three.js/blob/efb7510951afff90c90fd2c969675285e374b0be/examples/jsm/controls/PointerLockControls.js
and https://github.com/pmndrs/drei/blob/71864076c35c3b4f201cd9518da873eff7dc90a1/src/core/PointerLockControls.tsx
*/

import { ForwardRefComponent } from "@react-three/drei/helpers/ts-utils";
import { EventManager, Object3DNode, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo } from "react";
import { Camera, Controls, Euler, Vector2, Vector3 } from "three";

const PI_2 = Math.PI / 2;
const CHANGE_EVENT: { type: "change" } = { type: "change" };

export class FirstPersonDragControlsImpl extends Controls<{
  change: { type: "change" };
}> {
  private looking = false;
  private onClick: (e: MouseEvent) => void;
  private onPointerDown: (e: PointerEvent) => void;
  private onPointerUp: (e: PointerEvent) => void;
  private onPointerMove: (e: PointerEvent) => void;
  private start = new Vector2();
  private euler = new Euler(0, 0, 0, "YXZ");

  constructor(
    camera: Camera,
    domElement: HTMLElement | null = null,
    public minPolarAngle = 0,
    public maxPolarAngle = Math.PI,
    public pointerSpeed = 2.0,
    /**
     * Higher values will make it easier to trigger the click event,
     * lower values prevent the click event from triggering when dragging.
     */
    public stopPropagationThreshold = 0.02,
  ) {
    super(camera, domElement);
    this.onClick = (e) => {
      if (e.button === 0) {
        this.stopPropagationIfApplicable(e);
      }
    };
    this.onPointerDown = (e: PointerEvent) => {
      if (e.button === 0) {
        this.looking = true;
        this.start.set(e.screenX, e.screenY);
        this.domElement?.setPointerCapture(e.pointerId);
      }
    };
    this.onPointerUp = (e: PointerEvent) => {
      if (e.button === 0) {
        this.stopPropagationIfApplicable(e);
        this.domElement?.releasePointerCapture(e.pointerId);
        this.looking = false;
      }
    };
    this.onPointerMove = (event: PointerEvent) => {
      if (this.enabled && this.looking && this.domElement) {
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;
        const camera = this.object;
        const euler = this.euler;
        euler.setFromQuaternion(camera.quaternion);
        const baseline = Math.min(
          this.domElement.clientWidth,
          this.domElement.clientHeight,
        );
        euler.y += (movementX / baseline) * pointerSpeed;
        euler.x += (movementY / baseline) * pointerSpeed;
        euler.x = Math.max(
          PI_2 - maxPolarAngle,
          Math.min(PI_2 - minPolarAngle, euler.x),
        );
        camera.quaternion.setFromEuler(euler);
        this.dispatchEvent(CHANGE_EVENT);
      }
    };
    if (this.domElement !== null) {
      this.connect();
    }
  }

  private stopPropagationIfApplicable(event: MouseEvent) {
    let dist = 0;
    if (this.domElement) {
      const baseline = Math.min(
        this.domElement.clientWidth,
        this.domElement.clientHeight,
      );
      const current = new Vector2(event.screenX, event.screenY);
      dist = current.sub(this.start).divideScalar(baseline).length();
    }
    if (dist > this.stopPropagationThreshold) {
      event.stopImmediatePropagation();
    }
  }

  connect() {
    if (this.domElement) {
      this.domElement.addEventListener("click", this.onClick, true);
      this.domElement.addEventListener("pointermove", this.onPointerMove, true);
      this.domElement.addEventListener("pointerdown", this.onPointerDown, true);
      this.domElement.addEventListener("pointerup", this.onPointerUp, true);
    }
  }

  disconnect() {
    if (this.domElement) {
      this.domElement.removeEventListener("click", this.onClick, true);
      this.domElement.removeEventListener(
        "pointermove",
        this.onPointerMove,
        true,
      );
      this.domElement.removeEventListener(
        "pointerdown",
        this.onPointerDown,
        true,
      );
      this.domElement.removeEventListener("pointerup", this.onPointerUp, true);
    }
  }

  dispose() {
    this.disconnect();
  }

  getDirection(v: Vector3) {
    return v.set(0, 0, -1).applyQuaternion(this.object.quaternion);
  }
}

export type FirstPersonDragControlsProps = Object3DNode<
  FirstPersonDragControlsImpl,
  typeof FirstPersonDragControlsImpl
> & {
  domElement?: HTMLElement;
  selector?: string;
  enabled?: boolean;
  camera?: Camera;
  onChange?: () => void;
  makeDefault?: boolean;
};

export const FirstPersonDragControls: ForwardRefComponent<
  FirstPersonDragControlsProps,
  FirstPersonDragControlsImpl
> = forwardRef<FirstPersonDragControlsImpl, FirstPersonDragControlsProps>(
  (
    {
      domElement,
      selector,
      enabled = true,
      camera,
      onChange,
      makeDefault,
      ...props
    },
    ref,
  ) => {
    const gl = useThree((state) => state.gl);
    const explCamera = useThree((state) => state.camera);
    const invalidate = useThree((state) => state.invalidate);
    const events = useThree(
      (state) => state.events,
    ) as EventManager<HTMLElement>;
    const get = useThree((state) => state.get);
    const set = useThree((state) => state.set);
    const explDomElement = (events.connected || gl.domElement) as HTMLElement;
    const controls = useMemo(
      () => new FirstPersonDragControlsImpl(explCamera),
      [explCamera],
    );
    useEffect(() => {
      if (enabled) {
        controls.domElement = explDomElement;
        controls.connect();
        return () => {
          controls.disconnect();
        };
      }
    }, [enabled, controls, explDomElement]);
    useEffect(() => {
      const callback = () => {
        invalidate();
        onChange?.();
      };
      controls.addEventListener("change", callback);
      return () => {
        controls.removeEventListener("change", callback);
      };
    }, [onChange, selector, controls, invalidate]);
    useEffect(() => {
      if (makeDefault) {
        const old = get().controls;
        set({ controls });
        return () => set({ controls: old });
      }
    }, [makeDefault, controls, get, set]);
    return <primitive ref={ref} object={controls} {...props} />;
  },
);
FirstPersonDragControls.displayName = "FirstPersonDragControls";
