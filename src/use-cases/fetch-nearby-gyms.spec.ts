import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near gym',
      description: null,
      phone: null,
      latitude: -9.610058,
      longitude: -35.718316,
    })

    await gymsRepository.create({
      title: 'Far gym',
      description: null,
      phone: null,
      latitude: -9.402584,
      longitude: -35.593589,
    })

    const { gyms } = await sut.execute({
      userLatitude: -9.610058,
      userLongitude: -35.718316,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near gym' })])
  })
})
