"use client";

import { useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { Object3D, Vector3 } from "three";
import { useSphere, Triplet } from "@react-three/cannon";

export function Player({ position, enableCamera }: { position: Triplet, enableCamera?: boolean }) {
  const [ref, body] = useSphere(() => ({
    type: "Dynamic",
    mass: 1,
    linearDamping: 0.9,
    args: [0.2],
    position,
  }));
  const dummy = useRef<Object3D>(null!);
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          setMoveForward(true);
          break;
        case "KeyA":
        case "ArrowLeft":
          setMoveLeft(true);
          break;
        case "KeyS":
        case "ArrowDown":
          setMoveBackward(true);
          break;
        case "KeyD":
        case "ArrowRight":
          setMoveRight(true);
          break;
      }
    };
    const keyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          setMoveForward(false);
          break;
        case "KeyA":
        case "ArrowLeft":
          setMoveLeft(false);
          break;
        case "KeyS":
        case "ArrowDown":
          setMoveBackward(false);
          break;
        case "KeyD":
        case "ArrowRight":
          setMoveRight(false);
          break;
      }
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    }
  }, []);
  const velocity = useRef([0, 0, 0])
  useEffect(() => {
    const unsubscribe = body.velocity.subscribe((v) => (velocity.current = v))
    return unsubscribe
  }, [body]);
  const position2 = useRef<Triplet>([0, 0, 0])
  useEffect(() => {
    const unsubscribe = body.position.subscribe((v) => (position2.current = v))
    return unsubscribe
  }, [body]);
  const direction = new Vector3();
  const frontVector = new Vector3();
  const sideVector = new Vector3();
  useFrame(({ camera }, delta) => {
    frontVector.set(0, 0, (moveBackward ? 1 : 0) - (moveForward ? 1 : 0));
    sideVector.set((moveLeft ? 1 : 0) - (moveRight ? 1 : 0), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(2.5)
      .applyEuler(camera.rotation);
    body.velocity.set(direction.x, velocity.current[1], direction.z);
    dummy.current.position.set(...position2.current);
  });
  return <>
    <mesh ref={ref as any} />
    <mesh ref={dummy as any}>
      <mesh position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.2, 0.8, 3, 6]} />
        <meshBasicMaterial />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.21]} />
        <meshBasicMaterial color="red" />
        <PerspectiveCamera fov={90} makeDefault={enableCamera} />
      </mesh>
    </mesh>
  </>;
}
