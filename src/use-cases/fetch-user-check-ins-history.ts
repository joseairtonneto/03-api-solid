import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface FetchCheckInsHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchCheckInsHistoryUseCaseRequest): Promise<FetchCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return { checkIns }
  }
}
