import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCreditionalsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface AuthenticateServiceRequest {
  email: string;
  password: string;
}

type AuthenticateServiceResponse = {
  user: User;
};

export class AuthenticateService {
  constructor(private usersRepsitory: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.usersRepsitory.findByEmail(email);

    if (!user) {
      throw new InvalidCreditionalsError();
    }

    const doesPasswordMatch = await compare(password, user.password_hash);

    if (!doesPasswordMatch) {
      throw new InvalidCreditionalsError();
    }
    return {
      user,
    };
  }
}
