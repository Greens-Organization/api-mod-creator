import { describe, it, expect, vi, beforeEach } from "vitest";
import { Response } from "express";
import { signUp } from "../../src/controllers/AuthController";
import User from "../../src/database/models/user";

describe("User Model", () => {
  it("should create a new user", async () => {
    const user = new User({
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      level: "user",
      password: "password123",
    });

    expect(user.email).toBe("john@example.com");
  });
});

vi.mock("bcrypt", () => ({ compare: vi.fn() }));
vi.mock("../../src/models/user", () => ({ findOne: vi.fn() }));
vi.mock("../../src/helpers/token/tokenHandler", () => ({
  generateToken: vi.fn(),
}));

describe("AuthController", () => {
  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    vi.restoreAllMocks();
  });

  it("should sign up a new user successfully", async () => {
    // Mock do método save de User
    const mockUser = {
      save: vi.fn().mockResolvedValue({
        toObject: () => ({
          id: "1",
          name: "Test User",
          email: "test@example.com",
          phone: "1234567890",
          level: "user",
          password: "hashedpassword",
        }),
      }),
    };

    // Substitui a implementação original do método save por um mock
    vi.spyOn(User.prototype, "save").mockImplementationOnce(() =>
      mockUser.save(),
    );

    const req = {
      body: {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        level: "user",
        password: "password123",
      },
    };

    // Criar uma imitação do objeto de resposta do Express
    const res = {
      status: vi.fn(() => res),
      json: vi.fn(),
    } as unknown as Response;

    await signUp(req as any, res as any);

    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User signed up successfully",
        user: expect.objectContaining({
          name: "Test User",
          email: "test@example.com",
        }),
      }),
    );
  });

  it("should return 400 if some required field is missing", async () => {
    const req = {
      body: {
        email: "test@example.com",
        phone: "1234567890",
        level: "user",
        password: "password123",
      },
    } as any;

    const res = {
      status: vi.fn(() => res),
      json: vi.fn(),
    } as unknown as Response;

    await signUp(req, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Some field is missing" });
  });

  it("should return 500 if there is an error saving the user", async () => {
    const mockSave = vi.fn().mockRejectedValue(new Error("Error saving user"));
    vi.spyOn(User.prototype, "save").mockImplementationOnce(mockSave);

    const req = {
      body: {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        level: "user",
        password: "password123",
      },
    } as any;

    const res = {
      status: vi.fn(() => res),
      json: vi.fn(),
    } as unknown as Response;

    await signUp(req, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error saving user" });
  });
});
