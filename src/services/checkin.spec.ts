import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { CheckInService } from "./checkin.service";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository copy";
import { Decimal } from "@prisma/client/runtime/library";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe("Check-in Use Case",  () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();

    await gymsRepository.create({
      id: "gym-01",
      description: "Academia 1",
      latitude: new Decimal(-22.5772356),
      longitude: new Decimal(-47.4196327),
      phone: "123456789",
      title: "Academia 1",
    });

    sut = new CheckInService(checkInsRepository, gymsRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -22.5772356,
      userLongitude: -47.4196327,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice a day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -22.5772356,
      userLongitude: -47.4196327,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -22.5772356,
        userLongitude: -47.4196327,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -22.5772356,
      userLongitude: -47.4196327,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -22.5772356,
      userLongitude: -47.4196327,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    await gymsRepository.items.push({
      id: "gym-02",
      description: "Academia 2",
      latitude: new Decimal(-22.5366522),
      longitude: new Decimal(-47.3721254),
      phone: "987654321",
      title: "Academia 2",
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -22.5772356,
        userLongitude: -47.4196327,
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
