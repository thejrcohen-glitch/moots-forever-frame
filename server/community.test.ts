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

  it("accepts a valid models filter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.community.list({
      territory: "ALL",
      models: ["Routt 45", "Routt RSL"],
    });
    expect(Array.isArray(result)).toBe(true);
  });

  it("rejects unknown moots model names in the filter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      // @ts-expect-error testing invalid model name
      caller.community.list({ territory: "ALL", models: ["Not A Real Bike"] })
    ).rejects.toThrow();
  });

  it("accepts a combined territory + tags + models filter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.community.list({
      territory: "TX",
      tags: ["gravel"],
      models: ["Routt 45"],
    });
    expect(Array.isArray(result)).toBe(true);
  });
});

// The router applies tag and model filtering in JS over the DB rows, so we
// exercise that path directly by stubbing getDb to return a fake select
// chain. This protects the OR-match + moderation-gate semantics without
// needing a real database.
describe("community.list model filter (in-memory)", () => {
  it("filters by model OR-match and combines with tags (AND across filters)", async () => {
    const fakeRows = [
      { id: 1, riderName: "A", territory: "TX", location: "Austin", venue: null, mootsModel: "Routt 45", caption: null, imageUrl: "u1", imageKey: "k1", approved: "approved", tags: '["gravel","coffee"]', createdAt: new Date() },
      { id: 2, riderName: "B", territory: "TX", location: "Austin", venue: null, mootsModel: "Routt RSL", caption: null, imageUrl: "u2", imageKey: "k2", approved: "approved", tags: '["road"]', createdAt: new Date() },
      { id: 3, riderName: "C", territory: "TX", location: "Austin", venue: null, mootsModel: "Vamoots RSL", caption: null, imageUrl: "u3", imageKey: "k3", approved: "approved", tags: '["gravel"]', createdAt: new Date() },
      { id: 4, riderName: "D", territory: "TX", location: "Austin", venue: null, mootsModel: null, caption: null, imageUrl: "u4", imageKey: "k4", approved: "approved", tags: '["gravel"]', createdAt: new Date() },
    ];
    const limit = vi.fn().mockResolvedValue(fakeRows);
    const orderBy = vi.fn(() => ({ limit }));
    const where = vi.fn(() => ({ orderBy }));
    const from = vi.fn(() => ({ where }));
    const select = vi.fn(() => ({ from }));
    const { getDb } = await import("./db");
    (getDb as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ select });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.community.list({
      territory: "TX",
      tags: ["gravel"],
      models: ["Routt 45", "Vamoots RSL"],
    });
    // Row 1 (Routt 45 + gravel) and Row 3 (Vamoots RSL + gravel) match.
    // Row 2 fails tags. Row 4 fails models (null mootsModel).
    expect(result.map(r => r.id).sort()).toEqual([1, 3]);
  });

  it("returns all rows from the DB query when no model filter is provided", async () => {
    const fakeRows = [
      { id: 1, riderName: "A", territory: "TX", location: "Austin", venue: null, mootsModel: "Routt 45", caption: null, imageUrl: "u1", imageKey: "k1", approved: "approved", tags: null, createdAt: new Date() },
      { id: 2, riderName: "B", territory: "TX", location: "Austin", venue: null, mootsModel: null, caption: null, imageUrl: "u2", imageKey: "k2", approved: "approved", tags: null, createdAt: new Date() },
    ];
    const limit = vi.fn().mockResolvedValue(fakeRows);
    const orderBy = vi.fn(() => ({ limit }));
    const where = vi.fn(() => ({ orderBy }));
    const from = vi.fn(() => ({ where }));
    const select = vi.fn(() => ({ from }));
    const { getDb } = await import("./db");
    (getDb as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ select });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.community.list({ territory: "TX" });
    expect(result).toHaveLength(2);
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
