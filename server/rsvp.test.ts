import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the DB module
vi.mock("./db", () => ({
  getDb: vi.fn(),
}));

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import { getDb } from "./db";

const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  limit: vi.fn().mockResolvedValue([]),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockResolvedValue(undefined),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  groupBy: vi.fn().mockResolvedValue([]),
};

describe("rsvpRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(mockDb);
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.where.mockReturnThis();
    mockDb.limit.mockResolvedValue([]);
    mockDb.insert.mockReturnThis();
    mockDb.values.mockResolvedValue(undefined);
  });

  it("should return count 0 when db is unavailable", async () => {
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const { rsvpRouter } = await import("./rsvpRouter");
    const caller = rsvpRouter.createCaller({} as any);
    const result = await caller.count({ eventId: 1 });
    expect(result.count).toBe(0);
  });

  it("should return empty counts map when db is unavailable", async () => {
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const { rsvpRouter } = await import("./rsvpRouter");
    const caller = rsvpRouter.createCaller({} as any);
    const result = await caller.counts({ eventIds: [1, 2, 3] });
    expect(result).toEqual({});
  });

  it("should return empty counts map for empty eventIds", async () => {
    const { rsvpRouter } = await import("./rsvpRouter");
    const caller = rsvpRouter.createCaller({} as any);
    const result = await caller.counts({ eventIds: [] });
    expect(result).toEqual({});
  });

  it("should detect duplicate RSVP and return alreadyRegistered: true", async () => {
    mockDb.limit.mockResolvedValue([{ id: 42 }]);
    const { rsvpRouter } = await import("./rsvpRouter");
    const caller = rsvpRouter.createCaller({} as any);
    const result = await caller.submit({
      eventId: 1,
      eventTitle: "Test Event",
      eventDate: "2026-05-01",
      territory: "TX",
      riderName: "Jane Doe",
      email: "jane@example.com",
    });
    expect(result.alreadyRegistered).toBe(true);
    expect(result.success).toBe(true);
  });

  it("should insert new RSVP and return success", async () => {
    mockDb.limit.mockResolvedValue([]);
    const { rsvpRouter } = await import("./rsvpRouter");
    const caller = rsvpRouter.createCaller({} as any);
    const result = await caller.submit({
      eventId: 2,
      eventTitle: "Gravel Locos",
      eventDate: "2026-05-09",
      territory: "TX",
      riderName: "John Rider",
      email: "john@example.com",
      notes: "Can't wait!",
    });
    expect(result.success).toBe(true);
    expect(result.alreadyRegistered).toBe(false);
    expect(mockDb.insert).toHaveBeenCalled();
  });
});

describe("configuratorRouter", () => {
  it("should call notifyOwner and return success", async () => {
    const { notifyOwner } = await import("./_core/notification");
    const { configuratorRouter } = await import("./configuratorRouter");
    const caller = configuratorRouter.createCaller({} as any);
    const result = await caller.submitLead({
      name: "Test Rider",
      email: "test@example.com",
      territory: "TX",
      useCase: "gravel",
      terrain: "mixed",
      budget: "5k-8k",
      recommendedModel: "Routt 45",
      notes: "Looking for a forever bike",
    });
    expect(result.success).toBe(true);
    expect(notifyOwner).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.stringContaining("Routt 45") })
    );
  });
});
