import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    vi.setSystemTime(new Date(2025, 4, 16, 8, 0, 0))

    const createdCheckIn = await checkInsRepository.create({
      id: 'check-in-01',
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    const { checkIn } = await sut.execute({ checkInId: 'check-in-01' })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() => {
      return sut.execute({ checkInId: 'inexistent-check-in' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in 20 minutes after creation', async () => {
    vi.setSystemTime(new Date(2025, 4, 16, 8, 0, 0))

    await checkInsRepository.create({
      id: 'check-in-01',
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    const twentyOneMinutesInMilliseconds = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMilliseconds)

    await expect(() => {
      return sut.execute({ checkInId: 'check-in-01' })
    }).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
