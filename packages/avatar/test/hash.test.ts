import { describe, it, expect } from "vitest";
import { hashEmail, avatarHash, colorFromHash, seedFromHash } from "../src/hash";

describe("hash.ts", () => {
  describe("hashEmail", () => {
    it("should hash an email with SHA-256", () => {
      const email = "me@shivanshsethi.in";
      const hash = hashEmail(email);
      expect(hash).toHaveLength(64); // SHA-256 is 64 hex chars
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it("should normalize email before hashing", () => {
      // Spaces and case should not matter
      const hash1 = hashEmail("me@shivanshsethi.in");
      const hash2 = hashEmail(" ME@SHIVANSHSETHI.IN ");
      expect(hash1).toBe(hash2);
    });

    it("should return consistent hash for same email", () => {
      const email = "test@example.com";
      const hash1 = hashEmail(email);
      const hash2 = hashEmail(email);
      expect(hash1).toBe(hash2);
    });
  });

  describe("avatarHash", () => {
    it("should hash any identifier", () => {
      const hash = avatarHash("usr_123");
      expect(hash).toHaveLength(64);
    });
  });

  describe("colorFromHash", () => {
    it("should extract first 6 hex chars as color", () => {
      const hash = "a1b2c3d4e5f6";
      const color = colorFromHash(hash);
      expect(color).toBe("#a1b2c3");
    });

    it("should return valid hex color format", () => {
      const color = colorFromHash("abc123def456");
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
    });
  });

  describe("seedFromHash", () => {
    it("should convert first 8 hex chars to number", () => {
      const hash = "ffffffff00000000";
      const seed = seedFromHash(hash);
      expect(seed).toBe(4294967295);
    });

    it("should be deterministic", () => {
      const hash = "a1b2c3d4e5f6";
      const seed1 = seedFromHash(hash);
      const seed2 = seedFromHash(hash);
      expect(seed1).toBe(seed2);
    });
  });
});
