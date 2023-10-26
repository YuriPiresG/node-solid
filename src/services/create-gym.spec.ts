import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";
import { compare } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";
import { RegisterService } from "./register.service";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymService } from "./create-gym.service";

let gymRepository: InMemoryGymsRepository;
let sut: CreateGymService;

describe("Create Gym Service", () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    sut = new CreateGymService(gymRepository);
  });
  it("should be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "Academia",
      description: null,
      latitude: -22.5772356,
      longitude: -47.4196327,
      phone: null,
    });
  });
});
