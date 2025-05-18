import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CheckInUseCase } from './check-in'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Example gym',
      description: 'Gym example to test the use case',
      phone: '4002-8922',
      latitude: -9.6099249,
      longitude: -35.7181854,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -9.6099249,
      userLongitude: -35.7181854,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2025, 4, 16, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -9.6099249,
      userLongitude: -35.7181854,
    })

    vi.setSystemTime(new Date(2025, 4, 17, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -9.6099249,
      userLongitude: -35.7181854,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 4, 16, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -9.6099249,
      userLongitude: -35.7181854,
    })

    await expect(() => {
      return sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -9.6099249,
        userLongitude: -35.7181854,
      })
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should not be able to check in at distant gyms', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      title: 'Example far gym',
      description: 'Far gym example to test the use case',
      phone: '4002-8922',
      latitude: -9.5117093,
      longitude: -35.7933878,
    })

    await expect(() => {
      return sut.execute({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: -9.6099249,
        userLongitude: -35.7181854,
      })
    }).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
