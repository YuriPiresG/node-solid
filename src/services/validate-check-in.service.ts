import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";
import dayjs from "dayjs";
import { ExpiredValidationError } from "./errors/expired-validation-error";
import { ResourceNotFound } from "./errors/resource-not-found-error";

interface ValidateCheckInServiceRequest {
  checkInId: string;
}

type ValidateCheckInServiceResponse = {
  checkIn: CheckIn;
};

export class ValidateCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) throw new ResourceNotFound();

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minute"
    );

    if (distanceInMinutesFromCheckInCreation > 20)
      throw new ExpiredValidationError();

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
