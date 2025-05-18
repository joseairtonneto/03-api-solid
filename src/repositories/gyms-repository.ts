import { Prisma, Gym } from '@prisma/client'

export interface findManyNearbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  findManyNearby(params: findManyNearbyParams): Promise<Gym[]>
  searchMany(query: string, page: number): Promise<Gym[]>
  findById(data: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
