import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchUserCheckInsHistoryService } from "./fetch-user-check-ins-history.service";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryService;

describe("Fetch user check-in service", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();

    sut = new FetchUserCheckInsHistoryService(checkInsRepository);
  });

  it("should be able to fetch check-in history", async () => {
    await checkInsRepository.create({
      user_id: "user-id",
      gym_id: "gym-01",
      validated_at: new Date(),
    });

    await checkInsRepository.create({
      user_id: "user-id",
      gym_id: "gym-02",
      validated_at: new Date(),
    });

    const { checkIns } = await sut.execute({
      userId: "user-id",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-01" }),
      expect.objectContaining({ gym_id: "gym-02" }),
    ]);
  });
it("should be able to fetch paginated check-in history", async () => {
  for (let i = 1; i <= 22; i++) {
    await checkInsRepository.create({
      gym_id: `gym-${i}`,
      user_id: "user-01",
    });
  }

  const { checkIns } = await sut.execute({
    userId: "user-01",
    page: 2,
  });

  expect(checkIns).toHaveLength(2);
  expect(checkIns).toEqual([
    expect.objectContaining({ gym_id: "gym-21" }),
    expect.objectContaining({ gym_id: "gym-22" }),
  ]);
});
});
