import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { SearchGymsService } from "./search-gyms.service";
import { Decimal } from "@prisma/client/runtime/library";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsService;

describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsService(gymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      id: "gym-01",
      description: "Academia 01",
      latitude: new Decimal(-22.5772356),
      longitude: new Decimal(-47.4196327),
      phone: "123456789",
      title: "Academia 01",
    });

    await gymsRepository.create({
      id: "gym-01",
      description: "Academia 02",
      latitude: new Decimal(-22.5772356),
      longitude: new Decimal(-47.4196327),
      phone: "123456789",
      title: "Academia 02",
    });

    const { gyms } = await sut.execute({
      query: "Academia 01",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Academia 01" })]);
  });

  it("should be able to fetch paginated gym search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        id: "gym-01",
        description: `Gym ${i}`,
        latitude: new Decimal(-22.5772356),
        longitude: new Decimal(-47.4196327),
        phone: "123456789",
        title: `Gym ${i}`,
      });
    }

    const { gyms } = await sut.execute({
      query: "Gym",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Gym 21" }),
      expect.objectContaining({ title: "Gym 22" }),
    ]);
  });
});
