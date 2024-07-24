export async function getPoints(src: string) {
  const response = await fetch(src);
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);

  const width = bitmap.width;
  const height = bitmap.height;

  // Create an offscreen canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  // Get the context
  const context = canvas.getContext("2d", { alpha: false })!;
  context.drawImage(bitmap, 0, 0);
  const imageData = Array.from(context.getImageData(0, 0, width, height).data);

  const points: { x: number; y: number; z: number }[] = [];

  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < imageData.length; i += 1) {
    const z = imageData[i];

    // No Point if the pixel is too bright
    if (imageData[i] > 200) continue;

    const x = ((i / 4) % width) - centerX + Math.random() * 0.2;
    const y = Math.floor(i / 4 / width) - centerY + Math.random() * 0.2;

    let adjustedZ = Math.sin((x + y) / 40) + z / 256;
    adjustedZ *= 1 - Math.abs(x) / centerX;

    points.push({
      x: x,
      y: -y,
      z: adjustedZ,
    });
  }
  console.log(points.length);

  return points;
}
