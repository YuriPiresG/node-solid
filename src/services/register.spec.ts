import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";
import { compare } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";
import { RegisterService } from "./register.service";

let usersRepository: InMemoryUsersRepository;
let registerService: RegisterService;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    registerService = new RegisterService(usersRepository);
  });
  it("should register", async () => {
    const { user } = await registerService.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await registerService.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "johndoe@example.com";

    await registerService.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    await expect(
      registerService.execute({
        name: "John Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
