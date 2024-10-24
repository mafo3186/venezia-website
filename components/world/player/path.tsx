import { Vector3 } from "three";

function catmullRom(t: number, p0: number, p1: number, p2: number, p3: number) {
  const v0 = (p2 - p0) * 0.5;
  const v1 = (p3 - p1) * 0.5;
  const t2 = t * t;
  const t3 = t * t2;
  return (
    (2 * p1 - 2 * p2 + v0 + v1) * t3 +
    (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 +
    v0 * t +
    p1
  );
}

function catmullRom3d(p0: Vector3, p1: Vector3, p2: Vector3, p3: Vector3, t: number, destination: Vector3) {
  destination.set(
    catmullRom(t, p0.x, p1.x, p2.x, p3.x),
    catmullRom(t, p0.y, p1.y, p2.y, p3.y),
    catmullRom(t, p0.z, p1.z, p2.z, p3.z),
  );
}

function sampleCatmullRom(points: Vector3[], steps: number): Vector3[] {
  const destination: Vector3[] = [];
  for (let i = 1; i < points.length; i++) {
    const start = points[i - 1];
    const end = points[i];
    for (let j = 0; j < steps; j++) {
      const t = j / steps;
      const p0 = points[Math.max(i - 2, 0)];
      const p3 = points[Math.min(i + 1, points.length - 1)];
      const p = new Vector3();
      catmullRom3d(p0, start, end, p3, t, p);
      destination.push(p);
    }
  }
  destination.push(points.at(-1)!);
  return destination;
}

/**
 * Simplifies a path by removing points that are too close together.
 * Start and end points are always preserved, collapsed points are averaged.
 * @param points the path to simplify
 * @param tolerance the minimum distance between points to keep
 * @returns the simplified path
 */
export function simplify(points: Vector3[], tolerance: number): Vector3[] {
  if (points.length <= 2) return points;
  let lastPoint = points[0];
  const simplified: Vector3[] = [];
  let sum = lastPoint.clone();
  let count = 1;
  for (let i = 1; i < points.length; i++) {
    const currentPoint = points[i];
    const distance = lastPoint.distanceTo(currentPoint);
    if (distance >= tolerance) {
      simplified.push(simplified.length === 0 ? lastPoint : sum.divideScalar(count));
      lastPoint = currentPoint;
      sum = currentPoint.clone();
      count = 1;
    } else {
      sum.add(currentPoint);
      count++;
    }
  }
  if (simplified.length === 0) {
    simplified.push(lastPoint);
  }
  simplified.push(points[points.length - 1]);
  return simplified;
}

export class Path3D {
  public length: number;
  private segmentLengths: number[];
  private segmentStart = new Vector3();

  constructor(
    public points: Vector3[],
    public smooth: boolean = true,
  ) {
    this.points = smooth
      ? sampleCatmullRom(this.points, 8)
      : this.points.map((p) => p.clone());
    this.segmentLengths = [];
    let length = 0;
    let previous = this.points[0].clone();
    for (let i = 1; i < this.points.length; i++) {
      const point = this.points[i];
      const segmentLength = previous.distanceTo(point);
      this.segmentLengths.push(segmentLength);
      length += segmentLength;
      previous.copy(point);
    }
    this.length = length;
  }

  at(t: number, destination: Vector3) {
    const distance = t * this.length;
    let segmentStart = new Vector3().copy(this.points[0]);
    let previousDistance = 0;
    for (let i = 1; i < this.points.length; i++) {
      const segmentEnd = this.points[i];
      const segmentLength = this.segmentLengths[i - 1];
      const nextDistance = previousDistance + segmentLength;
      if (nextDistance >= distance) {
        const segmentT = (distance - previousDistance) / segmentLength;
        const p0 = this.points[Math.max(i - 2, 0)];
        const p3 = this.points[Math.min(i + 1, this.points.length - 1)];
        if (this.smooth) {
          catmullRom3d(p0, segmentStart, segmentEnd, p3, segmentT, destination);
        } else {
          destination.copy(segmentStart).lerp(segmentEnd, segmentT);
        }
        return;
      }
      segmentStart.copy(segmentEnd);
      previousDistance = nextDistance;
    }
    destination.copy(segmentStart);
  }
}
