import fs from "node:fs";
import zlib from "node:zlib";

const inputs = [
  ["hongguo", "/tmp/plana_logo_work/hongguo.png"],
  ["pmi", "/tmp/plana_logo_work/pmi.png"],
  ["reelshort", "/tmp/plana_logo_work/reelshort.png"],
  ["xiaohongshu", "/tmp/plana_logo_work/xiaohongshu.png"],
  ["dramabox", "/tmp/plana_logo_work/dramabox.png"],
  ["pinedrama", "/tmp/plana_logo_work/pinedrama.png"],
  ["kwai", "/tmp/plana_logo_work/kwai.png"],
  ["meta", "/tmp/plana_logo_work/meta.png"],
];

const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function parsePng(file) {
  const data = fs.readFileSync(file);
  if (!data.subarray(0, 8).equals(PNG_SIG)) throw new Error(`${file} is not a PNG`);

  let pos = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 8;
  let colorType = 6;
  let palette = null;
  let transparency = null;
  const idat = [];

  while (pos < data.length) {
    const len = data.readUInt32BE(pos);
    const type = data.subarray(pos + 4, pos + 8).toString("ascii");
    const chunk = data.subarray(pos + 8, pos + 8 + len);
    pos += 12 + len;

    if (type === "IHDR") {
      width = chunk.readUInt32BE(0);
      height = chunk.readUInt32BE(4);
      bitDepth = chunk[8];
      colorType = chunk[9];
      if (bitDepth !== 8) throw new Error(`${file} uses unsupported bit depth ${bitDepth}`);
    } else if (type === "PLTE") {
      palette = [];
      for (let i = 0; i < chunk.length; i += 3) {
        palette.push([chunk[i], chunk[i + 1], chunk[i + 2], 255]);
      }
    } else if (type === "tRNS") {
      transparency = chunk;
    } else if (type === "IDAT") {
      idat.push(chunk);
    } else if (type === "IEND") {
      break;
    }
  }

  if (palette && transparency) {
    for (let i = 0; i < transparency.length; i += 1) {
      if (palette[i]) palette[i][3] = transparency[i];
    }
  }

  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 3 ? 1 : 0;
  if (!channels) throw new Error(`${file} uses unsupported color type ${colorType}`);

  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const scanlines = Buffer.alloc(height * stride);
  let src = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = raw[src++];
    const row = scanlines.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? scanlines.subarray((y - 1) * stride, y * stride) : null;
    raw.copy(row, 0, src, src + stride);
    src += stride;

    for (let x = 0; x < stride; x += 1) {
      const left = x >= channels ? row[x - channels] : 0;
      const up = prev ? prev[x] : 0;
      const upLeft = prev && x >= channels ? prev[x - channels] : 0;
      if (filter === 1) row[x] = (row[x] + left) & 255;
      if (filter === 2) row[x] = (row[x] + up) & 255;
      if (filter === 3) row[x] = (row[x] + Math.floor((left + up) / 2)) & 255;
      if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        row[x] = (row[x] + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft)) & 255;
      }
    }
  }

  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0, j = 0; i < scanlines.length; i += channels, j += 4) {
    if (colorType === 6) {
      rgba[j] = scanlines[i];
      rgba[j + 1] = scanlines[i + 1];
      rgba[j + 2] = scanlines[i + 2];
      rgba[j + 3] = scanlines[i + 3];
    } else if (colorType === 2) {
      rgba[j] = scanlines[i];
      rgba[j + 1] = scanlines[i + 1];
      rgba[j + 2] = scanlines[i + 2];
      rgba[j + 3] = 255;
    } else {
      const color = palette?.[scanlines[i]] ?? [0, 0, 0, 255];
      rgba[j] = color[0];
      rgba[j + 1] = color[1];
      rgba[j + 2] = color[2];
      rgba[j + 3] = color[3];
    }
  }

  return { width, height, rgba };
}

function backgroundLike(r, g, b, a) {
  if (a < 12) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const neutral = max - min < 18;
  const nearWhite = r > 224 && g > 224 && b > 224;
  const checker = neutral && r > 145 && r < 246;
  const nearBlack = max < 18;
  const metaGreen = g > 70 && g > r * 1.08 && g > b * 1.08;
  return nearWhite || checker || nearBlack || metaGreen;
}

function removeEdgeBackground(image) {
  const { width, height, rgba } = image;
  const seen = new Uint8Array(width * height);
  const queue = [];

  const enqueue = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (seen[idx]) return;
    const p = idx * 4;
    if (!backgroundLike(rgba[p], rgba[p + 1], rgba[p + 2], rgba[p + 3])) return;
    seen[idx] = 1;
    queue.push(idx);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  for (let head = 0; head < queue.length; head += 1) {
    const idx = queue[head];
    const x = idx % width;
    const y = Math.floor(idx / width);
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }

  for (let i = 0; i < seen.length; i += 1) {
    if (seen[i]) rgba[i * 4 + 3] = 0;
  }

  return image;
}

function trimTransparent(image, pad = 8) {
  const { width, height, rgba } = image;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (rgba[(y * width + x) * 4 + 3] > 8) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  if (maxX < minX || maxY < minY) return image;

  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  const nextWidth = maxX - minX + 1;
  const nextHeight = maxY - minY + 1;
  const next = Buffer.alloc(nextWidth * nextHeight * 4);
  for (let y = 0; y < nextHeight; y += 1) {
    const src = ((minY + y) * width + minX) * 4;
    const dst = y * nextWidth * 4;
    rgba.copy(next, dst, src, src + nextWidth * 4);
  }
  return { width: nextWidth, height: nextHeight, rgba: next };
}

function pngChunk(type, payload) {
  const typeBuffer = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(payload.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, payload])), 0);
  return Buffer.concat([len, typeBuffer, payload, crc]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let k = 0; k < 8; k += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writePng(file, image) {
  const { width, height, rgba } = image;
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y += 1) {
    const dst = y * (width * 4 + 1);
    raw[dst] = 0;
    rgba.copy(raw, dst + 1, y * width * 4, (y + 1) * width * 4);
  }

  fs.writeFileSync(
    file,
    Buffer.concat([
      PNG_SIG,
      pngChunk("IHDR", ihdr),
      pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
      pngChunk("IEND", Buffer.alloc(0)),
    ]),
  );
}

for (const [name, source] of inputs) {
  const image = trimTransparent(removeEdgeBackground(parsePng(source)), 18);
  writePng(`public/logos/${name}.png`, image);
  console.log(`${name}: ${image.width}x${image.height}`);
}
