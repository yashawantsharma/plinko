const { sha256 } = require("../utils/hash");

const ROWS = 12;
const MULTIPLIERS = [10, 5, 3, 2, 1.5, 1.2, 1, 1.2, 1.5, 2, 3, 5, 10];

const bitFromHex = (hex, index) => {
  const nibble = parseInt(hex[index % hex.length], 16);
  return (nibble >> (index % 4)) & 1;
};

const generateRound = (combinedSeed, dropColumn = 6) => {
  const safeDropColumn = Math.max(0, Math.min(ROWS, Number(dropColumn) || 0));
  const seedStream = sha256(`${combinedSeed}:plinko:${safeDropColumn}`);
  let position = safeDropColumn;
  const path = [];

  for (let row = 0; row < ROWS; row += 1) {
    const direction = bitFromHex(seedStream, row) === 1 ? "R" : "L";
    position += direction === "R" ? 1 : -1;
    position = Math.max(0, Math.min(ROWS, position));
    path.push({
      row,
      direction,
      column: position,
    });
  }

  return {
    rows: ROWS,
    binIndex: position,
    pegMapHash: sha256(`rows:${ROWS}:bins:${MULTIPLIERS.join(",")}`),
    path,
  };
};

module.exports = {
  ROWS,
  MULTIPLIERS,
  generateRound,
};
