/**
 * Factory for creating speaker card canvas textures.
 */

import type * as THREE_TYPES from "three";
import { getAssetUrl } from "../core/ModelLoader";
import { BLOB_COLORS, FONT_FAMILY } from "../core/constants";

/**
 * Word-wraps text on a 2D canvas context.
 * Returns the Y position after the last line.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
}

/**
 * Creates a CanvasTexture for a speaker card with:
 * - White rounded-rect background
 * - Organic blob in a rotating palette color
 * - Speaker name, title, company
 * - Circular photo (loaded async, updates texture on load)
 * - Session time range
 */
export function createSpeakerCardTexture(
  speaker: Speaker,
  session: SINFOSession | undefined,
  index: number,
  THREE: typeof THREE_TYPES,
): THREE_TYPES.CanvasTexture {
  const w = 560;
  const h = 760;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const blobColor = BLOB_COLORS[index % BLOB_COLORS.length];

  // ── Draw base layout ──
  const drawBase = () => {
    ctx.clearRect(0, 0, w, h);

    // Background (white rounded rect)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 60);
    ctx.fill();

    // Bottom organic blob area (SpeakerBlob exact path)
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 60);
    ctx.clip();

    const blobPath = new Path2D(
      "M42.5,-62.1C54.1,-50,62,-36.3,65.3,-22.2C68.6,-8,67.3,6.7,64.1,22.2C61,37.6,55.9,53.8,44.9,61.1C33.9,68.5,16.9,66.9,-1.1,68.4C-19.1,69.9,-38.2,74.3,-53.8,68.5C-69.4,62.7,-81.6,46.6,-82.1,30.2C-82.5,13.8,-71.2,-2.8,-60.5,-14.7C-49.8,-26.5,-39.6,-33.5,-29.6,-46.1C-19.6,-58.8,-9.8,-77,2.8,-80.9C15.4,-84.8,30.8,-74.2,42.5,-62.1Z",
    );

    ctx.fillStyle = blobColor;
    ctx.translate(w / 2, h - 300 + 120);
    ctx.scale(3, 3);
    ctx.fill(blobPath);
    ctx.restore();

    // Name
    ctx.fillStyle = "#1c2b70";
    ctx.font = `bold 50px ${FONT_FAMILY}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    const paddingLeft = 50;
    const topOfTitleY = wrapText(
      ctx,
      speaker.name,
      paddingLeft,
      70,
      w - paddingLeft * 2,
      60,
    );

    // Title
    ctx.fillStyle = "#6b7280";
    ctx.font = `500 28px ${FONT_FAMILY}`;
    const topOfCompY = wrapText(
      ctx,
      speaker.title,
      paddingLeft,
      topOfTitleY + 15,
      w - paddingLeft * 2,
      40,
    );

    // Company
    if (speaker.company?.name) {
      ctx.fillStyle = "#9ca3af";
      ctx.font = `24px ${FONT_FAMILY}`;
      wrapText(
        ctx,
        speaker.company.name,
        paddingLeft,
        topOfCompY + 10,
        w - paddingLeft * 2,
        34,
      );
    }

    // Session time
    if (session) {
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold 32px ${FONT_FAMILY}`;
      ctx.textAlign = "center";

      const date = new Date(session.date);
      const startTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const endDate = new Date(date.getTime() + session.duration * 60000);
      const endTime = endDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      ctx.fillText(`${startTime} - ${endTime}`, w / 2, h - 60);
    }
  };

  drawBase();

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = true;

  // ── Speaker photo ──
  const imgY = 504;
  const imgR = 192;

  const drawImagePlaceholder = () => {
    ctx.fillStyle = "#e5e7eb";
    ctx.beginPath();
    ctx.arc(w / 2, imgY, imgR, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    tex.needsUpdate = true;
  };

  if (speaker.img) {
    getAssetUrl(speaker.img).then((assetUrl) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = assetUrl;
      img.onload = () => {
        drawBase();

        ctx.save();
        ctx.beginPath();
        ctx.arc(w / 2, imgY, imgR, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const ratio = Math.max((imgR * 2) / img.width, (imgR * 2) / img.height);
        const dw = img.width * ratio;
        const dh = img.height * ratio;
        ctx.drawImage(img, w / 2 - dw / 2, imgY - dh / 2, dw, dh);
        ctx.restore();

        // Border
        ctx.beginPath();
        ctx.arc(w / 2, imgY, imgR, 0, Math.PI * 2);
        ctx.lineWidth = 12;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();

        tex.needsUpdate = true;
      };
      img.onerror = () => {
        drawImagePlaceholder();
      };
    });
  } else {
    drawImagePlaceholder();
  }

  return tex;
}
