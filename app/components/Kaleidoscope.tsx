// component/Kaleidoscope.tsx
'use client';

import { dir } from 'console';
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
    const [mouseDirection, setMouseDirection] = useState({ x: 0, y: 0 }); // Mausrichtung
    const center = { x: canvasWidth / 2, y: canvasHeight / 2 };
    let directionX = 0;
    let directionY = 0;

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
            const dx = (Math.random() - 0.5) * speed * 4; // Random velocity
            const dy = (Math.random() - 0.5) * speed * 4; // Random velocity

            shapesArray.push({ x, y, size, shape, color, dx, dy });
        }

        // Draw shape in CanvasRenderingContext2D
        // toDo: Add more shapes
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
                // Update shape directions based on velocity (dx, dy) and mouse position influence
                shape.x += shape.dx += mouseDirection.x * 0.01 * speed; //
                shape.y += shape.dy += mouseDirection.y * 0.01 * speed;

                // Bounce off edges
                if (shape.x - shape.size / 2 < 0 || shape.x + shape.size / 2 > canvas.width) {
                    shape.dx = -shape.dx;
                }
                if (shape.y - shape.size / 2 < 0 || shape.y + shape.size / 2 > canvas.height) {
                    shape.dy = -shape.dy;
                }
            });
        };


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
            //setMouse({ x: e.clientX, y: e.clientY });
            const distanceFromCenter = Math.sqrt((e.clientX - center.x) ** 2 + (e.clientY - center.y) ** 2); // Pythagoras für Berechnung von Werten, die von der Mausposition in Abhängigkeit zum Mittelpunkt abhängen
            if (distanceFromCenter != 0) {

                directionX = (e.clientX - center.x) / distanceFromCenter; // Mausrichtung x
                directionY = (e.clientY - center.y) / distanceFromCenter; // Mausrichtung y
                setMouseDirection({
                    x: directionX,
                    y: directionY
                });
            }
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
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [edge, shapes, minSize, maxSize, colors, quantity, speed, canvasWidth, canvasHeight, mouseDirection]);

    return <canvas ref={canvasRef} />;
}
