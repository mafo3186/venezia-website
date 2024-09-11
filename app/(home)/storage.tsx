"use client";

import { ProjectsQueryResult } from '@/sanity.types';
import { Canvas, MeshProps, useFrame, useThree } from '@react-three/fiber'
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DepthOfField, EffectComposer, Vignette } from '@react-three/postprocessing'
import { AdaptiveDpr, Environment, FirstPersonControls, useGLTF } from '@react-three/drei';
import { FirstPersonControls as FirstPersonControlImpl } from 'three-stdlib';
import styles from "./home.module.css";
import { Mesh } from 'three';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import HamburgerMenu from './components/hamburgerMenu';

function Content({ onChildPage, children }: PropsWithChildren<{ onChildPage: boolean }>) {
    return <main className={onChildPage ? styles.mainVisible : styles.mainHidden}>
        <div className={styles.outerWrapper}>
            <div className={styles.innerWrapper}>
                {children}
            </div>
        </div>
    </main>;
}

function ProjectBox({ href, ...props }: { href: string } & MeshProps) {
    const router = useRouter()
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef<Mesh | null>(null)
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta
            ref.current.rotation.x += 0.5 * delta
            ref.current.rotation.z += 0.25 * delta
        }
    })
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={ref}
            scale={hovered ? 1.5 : 1}
            castShadow
            receiveShadow
            onClick={(event) => router.push(href)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}>
            <icosahedronGeometry args={[0.1]} />
            <meshPhysicalMaterial
                attach="material"
                color="white"
                transmission={1}
                thickness={0.5}
                roughness={0.2} />
        </mesh>
    )
}

function Globals() {
    useThree(({ camera }) => {
        camera.position.x = 0
        camera.position.y = 2.5
        camera.position.z = 0
    })
    return <></>;
}

function Model() {
    const model = useGLTF("/assets/scene.gltf");
    const scene = useMemo(() => {
        model.scene.castShadow = true
        model.scene.receiveShadow = true
        model.scene.traverse((node) => {
            if (node.type === 'Mesh') {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        return model.scene
    }, [model]);
    return <>
        {scene && <primitive object={scene} position={[-0.67, 0, 0]} />}
    </>;
}

function Scene({ projects, inBackground }: { projects: ProjectsQueryResult, inBackground: boolean }) {
    const controls = useRef<FirstPersonControlImpl | null>(null);
    useEffect(() => {
        if (controls.current) {
            controls.current.activeLook = !inBackground;
        }
    }, [controls, inBackground])
    return (
        <Canvas
            style={{ width: "100%", height: "100vh" }}
            shadows
            className={styles.scene}
        >
            <color attach="background" args={["#96b0e4"]} />
            <Environment preset="sunset" />
            <fogExp2 attach="fog" color="#96b0e4" density={0.18} />
            <FirstPersonControls ref={controls} lookSpeed={0.1} movementSpeed={0} />
            {/* <Sky sunPosition={[2, 5, 1]} /> */}
            <Globals />
            <Model />
            <ambientLight intensity={0.1} />
            <directionalLight
                intensity={0.9}
                castShadow
                position={[2, 5, 1]}
                shadow-mapSize-height={512}
                shadow-mapSize-width={512}
                shadow-bias={-0.0001}
            />
            {projects.map((project, index) => (
                <ProjectBox
                    key={project._id}
                    href={`/projects/${project.slug}`}
                    position={[
                        Math.cos((index / projects.length + 0.125) * 2 * Math.PI) * 0.75, 2.6,
                        Math.sin((index / projects.length + 0.125) * 2 * Math.PI) * 0.75
                    ]}
                />
            ))}
            <EffectComposer>
                <DepthOfField focusDistance={0} focalLength={0.01} bokehScale={4} />
                <Vignette eskil={false} offset={0.1} darkness={0.75} />
            </EffectComposer>
            <AdaptiveDpr pixelated />
        </Canvas>
    );
}

export function Layout({ projects, children }: PropsWithChildren<{ projects: ProjectsQueryResult }>) {
    const pathname = usePathname();
    const onChildPage = pathname !== "/";

    return (
        <>
            <div className={styles.home}>
                <Scene projects={projects} inBackground={onChildPage} />
            </div>
            <Content onChildPage={onChildPage}>{children}</Content>
        </>);
}
