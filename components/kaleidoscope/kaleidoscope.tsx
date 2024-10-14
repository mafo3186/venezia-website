// component/Kaleidoscope.tsx
'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './kaleidoscope.module.css';

type KaleidoscopeProps = {
  edge?: number; // Number of mirror sections
  shapes?: string[]; // Shapes to render
  minSize?: number; // Minimum size of shapes
  maxSize?: number; // Maximum size of shapes
  colors?: string[]; // Colors of shapes
  quantity?: number; // Number of shapes
  speed?: number; // Movement speed of shapes
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
  speed = 0.01, // Default speed
  ...props
}: KaleidoscopeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const targetSpeed = useRef(speed)

  useEffect(() => { targetSpeed.current = speed }, [speed])

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const observer = new ResizeObserver((entries) => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    });
    observer.observe(canvas);

    const newShapesArray: Shape[] = [];
    for (let i = 0; i < quantity; i++) {
      const size = minSize + Math.random() * (maxSize - minSize);
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const x = size / 2 + Math.random() * (canvas.width - size);
      const y = size / 2 + Math.random() * (canvas.height - size);
      const velocity = {
        x: (Math.random() - 0.5), // Initial random velocity in x direction
        y: (Math.random() - 0.5), // Initial random velocity in y direction
      };
      newShapesArray.push({ x, y, size, shape, color, velocity });
    }

    let lastTime = 0;
    let latestFrame = 0;
    let currentSpeed = targetSpeed.current;

    function animate(time: DOMHighResTimeStamp) {
      if (!ctx) return;
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const delta = lastTime ? time - lastTime : 0;

      currentSpeed = expDecay(currentSpeed, targetSpeed.current, .008, delta);

      newShapesArray.forEach((shape) => {
        shape.x += shape.velocity.x * delta * currentSpeed;
        shape.y += shape.velocity.y * delta * currentSpeed;

        // Bounce off edges
        if (shape.x - shape.size / 2 < 0 || shape.x + shape.size / 2 > canvas.width) {
          shape.velocity.x = -shape.velocity.x;
        }
        if (shape.y - shape.size / 2 < 0 || shape.y + shape.size / 2 > canvas.height) {
          shape.velocity.y = -shape.velocity.y;
        }
      });

      newShapesArray.forEach((shape) => {
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

      lastTime = time;
      latestFrame = requestAnimationFrame(animate);
    }

    // Start animation
    animate(0);

    return () => {
      if (latestFrame) cancelAnimationFrame(latestFrame);
      observer.disconnect();
    }
  },
    // shapes & colors are unpacked so that they can be compared by value
    [edge, ...shapes, minSize, maxSize, ...colors, quantity]
  );

  return <canvas className={styles.kaleidoscopeCanvas} ref={canvasRef} />;
}

// thank u freya :green_heart:
// https://www.youtube.com/watch?v=LSNQuFEDOyQ
function expDecay(a: number, b: number, decay: number, delta: number) {
  return b + (a - b) * Math.exp(-decay * delta);
}

function drawShape(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, shape: string, color: string) {
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
}
