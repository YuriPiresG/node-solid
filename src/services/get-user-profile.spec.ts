import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserProfileService } from "./get-user-profile.service";
import { ResourceNotFound } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe("GetUserProfile Service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileService(usersRepository);
  });
  it("should be able to find the user", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.name).toBe(createdUser.name);
  });

  it("should not be able to find the user with wrong id", async () => {
    await expect(() =>
      sut.execute({
        userId: "wrong id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFound);
  });
});
