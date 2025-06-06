import { Prisma, CheckIn } from '@prisma/client'

export interface CheckInsRepository {
  save(data: CheckIn): Promise<CheckIn>
  findById(id: string): Promise<CheckIn | null>
  countByUserId(userId: string): Promise<number>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}
