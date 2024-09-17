"use client";

import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Mesh, Object3D, Vector3 } from "three";
import { Node, Pathfinding } from "three-pathfinding";
import { GLTFResult } from "./model";

const ZONE = 'level1';

export function Player({ position, debug }: { position: [number, number, number], debug?: boolean }) {
  const navmesh = (useGLTF('/assets/venice.glb') as GLTFResult).nodes.Navmesh.geometry;
  const [pathFinding] = useMemo(() => {
    const pathFinding = new Pathfinding();
    pathFinding.setZoneData(ZONE, Pathfinding.createZone(navmesh));
    return [pathFinding];
  }, [navmesh]);
  // const [ref, body] = useSphere(() => ({
  //   type: "Dynamic",
  //   mass: 1,
  //   linearDamping: 0.9,
  //   args: [0.2],
  //   position,
  // }));
  const dummy = useRef<Object3D>(null!);
  const rayTarget = useRef<Object3D>(null!);
  const node = useRef<Node | undefined>();
  const [targetVisible, setTargetVisible] = useState(false);
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
  // useEffect(() => {
  //   const unsubscribe = body.velocity.subscribe((v) => (velocity.current = v))
  //   return unsubscribe
  // }, [body]);
  // const position2 = useRef<Triplet>([0, 0, 0])
  // useEffect(() => {
  //   const unsubscribe = body.position.subscribe((v) => (position2.current = v))
  //   return unsubscribe
  // }, [body]);
  const direction = new Vector3();
  const frontVector = new Vector3();
  const sideVector = new Vector3();
  const pathFindingNext = new Vector3();
  const pathFindingEndTarget = new Vector3();
  useFrame(({ camera }, delta) => {
    frontVector.set(0, 0, (moveBackward ? 1 : 0) - (moveForward ? 1 : 0));
    sideVector.set((moveLeft ? 1 : 0) - (moveRight ? 1 : 0), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(2.5)
      .applyEuler(camera.rotation);
    // body.velocity.set(direction.x, velocity.current[1], direction.z);
    // dummy.current.position.set(...position2.current);

    if (pathFinding) {
      pathFindingNext.copy(direction).multiplyScalar(delta * 0.75).add(dummy.current.position);
      const groupID = pathFinding.getGroup(ZONE, dummy.current.position);
      if (!node.current) {
        node.current = pathFinding.getClosestNode(dummy.current.position, ZONE, groupID);
      }
      node.current = pathFinding.clampStep(dummy.current.position, pathFindingNext, node.current, ZONE, groupID, pathFindingEndTarget);
      dummy.current.position.copy(pathFindingEndTarget);
    }
  });
  return <>
    {/* <mesh ref={ref as any} /> */}
    <mesh ref={dummy as any}>
      <mesh position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.2, 0.8, 3, 6]} />
        <meshBasicMaterial />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.21]} />
        <meshBasicMaterial color="red" />
        <PerspectiveCamera fov={90} makeDefault={!debug} />
      </mesh>
    </mesh>
    {navmesh && <>
      <mesh
        position={[0, 0, 0]}
        geometry={navmesh}
        visible={debug}
        onPointerEnter={() => setTargetVisible(true)}
        onPointerLeave={() => setTargetVisible(false)}
        onPointerMove={(event) => {
          rayTarget.current.position.copy(event.point)
        }}
        onPointerDown={(event) => {
          dummy.current.position.copy(event.point);
        }}
      >
        <meshBasicMaterial color="cyan" opacity={0.5} transparent />
      </mesh>
      <group ref={rayTarget as any} visible={targetVisible}>
        <mesh
          castShadow
          receiveShadow
          position={[0, 0.25, 0]}
          scale-y={1.5}
        >
          <octahedronGeometry args={[0.1]} />
          <meshPhysicalMaterial
            attach="material"
            color="white"
            transmission={0.6}
            thickness={0.5}
            roughness={0.1} />
        </mesh>
      </group>
    </>}
  </>;
}
