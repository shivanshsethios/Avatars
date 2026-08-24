import { colorFromHash, seedFromHash } from "./hash";

interface IconCell {
  row: number;
  col: number;
  active: boolean;
}

/**
 * Build a symmetric grid of cells from hash
 * Creates a deterministic pattern for visual identicons
 */
function buildSymmetricGrid(hash: string): IconCell[] {
  const cells: IconCell[] = [];
  const size = 5;
  const seed = seedFromHash(hash);

  // Create pattern with 5x5 grid, mirrored horizontally
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < Math.ceil(size / 2); col++) {
      const index = row * Math.ceil(size / 2) + col;
      const bitSet = (seed >> index) & 1;
      const active = bitSet === 1;

      cells.push({ row, col, active });

      // Mirror horizontally (skip center column for odd sizes)
      if (col !== Math.floor(size / 2)) {
        cells.push({ row, col: size - 1 - col, active });
      }
    }
  }

  return cells;
}

/**
 * Render SVG identicon from hash and options
 */
export function generateIdenticon(
  seed: string,
  size: number = 128
): string {
  const hash = seed;
  const background = colorFromHash(hash.slice(0, 6));
  const foreground = colorFromHash(hash.slice(6, 12));
  const cells = buildSymmetricGrid(hash);

  const cellSize = size / 5;
  let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">\n`;
  svg += `  <rect width="${size}" height="${size}" fill="${background}"/>\n`;

  // Render active cells
  for (const cell of cells) {
    if (cell.active) {
      const x = cell.col * cellSize;
      const y = cell.row * cellSize;
      svg += `  <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${foreground}"/>\n`;
    }
  }

  svg += `</svg>`;
  return svg;
}

/**
 * Generate initials from a name string
 */
export function generateInitials(
  name: string,
  maxLetters: number = 2
): string {
  return name
    .split(/\s+/)
    .slice(0, maxLetters)
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, maxLetters);
}

/**
 * Render SVG with initials
 */
export function generateInitialsSvg(
  initials: string,
  background: string,
  size: number = 128
): string {
  const fontSize = size / 2.5;
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="${background}"/>
    <text x="50%" y="50%" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">
      ${initials}
    </text>
  </svg>`;
}
