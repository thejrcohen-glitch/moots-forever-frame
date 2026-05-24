import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./db", () => ({
  getDb: vi.fn(),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./_core/email", () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
  newsletterWelcomeEmail: vi.fn().mockReturnValue("<html></html>"),
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
};

describe("newsletterRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(mockDb);
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.where.mockReturnThis();
    mockDb.limit.mockResolvedValue([]);
    mockDb.insert.mockReturnThis();
    mockDb.values.mockResolvedValue(undefined);
    mockDb.update.mockReturnThis();
    mockDb.set.mockReturnThis();
  });

  it("throws when db is unavailable", async () => {
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const { newsletterRouter } = await import("./newsletterRouter");
    const caller = newsletterRouter.createCaller({} as any);
    await expect(caller.subscribe({ email: "rider@example.com" })).rejects.toThrow();
  });

  it("inserts new subscriber and returns success", async () => {
    mockDb.limit.mockResolvedValue([]);
    const { newsletterRouter } = await import("./newsletterRouter");
    const caller = newsletterRouter.createCaller({} as any);
    const result = await caller.subscribe({
      email: "Rider@Example.com",
      territory: "TX",
      source: "home-footer",
    });
    expect(result.success).toBe(true);
    expect(result.alreadySubscribed).toBe(false);
    expect(result.resubscribed).toBe(false);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalledWith(
      expect.objectContaining({ email: "rider@example.com" })
    );
  });

  it("treats already-active subscriber as a no-op success", async () => {
    mockDb.limit.mockResolvedValue([{ id: 1, unsubscribedAt: null }]);
    const { newsletterRouter } = await import("./newsletterRouter");
    const caller = newsletterRouter.createCaller({} as any);
    const result = await caller.subscribe({ email: "dup@example.com" });
    expect(result.alreadySubscribed).toBe(true);
    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  it("re-subscribes previously unsubscribed email", async () => {
    mockDb.limit.mockResolvedValue([{ id: 9, unsubscribedAt: new Date() }]);
    const { newsletterRouter } = await import("./newsletterRouter");
    const caller = newsletterRouter.createCaller({} as any);
    const result = await caller.subscribe({ email: "back@example.com" });
    expect(result.resubscribed).toBe(true);
    expect(mockDb.update).toHaveBeenCalled();
  });

  it("unsubscribe marks the row", async () => {
    const { newsletterRouter } = await import("./newsletterRouter");
    const caller = newsletterRouter.createCaller({} as any);
    const result = await caller.unsubscribe({ email: "bye@example.com" });
    expect(result.success).toBe(true);
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalledWith(
      expect.objectContaining({ unsubscribedAt: expect.any(Date) })
    );
  });
});
