import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearByGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearByGymsUseCase

describe('Fetch NearBy Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearByGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Example near gym',
      description: 'Gym example to test the use case',
      phone: '4002-8922',
      latitude: -9.6099249,
      longitude: -35.7181854,
    })

    await gymsRepository.create({
      title: 'Not showing far gym',
      description: 'Gym example to test the use case',
      phone: '4002-8922',
      latitude: -9.5117093,
      longitude: -35.7933878,
    })

    const { gyms } = await sut.execute({
      userLatitude: -9.6099249,
      userLongitude: -35.7181854,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Example near gym' })])
  })
})
