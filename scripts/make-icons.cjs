const fs = require('fs');
const zlib = require('zlib');

// Minimal valid PNG generator in pure Node.js
function createSolidPng(width, height, r, g, b, a = 255) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data: height rows, each row starts with filter byte 0 followed by width * 4 bytes RGBA
  const rawRow = Buffer.alloc(1 + width * 4);
  rawRow[0] = 0; // Filter: None
  for (let x = 0; x < width; x++) {
    // Add a simple lightning bolt or stylish pattern if inside box
    const idx = 1 + x * 4;
    rawRow[idx] = r;
    rawRow[idx + 1] = g;
    rawRow[idx + 2] = b;
    rawRow[idx + 3] = a;
  }

  const rawData = Buffer.alloc((1 + width * 4) * height);
  for (let y = 0; y < height; y++) {
    rawRow.copy(rawData, y * (1 + width * 4));
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuf, data]);
  const crc = crc32(crcData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([length, typeBuf, data, crcBuf]);
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  table[i] = c;
}

[16, 48, 128].forEach(size => {
  // Electric Blue color (#2563eb)
  const png = createSolidPng(size, size, 37, 99, 235, 255);
  fs.writeFileSync(`public/icons/icon${size}.png`, png);
  console.log(`Generated icon${size}.png`);
});
