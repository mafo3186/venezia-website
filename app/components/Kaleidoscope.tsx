// component/Kaleidoscope.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

type KaleidoscopeProps = {
    edge?: number; // Number of mirror sections
    shapes?: string[]; // Shapes to render
    minSize?: number; // Minimum size of shapes
    maxSize?: number; // Maximum size of shapes
    colors?: string[]; // Colors of shapes
    quantity?: number; // Number of shapes
    speed?: number; // Movement speed of shapes
    canvasWidth?: number;
    canvasHeight?: number;
};

type Shape = {
    x: number;
    y: number;
    size: number;
    shape: string;
    color: string;
    dx: number;
    dy: number;
};


export default function Kaleidoscope({
    edge = 8, // Default: 8 sections for mirror
    shapes = ['circle', 'square', 'triangle'], // Default shapes
    minSize = 20, // Minimum size
    maxSize = 50, // Maximum size
    colors = ['#f133ff', '#a792f8', '#3357FF'], // Default colors
    quantity = 30, // Number of shapes
    speed = 0.1, // Default speed
    canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight,
}: KaleidoscopeProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    //const animationRef = useRef<number | null>(null);
    const [mouse, setMouse] = useState({ x: canvasWidth / 2, y: canvasHeight / 2 });


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Generate random shapes
        const shapesArray: Shape[] = [];
        for (let i = 0; i < quantity; i++) {
            const size = minSize + Math.random() * (maxSize - minSize);
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const dx = (Math.random() - 0.5) * speed * 2;
            const dy = (Math.random() - 0.5) * speed * 2;

            shapesArray.push({ x, y, size, shape, color, dx, dy });
        }

        const drawShape = (x: number, y: number, size: number, shape: string, color: string) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            if (shape === 'circle') {
                ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            } else if (shape === 'square') {
                ctx.rect(x - size / 2, y - size / 2, size, size);
            } else if (shape === 'triangle') {
                ctx.moveTo(x, y - size / 2);
                ctx.lineTo(x + size / 2, y + size / 2);
                ctx.lineTo(x - size / 2, y + size / 2);
            }
            ctx.closePath();
            ctx.fill();
        };

        const updateShapes = () => {
            shapesArray.forEach((shape) => {
                // Update shape positions based on velocity (dx, dy) and mouse position influence
                shape.x += shape.dx + (mouse.x - canvas.width / 2) * 0.00001 * speed; //
                shape.y += shape.dy + (mouse.y - canvas.height / 2) * 0.00001 * speed;

                // Bounce off edges
                if (shape.x - shape.size / 2 < 0 || shape.x + shape.size / 2 > canvas.width) {
                    shape.dx = -shape.dx;
                }
                if (shape.y - shape.size / 2 < 0 || shape.y + shape.size / 2 > canvas.height) {
                    shape.dy = -shape.dy;
                }
            });
        };


        //let lastTime = 0;
        //const fps = 1; // Ziel-FPS (Beispiel: 10 FPS)
        //const frameDuration = 2000 / fps;

        //let yPos = 0;


        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            updateShapes();

            shapesArray.forEach((shape) => {
                // Draw shape and mirrored versions
                for (let section = 0; section < edge; section++) {
                    const angle = (section * 2 * Math.PI) / edge;
                    ctx.save();
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(angle);
                    drawShape(shape.x - canvas.width / 2, shape.y - canvas.height / 2, shape.size, shape.shape, shape.color);
                    ctx.restore();
                }
            });

            requestAnimationFrame(animate);
        };

        // Handle mouse movement
        const handleMouseMove = (e: MouseEvent) => {
            setMouse({ x: e.clientX, y: e.clientY });
        };

        // Add event listener for mouse movement
        window.addEventListener('mousemove', handleMouseMove);

        animate();

        return () => {
            // Cleanup on component unmount
            if (canvas) {
                canvas.width = 0;
                canvas.height = 0;
            }
        };
    }, [edge, shapes, minSize, maxSize, colors, quantity, speed, canvasWidth, canvasHeight, mouse]);

    return <canvas ref={canvasRef} />;
}
