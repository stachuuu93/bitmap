class Bitmap {
  constructor(rows, columns, data) {
    Bitmap.checkBitmap(rows, columns, data);
    this.rows = rows;
    this.columns = columns;
    this.data = data;
  }

  static checkBitmap(rows, columns, data) {
    if (rows !== data.length) {
      throw new Error('Incorrect y dimension');
    }
    if (data.some(row => row.length !== columns)) {
      throw new Error('Incorrect x dimension');
    }
    const containsIncorrectValue = data
      .reduce((result, row) => [...result, ...row], [])
      .some(element => ![0, 1].includes(element));
    if (containsIncorrectValue) {
      throw new Error('Bitmap contains incorrect value');
    }
  }

  manhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  findWhitePoints(x, y, radius) {
    const left = x - radius < 0 ? 0 : x - radius;
    const right = x + radius < this.columns ? x + radius : this.columns - 1;
    const top = y - radius < 0 ? 0 : y - radius;
    const bottom = y + radius < this.rows ? y + radius : this.rows - 1;
    
    const result = [];

    for(let i = left; i <= right; i += 1) {
      if (top === y - radius && this.data[top][i] === 1) {
        result.push(this.manhattanDistance(x, y, i, top));
      }
      if (bottom === y + radius && this.data[bottom][i] === 1) {
        result.push(this.manhattanDistance(x, y, i, bottom));
      }
    }
    for (let i = top; i <= bottom; i += 1) {
      if (left === x - radius && this.data[i][left] === 1) {
        result.push(this.manhattanDistance(x, y, left, i));
      }
      if (right === x + radius && this.data[i][right] === 1) {
        result.push(this.manhattanDistance(x, y, right, i));
      }
    }

    return result.sort((a, b) => a - b);
  }

  calculateDistanceForPoint(startX, startY) {
    if (this.data[startY][startX] === 1) {
      return 0;
    }
    let radius = 1;
    while (radius < this.rows || radius < this.columns) {
      const whitePixels = this.findWhitePoints(startX, startY, radius);

      if (whitePixels.length) {
        return whitePixels[0];
      }
      radius += 1;
    }
    throw new Error('Bitmap doesn\'t contain white pixel');
  }

  calculateDistanceForAllPoints() {
    return this.data.map((row, y) => row.map((_, x) => this.calculateDistanceForPoint(x, y)));
  }
}

module.exports = Bitmap;
