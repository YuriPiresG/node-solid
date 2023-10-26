import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserMetricsService } from "./get-user-metrics.service";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsService;

describe("Get user metrics service", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();

    sut = new GetUserMetricsService(checkInsRepository);
  });

  it("should be able to get check-ins count from metrics", async () => {
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

    const { checkInsCount } = await sut.execute({
      userId: "user-id",
    });

    expect(checkInsCount).toBe(2);
  });
});
