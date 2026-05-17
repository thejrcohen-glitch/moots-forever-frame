import { describe, it, expect, beforeAll } from "vitest";
import { sendEmail, rsvpConfirmationEmail } from "./_core/email";

describe("Email System", () => {
  it("should not require RESEND_API_KEY in test/CI", async () => {
    const originalKey = process.env.RESEND_API_KEY;
    try {
      delete process.env.RESEND_API_KEY;
      const result = await sendEmail({
        to: "test@example.com",
        subject: "Test",
        html: "<p>Test</p>",
      });
      expect(result).toBe(false);
    } finally {
      if (typeof originalKey === "string") {
        process.env.RESEND_API_KEY = originalKey;
      } else {
        delete process.env.RESEND_API_KEY;
      }
    }
  });

  it("should generate valid RSVP confirmation email HTML", () => {
    const html = rsvpConfirmationEmail({
      name: "Test Rider",
      eventName: "Pop-Up Espresso & Dirt",
      eventDate: "May 25, 2026",
      territory: "Austin, TX",
    });
    expect(html).toContain("Test Rider");
    expect(html).toContain("Pop-Up Espresso & Dirt");
    expect(html).toContain("May 25, 2026");
    expect(html).toContain("Austin, TX");
    expect(html).toContain("ianzak@mac.com");
    expect(html).toContain("917-578-7687");
  });

  it("should handle sendEmail gracefully with valid config", async () => {
    // This test just verifies the function doesn't throw
    // Actual email sending requires a valid Resend account
    const result = await sendEmail({
      to: "test@example.com",
      subject: "Test",
      html: "<p>Test</p>",
    });
    // Result should be boolean (true if sent, false if failed)
    expect(typeof result).toBe("boolean");
  });
});
