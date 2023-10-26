import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

interface FetchUserCheckInsHistoryServiceRequest {
  userId: string;
  page: number;
}

type FetchUserCheckInsHistoryServiceResponse = {
  checkIns: CheckIn[];
};

export class FetchUserCheckInsHistoryService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryServiceRequest): Promise<FetchUserCheckInsHistoryServiceResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    );

    return { checkIns };
  }
}
