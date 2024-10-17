/**
 * @see https://github.com/pmndrs/drei/blob/4d574538f41ac0ce352b187c0f9671cbe1822500/src/core/PositionalAudio.tsx
 */
import {
  AudioLoader,
  AudioListener,
  PositionalAudio as PositionalAudioImpl,
  SphereGeometry,
} from "three";
import { useThree, useLoader } from "@react-three/fiber";
import { ForwardRefComponent } from "@react-three/drei/helpers/ts-utils";
import { useDebug } from "./debug";
import { Edges } from "@react-three/drei";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

type Props = JSX.IntrinsicElements["positionalAudio"] & {
  url: string;
  distance?: number;
  loop?: boolean;
  volume?: number;
};

const geo = new SphereGeometry(1.0, 16, 8);

export const PositionalAudio: ForwardRefComponent<Props, PositionalAudioImpl> =
  // eslint-disable-next-line react/display-name
  /* @__PURE__ */ forwardRef(
  (
    { url, distance = 1, loop = true, autoplay, position, volume }: Props,
    ref,
  ) => {
    const sound = useRef<PositionalAudioImpl>(null!);
    useImperativeHandle(ref, () => sound.current, []);
    const camera = useThree(({ camera }) => camera);
    const [listener] = useState(() => new AudioListener());
    const buffer = useLoader(AudioLoader, url);
    const debug = useDebug();

    useEffect(() => {
      const _sound = sound.current;
      if (_sound) {
        _sound.setBuffer(buffer);
        _sound.setRefDistance(distance);
        _sound.setLoop(loop);
        if (autoplay && !_sound.isPlaying) _sound.play();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buffer, camera, distance, loop]);

    useEffect(() => {
      const _sound = sound.current;
      return () => {
        if (_sound) {
          if (_sound.isPlaying) _sound.stop();
          if (_sound.source && (_sound.source as any)._connected)
            _sound.disconnect();
        }
      };
    }, []);
    useEffect(() => {
      camera.add(listener);
      return () => {
        camera.remove(listener);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [camera]);
    useEffect(() => {
      if (volume !== undefined) {
        sound.current.setVolume(volume);
      }
    }, [volume]);
    return (
      <group position={position}>
        <positionalAudio ref={sound} args={[listener]} />
        <group visible={debug} scale={distance}>
          <Edges
            geometry={geo}
            linewidth={1}
            scale={1.1}
            threshold={1} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
            color="yellow"
          />
        </group>
        <mesh visible={debug} scale={0.1} geometry={geo}>
          <meshBasicMaterial color="yellow" />
        </mesh>
      </group>
    );
  },
);
