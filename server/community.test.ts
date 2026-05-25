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

  it("accepts a models filter alongside territory and tags", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.community.list({
      territory: "TX",
      tags: ["gravel"],
      models: ["Routt RSL", "Vamoots RSL"],
    });
    expect(Array.isArray(result)).toBe(true);
  });

  it("rejects empty model strings", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.community.list({ territory: "ALL", models: [""] })
    ).rejects.toThrow();
  });

  it("rejects model strings longer than 128 chars", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.community.list({ territory: "ALL", models: ["x".repeat(129)] })
    ).rejects.toThrow();
  });

  it("rejects more than MAX_COMMUNITY_PHOTO_MODEL_FILTERS models", async () => {
    const { COMMUNITY_PHOTO_MODELS, MAX_COMMUNITY_PHOTO_MODEL_FILTERS } = await import("../shared/const");
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const tooMany = Array.from(
      { length: MAX_COMMUNITY_PHOTO_MODEL_FILTERS + 1 },
      (_, i) => COMMUNITY_PHOTO_MODELS[i % COMMUNITY_PHOTO_MODELS.length] + `_${i}`
    );
    await expect(
      caller.community.list({ territory: "ALL", models: tooMany })
    ).rejects.toThrow();
  });
});

describe("community models vocabulary", () => {
  it("exports the canonical Moots model list", async () => {
    const { COMMUNITY_PHOTO_MODELS } = await import("../shared/const");
    expect(COMMUNITY_PHOTO_MODELS).toContain("Routt RSL");
    expect(COMMUNITY_PHOTO_MODELS).toContain("Vamoots RSL");
    expect(COMMUNITY_PHOTO_MODELS.length).toBeGreaterThan(0);
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

  it("rejects unknown tag slugs", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.community.upload({
        riderName: "Test Rider",
        territory: "TX",
        location: "Austin, TX",
        // @ts-expect-error testing invalid tag slug
        tags: ["not-a-real-tag"],
        imageData: "data:image/jpeg;base64,abc",
        imageMimeType: "image/jpeg",
      })
    ).rejects.toThrow();
  });

  it("rejects more than MAX_COMMUNITY_PHOTO_TAGS tags", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.community.upload({
        riderName: "Test Rider",
        territory: "TX",
        location: "Austin, TX",
        tags: ["gravel", "road", "mountain", "coffee", "sunrise", "sunset"],
        imageData: "data:image/jpeg;base64,abc",
        imageMimeType: "image/jpeg",
      })
    ).rejects.toThrow();
  });

  it("accepts a valid tag list (still fails on missing DB, proving schema passed)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.community.upload({
        riderName: "Test Rider",
        territory: "TX",
        location: "Austin, TX",
        tags: ["gravel", "coffee"],
        imageData: "data:image/jpeg;base64,abc",
        imageMimeType: "image/jpeg",
      })
    ).rejects.toThrow("Database not available");
  });
});

describe("parseCommunityPhotoTags", () => {
  it("returns [] for null/empty/undefined", async () => {
    const { parseCommunityPhotoTags } = await import("../shared/const");
    expect(parseCommunityPhotoTags(null)).toEqual([]);
    expect(parseCommunityPhotoTags(undefined)).toEqual([]);
    expect(parseCommunityPhotoTags("")).toEqual([]);
  });

  it("decodes valid tag JSON arrays", async () => {
    const { parseCommunityPhotoTags } = await import("../shared/const");
    expect(parseCommunityPhotoTags('["gravel","coffee"]')).toEqual(["gravel", "coffee"]);
  });

  it("drops unknown slugs and dedupes", async () => {
    const { parseCommunityPhotoTags } = await import("../shared/const");
    expect(parseCommunityPhotoTags('["gravel","not-real","gravel","coffee"]')).toEqual(["gravel", "coffee"]);
  });

  it("returns [] for malformed JSON or non-arrays", async () => {
    const { parseCommunityPhotoTags } = await import("../shared/const");
    expect(parseCommunityPhotoTags("not-json")).toEqual([]);
    expect(parseCommunityPhotoTags('{"foo":1}')).toEqual([]);
  });
});
