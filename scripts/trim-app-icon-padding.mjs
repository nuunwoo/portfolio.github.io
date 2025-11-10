import {readdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {deflateSync, inflateSync} from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appIconsDir = path.join(__dirname, '..', 'src', 'assets', 'icons', 'raw', 'app-icons');

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const crcTable = new Uint32Array(256).map((_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = (value & 1) !== 0 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

const crc32 = (buffer) => {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const paethPredictor = (left, up, upLeft) => {
  const predictor = left + up - upLeft;
  const leftDistance = Math.abs(predictor - left);
  const upDistance = Math.abs(predictor - up);
  const upLeftDistance = Math.abs(predictor - upLeft);
  if (leftDistance <= upDistance && leftDistance <= upLeftDistance) return left;
  if (upDistance <= upLeftDistance) return up;
  return upLeft;
};

const parsePng = (buffer) => {
  if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error('Unsupported PNG signature');
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      continue;
    }

    if (type === 'IDAT') {
      idatChunks.push(data);
      continue;
    }

    if (type === 'IEND') {
      break;
    }
  }

  if (!width || !height) throw new Error('Missing IHDR');
  if (bitDepth !== 8) throw new Error(`Unsupported bit depth: ${bitDepth}`);
  if (![6, 2, 0].includes(colorType)) throw new Error(`Unsupported color type: ${colorType}`);

  const bytesPerPixel = colorType === 6 ? 4 : colorType === 2 ? 3 : 1;
  const stride = width * bytesPerPixel;
  const inflated = inflateSync(Buffer.concat(idatChunks));
  const raw = Buffer.alloc(height * stride);

  let sourceOffset = 0;
  let targetOffset = 0;
  let previousRow = Buffer.alloc(stride);

  for (let y = 0; y < height; y += 1) {
    const filterType = inflated[sourceOffset];
    sourceOffset += 1;
    const row = inflated.subarray(sourceOffset, sourceOffset + stride);
    sourceOffset += stride;

    const reconstructed = Buffer.alloc(stride);
    for (let i = 0; i < stride; i += 1) {
      const left = i >= bytesPerPixel ? reconstructed[i - bytesPerPixel] : 0;
      const up = previousRow[i] ?? 0;
      const upLeft = i >= bytesPerPixel ? previousRow[i - bytesPerPixel] ?? 0 : 0;
      const current = row[i];

      switch (filterType) {
        case 0:
          reconstructed[i] = current;
          break;
        case 1:
          reconstructed[i] = (current + left) & 0xff;
          break;
        case 2:
          reconstructed[i] = (current + up) & 0xff;
          break;
        case 3:
          reconstructed[i] = (current + Math.floor((left + up) / 2)) & 0xff;
          break;
        case 4:
          reconstructed[i] = (current + paethPredictor(left, up, upLeft)) & 0xff;
          break;
        default:
          throw new Error(`Unsupported PNG filter: ${filterType}`);
      }
    }

    reconstructed.copy(raw, targetOffset);
    targetOffset += stride;
    previousRow = reconstructed;
  }

  const rgba = Buffer.alloc(width * height * 4);
  if (colorType === 6) {
    raw.copy(rgba);
  } else if (colorType === 2) {
    for (let i = 0, j = 0; i < raw.length; i += 3, j += 4) {
      rgba[j] = raw[i];
      rgba[j + 1] = raw[i + 1];
      rgba[j + 2] = raw[i + 2];
      rgba[j + 3] = 255;
    }
  } else {
    for (let i = 0, j = 0; i < raw.length; i += 1, j += 4) {
      const value = raw[i];
      rgba[j] = value;
      rgba[j + 1] = value;
      rgba[j + 2] = value;
      rgba[j + 3] = 255;
    }
  }

  return {width, height, rgba};
};

const encodeChunk = (type, data) => {
  const typeBuffer = Buffer.from(type, 'ascii');
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32BE(data.length, 0);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([lengthBuffer, typeBuffer, data, crcBuffer]);
};

const encodePng = ({width, height, rgba}) => {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * (stride + 1);
    raw[rowOffset] = 0;
    rgba.copy(raw, rowOffset + 1, y * stride, y * stride + stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = deflateSync(raw, {level: 9});

  return Buffer.concat([
    PNG_SIGNATURE,
    encodeChunk('IHDR', ihdr),
    encodeChunk('IDAT', idat),
    encodeChunk('IEND', Buffer.alloc(0)),
  ]);
};

const cropTransparentBounds = ({width, height, rgba}) => {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = rgba[(y * width + x) * 4 + 3];
      if (alpha === 0) continue;

      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX === -1 || maxY === -1) {
    return {width, height, rgba};
  }

  const croppedWidth = maxX - minX + 1;
  const croppedHeight = maxY - minY + 1;
  const cropped = Buffer.alloc(croppedWidth * croppedHeight * 4);

  for (let y = 0; y < croppedHeight; y += 1) {
    const sourceStart = ((minY + y) * width + minX) * 4;
    const sourceEnd = sourceStart + croppedWidth * 4;
    rgba.copy(cropped, y * croppedWidth * 4, sourceStart, sourceEnd);
  }

  return {
    width: croppedWidth,
    height: croppedHeight,
    rgba: cropped,
  };
};

const updateSvgContent = (svg, pngBuffer, width, height) => {
  const base64 = pngBuffer.toString('base64');
  const scaleX = (1 / width).toFixed(12).replace(/0+$/, '').replace(/\.$/, '');
  const scaleY = (1 / height).toFixed(12).replace(/0+$/, '').replace(/\.$/, '');

  let next = svg.replace(
    /<image([^>]*?)width="(\d+)" height="(\d+)"([^>]*?)xlink:href="data:image\/png;base64,[^"]+"([^>]*?)\/>/s,
    `<image$1width="${width}" height="${height}"$4xlink:href="data:image/png;base64,${base64}"$5/>`,
  );

  next = next.replace(
    /transform="scale\([^)]+\)"/,
    `transform="scale(${scaleX} ${scaleY})"`,
  );

  return next;
};

const run = async () => {
  const files = (await readdir(appIconsDir)).filter(name => name.endsWith('.svg'));

  for (const file of files) {
    const filePath = path.join(appIconsDir, file);
    const svg = await readFile(filePath, 'utf8');
    const base64Match = svg.match(/xlink:href="data:image\/png;base64,([^"]+)"/);
    if (!base64Match) continue;

    const originalPng = Buffer.from(base64Match[1], 'base64');
    const parsed = parsePng(originalPng);
    const cropped = cropTransparentBounds(parsed);

    if (cropped.width === parsed.width && cropped.height === parsed.height) {
      continue;
    }

    const nextPng = encodePng(cropped);
    const nextSvg = updateSvgContent(svg, nextPng, cropped.width, cropped.height);
    await writeFile(filePath, nextSvg, 'utf8');
    console.log(`trimmed ${file}: ${parsed.width}x${parsed.height} -> ${cropped.width}x${cropped.height}`);
  }
};

run().catch(error => {
  console.error(error);
  process.exit(1);
});
