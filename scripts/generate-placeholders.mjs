import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const palette = {
  background: [21, 17, 14, 255],
  panel: [33, 26, 22, 255],
  raised: [42, 33, 27, 255],
  border: [58, 44, 36, 255],
  cream: [247, 237, 226, 255],
  muted: [184, 168, 154, 255],
  caramel: [197, 139, 92, 255],
  green: [127, 176, 105, 255],
  ember: [231, 111, 81, 255],
  espresso: [63, 43, 31, 255]
};

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return c >>> 0;
});

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  const crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function createCanvas(width, height, fill = [0, 0, 0, 0]) {
  const pixels = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    pixels.set(fill, i * 4);
  }
  return { width, height, pixels };
}

function blend(canvas, x, y, color) {
  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
  const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
  const alpha = color[3] / 255;
  const inverse = 1 - alpha;
  canvas.pixels[index] = Math.round(color[0] * alpha + canvas.pixels[index] * inverse);
  canvas.pixels[index + 1] = Math.round(color[1] * alpha + canvas.pixels[index + 1] * inverse);
  canvas.pixels[index + 2] = Math.round(color[2] * alpha + canvas.pixels[index + 2] * inverse);
  canvas.pixels[index + 3] = Math.round(255 * alpha + canvas.pixels[index + 3] * inverse);
}

function fillRect(canvas, x, y, width, height, color) {
  for (let yy = Math.max(0, Math.floor(y)); yy < Math.min(canvas.height, y + height); yy += 1) {
    for (let xx = Math.max(0, Math.floor(x)); xx < Math.min(canvas.width, x + width); xx += 1) {
      blend(canvas, xx, yy, color);
    }
  }
}

function fillRoundedRect(canvas, x, y, width, height, radius, color) {
  for (let yy = Math.max(0, Math.floor(y)); yy < Math.min(canvas.height, y + height); yy += 1) {
    for (let xx = Math.max(0, Math.floor(x)); xx < Math.min(canvas.width, x + width); xx += 1) {
      const left = xx < x + radius;
      const right = xx >= x + width - radius;
      const top = yy < y + radius;
      const bottom = yy >= y + height - radius;
      const cornerX = left ? x + radius : right ? x + width - radius - 1 : xx;
      const cornerY = top ? y + radius : bottom ? y + height - radius - 1 : yy;
      const inCorner = (left || right) && (top || bottom);
      if (!inCorner || (xx - cornerX) ** 2 + (yy - cornerY) ** 2 <= radius ** 2) {
        blend(canvas, xx, yy, color);
      }
    }
  }
}

function strokeRoundedRect(canvas, x, y, width, height, radius, color, stroke = 2) {
  fillRoundedRect(canvas, x, y, width, stroke, radius, color);
  fillRoundedRect(canvas, x, y + height - stroke, width, stroke, radius, color);
  fillRoundedRect(canvas, x, y, stroke, height, radius, color);
  fillRoundedRect(canvas, x + width - stroke, y, stroke, height, radius, color);
}

function fillEllipse(canvas, cx, cy, rx, ry, color) {
  for (let yy = Math.floor(cy - ry); yy <= Math.ceil(cy + ry); yy += 1) {
    for (let xx = Math.floor(cx - rx); xx <= Math.ceil(cx + rx); xx += 1) {
      if (((xx - cx) ** 2) / (rx ** 2) + ((yy - cy) ** 2) / (ry ** 2) <= 1) {
        blend(canvas, xx, yy, color);
      }
    }
  }
}

function drawLine(canvas, x1, y1, x2, y2, color, thickness = 3) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
  for (let i = 0; i <= steps; i += 1) {
    const t = steps === 0 ? 0 : i / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    fillEllipse(canvas, x, y, thickness / 2, thickness / 2, color);
  }
}

function writePng(canvas, file) {
  const rows = [];
  for (let y = 0; y < canvas.height; y += 1) {
    rows.push(Buffer.from([0]));
    rows.push(canvas.pixels.subarray(y * canvas.width * 4, (y + 1) * canvas.width * 4));
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(canvas.width, 0);
  ihdr.writeUInt32BE(canvas.height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.concat(rows))),
    chunk("IEND", Buffer.alloc(0))
  ]);

  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, png);
}

