import { describe, it, expect } from "vitest";
import {
  generateIdenticon,
  generateInitials,
  generateInitialsSvg,
} from "../src/identicon";

describe("identicon.ts", () => {
  describe("generateIdenticon", () => {
    it("should generate SVG string", () => {
      const svg = generateIdenticon("test-seed");
      expect(svg).toContain("<svg");
      expect(svg).toContain("</svg>");
      expect(svg).toContain("xmlns=");
    });

    it("should include background rectangle", () => {
      const svg = generateIdenticon("test-seed");
      expect(svg).toContain("<rect");
      expect(svg).toContain("fill=");
    });

    it("should use specified size", () => {
      const svg = generateIdenticon("test-seed", 256);
      expect(svg).toContain('width="256"');
      expect(svg).toContain('height="256"');
    });

    it("should be deterministic", () => {
      const seed = "deterministic-seed";
      const svg1 = generateIdenticon(seed);
      const svg2 = generateIdenticon(seed);
      expect(svg1).toBe(svg2);
    });
  });

  describe("generateInitials", () => {
    it("should extract initials from name", () => {
      expect(generateInitials("John Doe")).toBe("JD");
      expect(generateInitials("Alice")).toBe("A");
    });

    it("should handle multiple words", () => {
      expect(generateInitials("John Q Public")).toBe("JP");
    });

    it("should uppercase initials", () => {
      expect(generateInitials("alice bob")).toBe("AB");
    });

    it("should respect maxLetters parameter", () => {
      expect(generateInitials("John Doe Smith", 3)).toBe("JDS");
    });
  });

  describe("generateInitialsSvg", () => {
    it("should generate SVG with initials", () => {
      const svg = generateInitialsSvg("JD", "#3498db");
      expect(svg).toContain("<svg");
      expect(svg).toContain("JD");
      expect(svg).toContain("#3498db");
    });

    it("should use specified size", () => {
      const svg = generateInitialsSvg("AB", "#e74c3c", 200);
      expect(svg).toContain('width="200"');
    });
  });
});
