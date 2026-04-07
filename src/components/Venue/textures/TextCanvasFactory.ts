/**
 * Factory for creating text label canvas textures.
 */

import { FONT_FAMILY } from "../core/constants";

export interface TextCanvasOptions {
  fontSize?: number;
  color?: string;
  bgColor?: string;
  width?: number;
  height?: number;
  bold?: boolean;
  borderRadius?: number;
}

/**
 * Creates an HTML canvas with centered, word-wrapped text.
 * Used for label sprites and sign textures.
 */
export function createTextCanvas(
  text: string,
  opts: TextCanvasOptions = {},
): HTMLCanvasElement {
  const {
    fontSize = 48,
    color = "#ffffff",
    bgColor = "transparent",
    width = 512,
    height = 128,
    bold = true,
    borderRadius = 0,
  } = opts;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Background
  if (bgColor !== "transparent") {
    ctx.fillStyle = bgColor;
    if (borderRadius > 0) {
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, borderRadius);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, width, height);
    }
  }

  // Text
  ctx.fillStyle = color;
  ctx.font = `${bold ? "bold " : ""}${fontSize}px ${FONT_FAMILY}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Word wrapping
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + " " + words[i];
    if (ctx.measureText(testLine).width < width - 20) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);

  const lineHeight = fontSize * 1.2;
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight);
  });

  return canvas;
}
