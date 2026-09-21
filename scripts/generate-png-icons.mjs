import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c;
  }
  return table;
}

const crcTable = createCrcTable();

function calculateCrc(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(typeStr, data) {
  const typeBuf = Buffer.from(typeStr, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const toCrc = Buffer.concat([typeBuf, data]);
  const crc = calculateCrc(toCrc);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generatePng(size, isMaskable = false) {
  const width = size;
  const height = size;

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const raw = Buffer.alloc(height * (1 + width * 4));
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * (isMaskable ? 0.5 : 0.45);
  const cornerRadius = isMaskable ? 0 : width * 0.22;

  let pos = 0;
  for (let y = 0; y < height; y++) {
    raw[pos++] = 0; // filter byte: None
    const ny = y / height;

    for (let x = 0; x < width; x++) {
      const nx = x / width;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Check rounded rect boundary
      let inside = true;
      if (!isMaskable) {
        const rx = Math.max(0, Math.abs(dx) - (cx - cornerRadius));
        const ry = Math.max(0, Math.abs(dy) - (cy - cornerRadius));
        if (Math.sqrt(rx * rx + ry * ry) > cornerRadius) {
          inside = false;
        }
      }

      if (!inside) {
        raw[pos++] = 0;
        raw[pos++] = 0;
        raw[pos++] = 0;
        raw[pos++] = 0;
        continue;
      }

      // Emerald green gradient (#059669 -> #064e3b)
      const gradT = (nx + ny) * 0.5;
      let r = Math.round(5 + gradT * (6 - 5));
      let g = Math.round(150 - gradT * 70);
      let b = Math.round(105 - gradT * 45);

      // Stylized K and leaf coordinates inside safe zone
      // Safe zone is central 60%
      const kx = (x - cx) / (width * 0.5);
      const ky = (y - cy) / (height * 0.5);

      let isWhite = false;
      let isAccent = false;

      // Vertical stem of K: -0.45 <= kx <= -0.15, -0.6 <= ky <= 0.6
      if (kx >= -0.42 && kx <= -0.18 && ky >= -0.55 && ky <= 0.55) {
        isWhite = true;
      }

      // Upper arm of K (diagonal leaf):
      // line from (-0.18, 0.0) to (0.45, -0.55)
      const arm1Dist = Math.abs((ky - 0.0) - (-0.55 / 0.63) * (kx + 0.18));
      if (kx >= -0.18 && kx <= 0.45 && ky <= 0.1 && arm1Dist < 0.18) {
        isAccent = true;
      }

      // Lower arm of K:
      // line from (-0.15, 0.0) to (0.42, 0.55)
      const arm2Dist = Math.abs((ky - 0.0) - (0.55 / 0.57) * (kx + 0.15));
      if (kx >= -0.15 && kx <= 0.42 && ky >= -0.05 && arm2Dist < 0.17) {
        isWhite = true;
      }

      // Golden dot beacon at top right (0.42, -0.52)
      const dotDist = Math.sqrt((kx - 0.42) ** 2 + (ky - -0.52) ** 2);
      if (dotDist < 0.12) {
        r = 251;
        g = 191;
        b = 36;
      } else if (isAccent) {
        // Light emerald leaf
        r = 52;
        g = 211;
        b = 153;
      } else if (isWhite) {
        r = 255;
        g = 255;
        b = 255;
      }

      raw[pos++] = r;
      raw[pos++] = g;
      raw[pos++] = b;
      raw[pos++] = 255;
    }
  }

  const deflated = zlib.deflateSync(raw, { level: 9 });
  const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const chunkIHDR = makeChunk('IHDR', ihdr);
  const chunkIDAT = makeChunk('IDAT', deflated);
  const chunkIEND = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngHeader, chunkIHDR, chunkIDAT, chunkIEND]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. 192x192
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, false));
console.log('Generated pwa-192x192.png');

// 2. 512x512
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, false));
console.log('Generated pwa-512x512.png');

// 3. 512x512 maskable (full bleed background)
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, true));
console.log('Generated pwa-maskable-512x512.png');

// 4. Apple Touch Icon 180x180
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, false));
console.log('Generated apple-touch-icon.png');

// 5. Favicon
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generatePng(64, false));
console.log('Generated favicon.ico');
