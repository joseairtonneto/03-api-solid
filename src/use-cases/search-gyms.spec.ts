import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Test gym',
      description: null,
      phone: null,
      latitude: -9.610058,
      longitude: -35.718316,
    })

    await gymsRepository.create({
      title: 'Gym not returned',
      description: null,
      phone: null,
      latitude: -9.610058,
      longitude: -35.718316,
    })

    const { gyms } = await sut.execute({ query: 'Test gym', page: 1 })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Test gym' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        id: `gym-${i}`,
        title: `Test gym${i}`,
        description: null,
        phone: null,
        latitude: -9.610058,
        longitude: -35.718316,
      })
    }

    const { gyms } = await sut.execute({ query: 'Test gym', page: 2 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Test gym21' }),
      expect.objectContaining({ title: 'Test gym22' }),
    ])
  })
})
