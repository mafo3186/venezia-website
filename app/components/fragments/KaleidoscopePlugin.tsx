'use client';

import React, { useEffect, useRef } from 'react';

interface IOptions {
    selector: string;
    edge?: number;
    shapes?: string[];
    minSize?: number;
    maxSize?: number;
    color?: string[];
    globalCompositeOperation?: string;
    quantity?: number;
    speed?: number;
}

const defaultOptions: IOptions = {
    color: ['#FFD1B9', '#564138', '#2E86AB', '#F5F749', '#F24236'],
    edge: 10,
    globalCompositeOperation: 'overlay',
    maxSize: 50,
    minSize: 30,
    quantity: 50,
    selector: '',
    shapes: ['square', 'circle', 'wave'],
    speed: 0.3,
};

const getRandomInt = (max: number): number => Math.floor(Math.random() * max);

// Hilfsfunktion zum Rotieren eines Punktes
const rotate = (
    x: number,
    y: number,
    centerX: number,
    centerY: number,
    rad: number
) => {
    const X =
        Math.cos(rad) * (x - centerX) - Math.sin(rad) * (y - centerY) + centerX;
    const Y =
        Math.sin(rad) * (x - centerX) + Math.cos(rad) * (y - centerY) + centerY;
    return { x: X, y: Y };
};

class Pipe {
    directionX: number = 0;
    directionY: number = 0;

    private options: IOptions;
    private context: CanvasRenderingContext2D;
    private radianAOB: number;
    private pointO: { x: number; y: number } = { x: 0, y: 0 };
    private pointA: { x: number; y: number } = { x: 0, y: 0 };
    private pointB: { x: number; y: number } = { x: 0, y: 0 };
    private isSharp: boolean = false;
    private inclinationOA: number = 0;
    private interceptOA: number = 0;
    private inclinationOB: number = 0;
    private interceptOB: number = 0;
    private inclinationAB: number = 0;
    private interceptAB: number = 0;
    private listenerMousemove: (ev: MouseEvent) => void;

    constructor(context: CanvasRenderingContext2D, options: IOptions) {
        this.context = context;
        this.options = { ...defaultOptions, ...options };
        this.radianAOB = (2 * Math.PI) / this.options.edge!;
        this.calculateBorder();
        this.initializeEvents();
    }

    getPointO() {
        return this.pointO;
    }

    getRandomCoordinates() {
        const x =
            getRandomInt(Math.max(this.pointO.x, this.pointB.x) - this.pointA.x) +
            this.pointA.x;

        let minY, maxY, y;
        if (this.isSharp) {
            minY = Math.max(
                this.inclinationOB * x + this.interceptOB,
                this.inclinationAB * x + this.interceptAB
            );
            maxY = this.inclinationOA * x + this.interceptOA;
        } else {
            minY = this.inclinationAB * x + this.interceptAB;
            maxY = Math.min(
                this.inclinationOA * x + this.interceptOA,
                this.inclinationOB * x + this.interceptOB
            );
        }
        y = getRandomInt(maxY - minY) + minY;
        return { x, y };
    }

    mirror(index: number, drawFunc: () => void) {
        const context = this.context;
        context.save();
        context.translate(this.pointO.x, this.pointO.y);
        context.rotate(this.radianAOB * index);
        context.translate(-this.pointO.x, -this.pointO.y);

        context.beginPath();
        context.moveTo(this.pointO.x, this.pointO.y);
        context.lineTo(this.pointA.x, this.pointA.y);
        context.lineTo(this.pointB.x, this.pointB.y);
        context.closePath();
        context.clip();

        drawFunc();

        context.restore();
    }

    destroy() {
        window.removeEventListener('mousemove', this.listenerMousemove);
    }

    resize() {
        this.calculateBorder();
    }

    private initializeEvents() {
        this.listenerMousemove = (event: MouseEvent) => {
            const unit = Math.sqrt(
                (event.clientX - this.pointO.x) ** 2 +
                (event.clientY - this.pointO.y) ** 2
            );
            if (unit === 0) return;

            this.directionX = (event.clientX - this.pointO.x) / unit;
            this.directionY = (event.clientY - this.pointO.y) / unit;
            const element = document.querySelector(this.options.selector!);
            if (element) {
                element.dispatchEvent(new Event('change:direction'));
            }
        };
        window.addEventListener('mousemove', this.listenerMousemove);
    }

    private calculateBorder() {
        const canvas = document.querySelector<HTMLCanvasElement>(
            this.options.selector!
        );
        if (canvas) {
            this.pointO.x = canvas.offsetParent
                ? canvas.offsetParent.clientWidth / 2
                : canvas.clientWidth / 2;
            this.pointO.y = canvas.offsetParent
                ? canvas.offsetParent.clientHeight / 2
                : canvas.clientHeight / 2;

            const diagonal = Math.sqrt(this.pointO.x ** 2 + this.pointO.y ** 2);
            const radius = diagonal / Math.cos(this.radianAOB / 2);
            this.pointA = {
                x: (1 - radius / diagonal) * this.pointO.x,
                y: (1 - radius / diagonal) * this.pointO.y,
            };
            this.pointB = rotate(
                this.pointA.x,
                this.pointA.y,
                this.pointO.x,
                this.pointO.y,
                this.radianAOB
            );

            this.isSharp = this.pointB.x < this.pointO.x;
            this.inclinationOA = (this.pointA.y - this.pointO.y) / (this.pointA.x - this.pointO.x);
            this.interceptOA = this.pointO.y - this.inclinationOA * this.pointO.x;
            this.inclinationOB = (this.pointB.y - this.pointO.y) / (this.pointB.x - this.pointO.x);
            this.interceptOB = this.pointO.y - this.inclinationOB * this.pointO.x;
            this.inclinationAB = (this.pointB.y - this.pointA.y) / (this.pointB.x - this.pointA.x);
            this.interceptAB = this.pointA.y - this.inclinationAB * this.pointA.x;
        }
    }
}

const Kaleidoscope: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (context) {
            const options: IOptions = {
                selector: '#kaleidoscope',
            };

            const pipe = new Pipe(context, options);

            return () => {
                pipe.destroy();
            };
        }
    }, []);

    return <canvas id="kaleidoscope" ref={canvasRef} width={500} height={500} />;
};

export default Kaleidoscope;
