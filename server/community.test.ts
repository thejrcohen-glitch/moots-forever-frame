import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the DB and storage modules so tests run without a real database
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "community/tx/test.jpg", url: "https://cdn.example.com/test.jpg" }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("community.list", () => {
  it("returns an empty array when DB is unavailable", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.community.list({ territory: "ALL" });
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  it("accepts TX territory filter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.community.list({ territory: "TX" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("accepts OK territory filter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.community.list({ territory: "OK" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("accepts AR territory filter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.community.list({ territory: "AR" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("defaults to ALL when territory is not provided", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    // @ts-expect-error testing default behavior
    const result = await caller.community.list({});
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("community.upload", () => {
  it("throws when DB is unavailable", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.community.upload({
        riderName: "Test Rider",
        territory: "TX",
        location: "Austin, TX",
        venue: "Flat Track Coffee",
        mootsModel: "Vamoots RSL",
        caption: "Test caption",
        imageData: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoH",
        imageMimeType: "image/jpeg",
      })
    ).rejects.toThrow("Database not available");
  });

  it("validates territory enum — rejects invalid value", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.community.upload({
        riderName: "Test Rider",
        // @ts-expect-error testing invalid territory
        territory: "CA",
        location: "Los Angeles, CA",
        imageData: "data:image/jpeg;base64,abc",
        imageMimeType: "image/jpeg",
      })
    ).rejects.toThrow();
  });

  it("validates riderName is required", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.community.upload({
        riderName: "",
        territory: "TX",
        location: "Austin, TX",
        imageData: "data:image/jpeg;base64,abc",
        imageMimeType: "image/jpeg",
      })
    ).rejects.toThrow();
  });
});
