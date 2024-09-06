"use client";

import { ProjectsQueryResult } from '@/sanity.types';
import { Canvas, MeshProps, useFrame, useThree } from '@react-three/fiber'
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DepthOfField, EffectComposer, Vignette } from '@react-three/postprocessing'


import styles from "./scene.module.css";
import { Mesh, Object3D } from 'three';

function Box({ href, ...props }: { href: string } & MeshProps) {
  const router = useRouter()
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<Mesh | null>(null)
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current && (ref.current.rotation.y += delta)))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={hovered ? 1.5 : 1}
      onClick={(event) => router.push(href)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[0.125, 0.125, 0.125]} />
      <meshStandardMaterial color='hotpink' />
    </mesh>
  )
}

export function Cam({ onLoaded, position }: { onLoaded: () => void, position: number }) {
  const [model, setModel] = useState<Object3D>();
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load("/assets/scene.gltf", function (gltf) {
      gltf.scene.receiveShadow = true
      gltf.scene.castShadow = true
      setModel(gltf.scene);
      onLoaded();
    }, undefined, function (error) {
      console.error(error);
    });
  }, [onLoaded])
  useThree(({ camera }) => {
    camera.position.x = 0
    camera.position.y = 2.5
    camera.position.z = 0
  })
  useFrame(({ camera }, delta) => {
    let move = 0
    if (position < 0.33) {
      move = 1
    } else if (position > 0.67) {
      move = -1
    }
    camera.rotation.y += delta * move * 1.25
  })
  return <>{model && <primitive object={model} position={[0, 0, 0]} />}</>
}

export function Scene({ projects }: { projects: ProjectsQueryResult }) {
  const [positionX, setPositionX] = useState(0)
  const [visible, setVisible] = useState(false);
  return (
    <Canvas
      style={{ width: "100%", height: "100vh" }}
      shadows
      className={visible ? styles.scene + " " + styles.visible : styles.scene}
      onPointerMove={(event) => {
        setPositionX(event.clientX / event.currentTarget.clientWidth)
      }}>
      <color attach="background" args={[0xdd, 0xbb, 0xff]} />
      <Cam onLoaded={() => setVisible(true)} position={positionX} />
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight castShadow position={[0, 8, 0]} shadow-mapSize={[1024, 1024]}>
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
      </directionalLight>
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      {projects.map((project, index) => (<Box key={project._id} href={`/projects/${project.slug}`} position={[Math.cos(index / projects.length * 2 * Math.PI) * 0.75, 2.6, Math.sin(index / projects.length * 2 * Math.PI) * 0.75]} />))}
      <EffectComposer>
        <DepthOfField focusDistance={0} focalLength={0.01} bokehScale={2} />
        <Vignette eskil={false} offset={0.1} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
}