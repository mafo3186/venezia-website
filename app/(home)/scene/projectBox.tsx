"use client";

import { useRouter } from 'next/navigation';
import { MeshProps, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Mesh } from 'three';

export default function ProjectBox({ href, ...props }: { href: string } & MeshProps) {
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
