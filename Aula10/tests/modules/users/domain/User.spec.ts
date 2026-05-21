import { describe, expect, it } from "vitest";

import { User } from "../../../../src/modules/users/domain/entities/User.js";

describe("User", () => {
  it("creates a user with normalized name and email", () => {
    const user = User.create({
      name: "  Ada Lovelace  ",
      email: "  ADA@EXAMPLE.COM  "
    });

    expect(user.id).toBeDefined();
    expect(user.name).toBe("Ada Lovelace");
    expect(user.email).toBe("ada@example.com");
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it("uses the provided id and creation date", () => {
    const createdAt = new Date("2026-05-20T10:00:00.000Z");

    const user = User.create({
      id: "user-123",
      name: "Grace Hopper",
      email: "grace@example.com",
      createdAt
    });

    expect(user.id).toBe("user-123");
    expect(user.createdAt).toBe(createdAt);
  });

  it("throws when the name is empty after trimming", () => {
    expect(() =>
      User.create({
        name: "   ",
        email: "ada@example.com"
      })
    ).toThrowError("User name is required.");
  });

  it("throws when the email is empty after trimming", () => {
    expect(() =>
      User.create({
        name: "Ada Lovelace",
        email: "   "
      })
    ).toThrowError("A valid user email is required.");
  });

  it("throws when the email format is invalid", () => {
    expect(() =>
      User.create({
        name: "Ada Lovelace",
        email: "invalid-email"
      })
    ).toThrowError("A valid user email is required.");
  });
});
