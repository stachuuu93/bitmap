const { stdin } = require('process');

const Bitmap = require('./bitmap');

function readStdin() {
  return new Promise((resolve, reject) => {
    const linesRaw = [];

    stdin.on('data', (chunk) => {
      linesRaw.push(chunk);
    });

    stdin.on('end', () => {
      resolve(Buffer.concat(linesRaw));
    });

    stdin.on('error', reject);
  });
}

function parseInput(raw) {
  try {
    const lines = raw.toString().split('\n').filter(Boolean);
    const result = [];
    let [firstLine, ...rest] = lines;
    let numberOfTestCases = parseInt(firstLine);
    while (numberOfTestCases) {
      [firstLine, ...rest] = rest;
      const [rows, columns] = firstLine.split(' ').map(Number);
      const bitmap = rest.splice(0, rows)
        .reduce((result, row) => [...result, row.split('').map(Number)], []);
      result.push(new Bitmap(rows, columns, bitmap));
      numberOfTestCases -= 1;
    }
    return result; 
  } catch (err) {
    console.error(`Parsing error: ${err.message}`);
  }
}

function generateOutput(bitmaps) {
  bitmaps.forEach(bitmap => console.log(bitmap.map(row => row.join(' ')).join('\n'), '\n'));
}

readStdin()
  .then(parseInput)
  .then(bitmaps => bitmaps.map(bitmap => bitmap.calculateDistanceForAllPoints()))
  .then(generateOutput)
