import { Text, useTexture } from "@react-three/drei";
import pointerImageData from "./pointer.png";
import dragImageData from "./drag.png";
import { useEffect, useState } from "react";
import { useSpring, animated, config } from "@react-spring/three";
import { Vector3Tuple } from "three";

const pointerStartPosition: Vector3Tuple = [0, 0, 0];
const pointerEndPosition: Vector3Tuple = [0, -0.1, -0.5];

export function LookTutorial({ enable, completed }: { enable: boolean, completed: boolean }) {
  const pointer = useTexture(pointerImageData.src);
  const drag = useTexture(dragImageData.src);
  const [state, setState] = useState("initial");
  const show = enable && !completed;
  const {
    pointerScale,
  } = useSpring({
    pointerScale: show ? 0.1 : 0,
    config: show ? config.wobbly : config.stiff,
  });
  const {
    pointerPosition,
  } = useSpring({
    pointerPosition: state !== "initial" && state !== "prepare" ? pointerEndPosition : pointerStartPosition,
    config: state === "initial" ? config.wobbly : config.molasses,
  });
  useEffect(() => {
    let timeout;
    if (state === "initial") {
      timeout = setTimeout(() => {
        if (enable) {
          setState("prepare");
        }
      }, 1500);
    } else if (state === "prepare") {
      timeout = setTimeout(() => {
        if (enable) {
          setState("drag");
        }
      }, 500);
    } else if (state === "drag") {
      timeout = setTimeout(() => {
        if (enable) {
          setState("drop");
        }
      }, 3000);
    } else {
      timeout = setTimeout(() => {
        if (enable) {
          setState("initial");
        }
      }, 1500);
    }
    return () => clearTimeout(timeout);
  }, [enable, state]);
  return (<group position={[-1, 1, 0]}>
    <animated.sprite position={pointerPosition} scale={pointerScale} visible={enable}>
      <spriteMaterial map={state === "prepare" || state === "drag" ? drag : pointer} />
      <Text color="black" fontSize={0.5} fontWeight={700} lineHeight={1.25} textAlign="center" rotation-y={Math.PI * 0.5} position={[0, -1.5, 0]}>{"Klicken und ziehen\nzum Umschauen"}</Text>
    </animated.sprite>
  </group>);
}