function writePlaceholderCv() {
  const stream = [
    "BT",
    "/F1 26 Tf",
    "72 700 Td",
    "(Karim Merhi CV placeholder) Tj",
    "/F1 12 Tf",
    "0 -34 Td",
    "(Replace public/Karim-Merhi-CV.pdf with the final CV file.) Tj",
    "ET"
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`
  ];
  const offsets = [0];
  let pdf = "%PDF-1.4\n";

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  writeFileSync("public/Karim-Merhi-CV.pdf", pdf);
}

function drawBean() {
  const canvas = createCanvas(640, 640);
  fillEllipse(canvas, 320, 332, 182, 224, [197, 139, 92, 255]);
  fillEllipse(canvas, 266, 255, 78, 104, [222, 166, 108, 150]);
  fillEllipse(canvas, 390, 408, 86, 120, [107, 69, 43, 80]);

  for (let i = 0; i < 145; i += 1) {
    const y = 196 + i * 2.1;
    const x = 326 + Math.sin(i / 17) * 34;
    fillEllipse(canvas, x, y, 10, 12, [79, 48, 32, 120]);
  }

  fillEllipse(canvas, 252, 320, 18, 15, [33, 26, 22, 255]);
  fillEllipse(canvas, 394, 320, 18, 15, [33, 26, 22, 255]);
  drawLine(canvas, 284, 394, 322, 413, [33, 26, 22, 220], 7);
  drawLine(canvas, 322, 413, 366, 392, [33, 26, 22, 220], 7);

  drawLine(canvas, 226, 165, 198, 118, [247, 237, 226, 125], 10);
  drawLine(canvas, 198, 118, 224, 82, [247, 237, 226, 85], 9);
  drawLine(canvas, 328, 150, 350, 105, [247, 237, 226, 115], 10);
  drawLine(canvas, 350, 105, 326, 70, [247, 237, 226, 80], 9);
  drawLine(canvas, 428, 166, 458, 124, [247, 237, 226, 105], 10);
  drawLine(canvas, 458, 124, 434, 92, [247, 237, 226, 75], 9);

  fillEllipse(canvas, 320, 566, 176, 24, [0, 0, 0, 60]);
  writePng(canvas, "public/bean/sleepy-bean.png");
}

function drawGrid(canvas) {
  for (let x = 0; x < canvas.width; x += 48) {
    fillRect(canvas, x, 0, 1, canvas.height, [247, 237, 226, 10]);
  }
  for (let y = 0; y < canvas.height; y += 48) {
    fillRect(canvas, 0, y, canvas.width, 1, [247, 237, 226, 10]);
  }
}

function drawScreenshot(file, variant) {
  const canvas = createCanvas(1280, 800, palette.background);
  drawGrid(canvas);
  fillRoundedRect(canvas, 64, 64, 1152, 672, 18, palette.panel);
  strokeRoundedRect(canvas, 64, 64, 1152, 672, 18, palette.border, 3);

  fillRect(canvas, 64, 64, 1152, 72, [42, 33, 27, 255]);
  fillEllipse(canvas, 106, 100, 9, 9, palette.ember);
  fillEllipse(canvas, 136, 100, 9, 9, palette.caramel);
  fillEllipse(canvas, 166, 100, 9, 9, palette.green);

  fillRoundedRect(canvas, 106, 176, 285, 154, 14, palette.raised);
  fillRoundedRect(canvas, 420, 176, 285, 154, 14, palette.raised);
  fillRoundedRect(canvas, 734, 176, 285, 154, 14, palette.raised);
  fillRoundedRect(canvas, 1048, 176, 90, 154, 14, palette.raised);

  const statColors = [palette.green, palette.caramel, palette.ember, palette.muted];
  [128, 442, 756, 1070].forEach((x, index) => {
    fillEllipse(canvas, x, 210, 16, 16, statColors[index]);
    fillRoundedRect(canvas, x + 34, 198, 160, 14, 7, [184, 168, 154, 120]);
    fillRoundedRect(canvas, x + 34, 236, 116 + index * 20, 22, 8, [247, 237, 226, 210]);
    fillRoundedRect(canvas, x + 34, 282, 188 - index * 28, 11, 6, [197, 139, 92, 145]);
  });

  fillRoundedRect(canvas, 106, 370, 654, 286, 18, palette.raised);
  strokeRoundedRect(canvas, 106, 370, 654, 286, 18, palette.border, 2);
  fillRoundedRect(canvas, 808, 370, 330, 286, 18, palette.raised);
  strokeRoundedRect(canvas, 808, 370, 330, 286, 18, palette.border, 2);

  if (variant === "analytics") {
    for (let i = 0; i < 9; i += 1) {
      const barHeight = 55 + ((i * 37) % 160);
      const color = i % 3 === 0 ? palette.green : i % 3 === 1 ? palette.caramel : palette.ember;
      fillRoundedRect(canvas, 160 + i * 62, 612 - barHeight, 34, barHeight, 10, color);
    }
    fillEllipse(canvas, 972, 512, 96, 96, [197, 139, 92, 255]);
    fillEllipse(canvas, 936, 478, 58, 58, [127, 176, 105, 255]);
    fillEllipse(canvas, 1008, 552, 38, 38, [231, 111, 81, 255]);
    fillEllipse(canvas, 972, 512, 48, 48, palette.raised);
  } else if (variant === "mobile") {
    fillRoundedRect(canvas, 206, 416, 180, 44, 12, palette.green);
    fillRoundedRect(canvas, 206, 486, 268, 34, 11, [197, 139, 92, 190]);
    fillRoundedRect(canvas, 206, 548, 218, 34, 11, [231, 111, 81, 180]);
    fillRoundedRect(canvas, 886, 402, 174, 228, 28, [21, 17, 14, 255]);
    strokeRoundedRect(canvas, 886, 402, 174, 228, 28, palette.border, 4);
    fillRoundedRect(canvas, 912, 450, 122, 24, 10, palette.caramel);
    fillRoundedRect(canvas, 912, 502, 98, 18, 8, palette.green);
    fillRoundedRect(canvas, 912, 548, 132, 18, 8, palette.ember);
  } else {
    const points = [
      [152, 585],
      [240, 535],
      [330, 557],
      [426, 462],
      [526, 498],
      [686, 426]
    ];
    for (let i = 0; i < points.length - 1; i += 1) {
      drawLine(canvas, points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], palette.green, 9);
    }
    points.forEach(([x, y]) => fillEllipse(canvas, x, y, 13, 13, palette.cream));
    fillEllipse(canvas, 972, 512, 96, 96, [127, 176, 105, 255]);
    fillEllipse(canvas, 972, 512, 68, 68, [197, 139, 92, 255]);
    fillEllipse(canvas, 972, 512, 42, 42, palette.raised);
  }

  writePng(canvas, file);
}

drawBean();
drawScreenshot("public/projects/moniz/overview.png", "overview");
drawScreenshot("public/projects/moniz/analytics.png", "analytics");
drawScreenshot("public/projects/moniz/mobile.png", "mobile");
writePlaceholderCv();
