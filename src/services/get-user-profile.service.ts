import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCreditionalsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";
import { ResourceNotFound } from "./errors/resource-not-found-error";

interface GetUserProfileServiceRequest {
  userId: string;
}

type GetUserProfileServiceResponse = {
  user: User;
};

export class GetUserProfileService {
  constructor(private usersRepsitory: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
    const user = await this.usersRepsitory.findById(userId);

    if (!user) {
      throw new ResourceNotFound();
    }

    return { user };
  }
}
