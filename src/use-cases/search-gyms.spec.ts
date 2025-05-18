import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
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
      title: 'Example gym',
      description: 'Gym example to test the use case',
      phone: '4002-8922',
      latitude: -9.6099249,
      longitude: -35.7181854,
    })

    await gymsRepository.create({
      title: 'Not showing gym',
      description: 'Gym example to test the use case',
      phone: '4002-8922',
      latitude: -9.6099249,
      longitude: -35.7181854,
    })

    const { gyms } = await sut.execute({ query: 'Example', page: 1 })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Example gym' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Example gym ${i}`,
        description: `Gym example to test the use case`,
        phone: '4002-8922',
        latitude: -9.6099249,
        longitude: -35.7181854,
      })
    }

    const { gyms } = await sut.execute({ query: 'Example', page: 2 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Example gym 21' }),
      expect.objectContaining({ title: 'Example gym 22' }),
    ])
  })
})
