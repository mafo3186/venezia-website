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
    velocity: { x: number; y: number };
};

export default function Kaleidoscope({
    edge = 8, // Default: 8 sections for mirror
    shapes = ['circle', 'square', 'triangle'], // Default shapes
    minSize = 20, // Minimum size
    maxSize = 50, // Maximum size
    colors = ['#f133ff', '#a792f8', '#3357FF'], // Default colors
    quantity = 30, // Number of shapes
    speed = 0.1, // Default speed
    canvasWidth = 100,
    canvasHeight = 100,
}: KaleidoscopeProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [mouseDirection, setMouseDirection] = useState({ x: 0, y: 0 }); // Mausrichtung als State
    const [dimensions, setDimensions] = useState({ width: canvasWidth, height: canvasHeight, center: { x: canvasWidth / 2, y: canvasHeight / 2 } });
    const [shapesArray, setShapesArray] = useState<Shape[]>([]);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            updateDimensions();
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                updateDimensions();
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    const updateDimensions = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight, center: { x: window.innerWidth / 2, y: window.innerHeight / 2 } });
    };

    // Generate random shapes
    const generateShapes = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const newShapesArray: Shape[] = [];
        for (let i = 0; i < quantity; i++) {
            const size = minSize + Math.random() * (maxSize - minSize);
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const x = size / 2 + Math.random() * (canvas.width - size);
            const y = size / 2 + Math.random() * (canvas.height - size);
            const velocity = {
                x: (Math.random() - 0.5) * speed * 4, // Initial random velocity in x direction
                y: (Math.random() - 0.5) * speed * 4, // Initial random velocity in y direction
            };
            newShapesArray.push({ x, y, size, shape, color, velocity });
        }
        setShapesArray(newShapesArray);
    };

    // Draw shape in CanvasRenderingContext2D
    const drawShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, shape: string, color: string) => {
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
        } else if (shape === 'pentagon') {
            ctx.moveTo(x, y - size / 2);
            ctx.lineTo(x + size / 2, y - size / 4);
            ctx.lineTo(x + size / 4, y + size / 2);
            ctx.lineTo(x - size / 4, y + size / 2);
            ctx.lineTo(x - size / 2, y - size / 4);
            ctx.lineTo(x, y - size / 2);
        } else if (shape === 'butterfly') {
            ctx.moveTo(x - size / 2, y - size / 2);
            ctx.lineTo(x + size / 2, y + size / 2);
            ctx.lineTo(x - size / 2, y + size / 2);
            ctx.lineTo(x + size / 2, y - size / 2);
            ctx.lineTo(x - size / 2, y - size / 2);
        } else if (shape === 'heart') {
            ctx.moveTo(x, y - size / 4);
            ctx.quadraticCurveTo(x + size / 2, y - size / 2, x + size / 2, y);
            ctx.quadraticCurveTo(x + size / 2, y + size / 2, x, y + size / 2);
            ctx.quadraticCurveTo(x - size / 2, y + size / 2, x - size / 2, y);
            ctx.quadraticCurveTo(x - size / 2, y - size / 2, x, y - size / 4);
        } else if (shape === 'moon') {
            ctx.arc(x, y, size / 2, 0, Math.PI, true);
        } else if (shape === 'cloud') {
            ctx.arc(x - size / 4, y, size / 4, 0, Math.PI * 2);
            ctx.arc(x + size / 4, y, size / 4, 0, Math.PI * 2);
            ctx.arc(x, y - size / 4, size / 4, 0, Math.PI * 2);
        } else if (shape === 'drop') {
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            ctx.moveTo(x - size / 2, y);
            ctx.quadraticCurveTo(x, y + size / 2, x + size / 2, y);
        } else if (shape === 'amoeba') {
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            ctx.arc(x - size / 4, y - size / 4, size / 4, 0, Math.PI * 2);
            ctx.arc(x + size / 4, y + size / 4, size / 4, 0, Math.PI * 2);
        }
        ctx.closePath();
        ctx.fill();
    };

    const updateShapes = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        shapesArray.forEach((shape) => {
            // Update shape directions based on velocity and mouse position influence
            shape.velocity.x += mouseDirection.x * 0.01 * speed;
            shape.velocity.y += mouseDirection.y * 0.01 * speed;

            shape.x += shape.velocity.x;
            shape.y += shape.velocity.y;

            // Bounce off edges
            if (shape.x - shape.size / 2 < 0 || shape.x + shape.size / 2 > canvas.width) {
                shape.velocity.x = -shape.velocity.x;
            }
            if (shape.y - shape.size / 2 < 0 || shape.y + shape.size / 2 > canvas.height) {
                shape.velocity.y = -shape.velocity.y;
            }
        });
    };

    // Animation function
    const animate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        updateShapes();

        shapesArray.forEach((shape) => {
            // Draw shape and mirrored versions
            for (let section = 0; section < edge; section++) {
                const angle = (section * 2 * Math.PI) / edge;
                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(angle);
                drawShape(ctx, shape.x - canvas.width / 2, shape.y - canvas.height / 2, shape.size, shape.shape, shape.color);
                ctx.restore();
            }
        });

        animationRef.current = requestAnimationFrame(animate);
    };

    /*
    const stopAnimation = () => {
        shapesArray.forEach((shape) => {
            shape.velocity.x = 0;
            shape.velocity.y = 0;
        });
        setShapesArray([...shapesArray]);

        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    };

    const removeShapes = () => {
        setShapesArray([]);
    };
    */

    // Function to handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
        const distanceFromCenter = Math.sqrt((e.clientX - dimensions.center.x) ** 2 + (e.clientY - dimensions.center.y) ** 2);
        if (distanceFromCenter !== 0) {
            const directionX = (e.clientX - dimensions.center.x) / distanceFromCenter;
            const directionY = (e.clientY - dimensions.center.y) / distanceFromCenter;
            setMouseDirection({ x: directionX, y: directionY });
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        generateShapes();

        // Add mouse movement event listener
        window.addEventListener('mousemove', handleMouseMove);

        // Start animation
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

    return <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} />;
}
