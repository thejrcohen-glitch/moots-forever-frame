import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./db", () => ({
  getDb: vi.fn(),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./_core/email", () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
  bookingConfirmationEmail: vi.fn().mockReturnValue("<html />"),
}));

import { getDb } from "./db";
import { notifyOwner } from "./_core/notification";
import { sendEmail, bookingConfirmationEmail } from "./_core/email";

const mockDb = {
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockResolvedValue(undefined),
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockResolvedValue([{ count: 0 }]),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockResolvedValue([]),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
};

describe("bookingRouter.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(mockDb);
    mockDb.insert.mockReturnThis();
    mockDb.values.mockResolvedValue(undefined);
  });

  it("persists with popUpCity and popUpVenue and triggers notification + email", async () => {
    const { bookingRouter } = await import("./bookingRouter");
    const caller = bookingRouter.createCaller({} as any);
    const result = await caller.submit({
      name: "Jane Rider",
      email: "jane@example.com",
      territory: "AR",
      city: "Bentonville, AR",
      venue: "Airship Coffee",
      preferredDate: "2026-04-25",
      message: "Excited!",
      eventType: "pop-up-espresso",
    });
    expect(result.success).toBe(true);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalledWith(
      expect.objectContaining({
        popUpCity: "Bentonville, AR",
        popUpVenue: "Airship Coffee",
        territory: "AR",
      })
    );
    expect(notifyOwner).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalled();
    expect(bookingConfirmationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ city: "Bentonville, AR" })
    );
  });

  it("works when database is unavailable", async () => {
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const { bookingRouter } = await import("./bookingRouter");
    const caller = bookingRouter.createCaller({} as any);
    const result = await caller.submit({
      name: "Bob",
      email: "bob@example.com",
      territory: "TX",
      city: "Austin, TX",
    });
    expect(result.success).toBe(true);
    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});

describe("bookingRouter.capacityHint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(mockDb);
  });

  it("returns nulls gracefully when db is unavailable", async () => {
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const { bookingRouter } = await import("./bookingRouter");
    const caller = bookingRouter.createCaller({} as any);
    const result = await caller.capacityHint({ territory: "AR", date: "2026-04-25" });
    expect(result.available).toBeNull();
    expect(result.cap).toBeNull();
    expect(result.taken).toBe(0);
  });

  it("returns available=true with low demand", async () => {
    mockDb.where.mockResolvedValueOnce([{ count: 3 }]);
    const { bookingRouter } = await import("./bookingRouter");
    const caller = bookingRouter.createCaller({} as any);
    const result = await caller.capacityHint({ territory: "AR", date: "2026-04-25" });
    expect(result.taken).toBe(3);
    expect(result.cap).toBeGreaterThan(0);
    expect(result.available).toBe(true);
  });
});

describe("bookingRouter.setStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(mockDb);
  });

  it("rejects non-admins", async () => {
    const { bookingRouter } = await import("./bookingRouter");
    const caller = bookingRouter.createCaller({ user: { role: "user" } } as any);
    await expect(
      caller.setStatus({ id: 1, status: "confirmed" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("admin can update status to confirmed", async () => {
    const { bookingRouter } = await import("./bookingRouter");
    const caller = bookingRouter.createCaller({ user: { role: "admin" } } as any);
    const result = await caller.setStatus({ id: 7, status: "confirmed" });
    expect(result.success).toBe(true);
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalledWith({ status: "confirmed" });
  });
});

describe("bookingRouter.listAll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(mockDb);
  });

  it("rejects non-admins", async () => {
    const { bookingRouter } = await import("./bookingRouter");
    const caller = bookingRouter.createCaller({ user: { role: "user" } } as any);
    await expect(caller.listAll()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("returns empty array when db unavailable", async () => {
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const { bookingRouter } = await import("./bookingRouter");
    const caller = bookingRouter.createCaller({ user: { role: "admin" } } as any);
    const result = await caller.listAll();
    expect(result).toEqual([]);
  });
});
