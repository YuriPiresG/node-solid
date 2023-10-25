import { GymsRepository } from "@/repositories/gyms-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";
import { Gym, User } from "@prisma/client";
import { hash } from "bcryptjs";

interface CreateGymServiceRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymServiceResponse {
  gym: Gym;
}

export class CreateGymService {
  constructor(private gymRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymServiceRequest): Promise<CreateGymServiceResponse> {
    const gym = await this.gymRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return {
      gym,
    };
  }
}
