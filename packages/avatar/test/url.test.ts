import { describe, it, expect } from "vitest";
import {
  avatarUrlFromUserId,
  avatarUrlFromEmail,
  avatarUrl,
} from "../src/url";

describe("url.ts", () => {
  describe("avatarUrlFromUserId", () => {
    it("should generate URL from user ID", () => {
      const url = avatarUrlFromUserId("usr_123");
      expect(url).toBe("https://avatar.shivanshsethi.in/u/usr_123?s=128");
    });

    it("should include custom size", () => {
      const url = avatarUrlFromUserId("usr_123", { size: 256 });
      expect(url).toContain("s=256");
    });

    it("should include style parameter", () => {
      const url = avatarUrlFromUserId("usr_123", { style: "pixel" });
      expect(url).toContain("style=pixel");
    });

    it("should limit size to 1024", () => {
      const url = avatarUrlFromUserId("usr_123", { size: 9999 });
      expect(url).toContain("s=1024");
    });
  });

  describe("avatarUrlFromEmail", () => {
    it("should hash email in URL", () => {
      const url = avatarUrlFromEmail("me@shivanshsethi.in");
      expect(url).toContain("/email/");
      expect(url).not.toContain("@");
      expect(url).not.toContain("me@");
    });

    it("should include options in URL", () => {
      const url = avatarUrlFromEmail("test@example.com", {
        size: 96,
        style: "identicon",
      });
      expect(url).toContain("s=96");
      expect(url).toContain("style=identicon");
    });
  });

  describe("avatarUrl", () => {
    it("should detect email and use email endpoint", () => {
      const url = avatarUrl("test@example.com");
      expect(url).toContain("/email/");
    });

    it("should detect user ID and use user endpoint", () => {
      const url = avatarUrl("usr_123");
      expect(url).toContain("/u/usr_123");
    });

    it("should pass through options", () => {
      const url = avatarUrl("usr_123", { size: 64, style: "gradient" });
      expect(url).toContain("s=64");
      expect(url).toContain("style=gradient");
    });
  });
});
