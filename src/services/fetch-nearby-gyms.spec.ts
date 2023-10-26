import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { SearchGymsService } from "./search-gyms.service";
import { Decimal } from "@prisma/client/runtime/library";
import { FetchNearbyGymsService } from "./fetch-nearby-gyms.service";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsService;

describe("Fetch nearby gyms service", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsService(gymsRepository);
  });

  it("should be able to search for nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: "Near Gym",
      latitude: new Decimal(-22.5772356),
      longitude: new Decimal(-47.4196327),
      phone: "123456789",
    });

    await gymsRepository.create({
      description: "Far Gym",
      latitude: new Decimal(-23.5772356),
      longitude: new Decimal(-44.4196327),
      phone: "123456789",
      title: "Far Gym",
    });

    const { gyms } = await sut.execute({
      userLatitude: -22.5772336,
      userLongitude: -47.4196317,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
