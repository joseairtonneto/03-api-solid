import request from 'supertest'
import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => await app.ready())
  afterAll(async () => await app.close())

  it('should be able to search gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      title: 'Example gym',
      description: 'Gym example to test e2e',
      phone: '4002-8922',
      latitude: -9.6099249,
      longitude: -35.7181854,
    })

    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      title: 'Not showing gym',
      description: 'Gym example to test e2e',
      phone: '4002-8922',
      latitude: -9.6099249,
      longitude: -35.7181854,
    })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({ q: 'Example' })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([expect.objectContaining({ title: 'Example gym' })])
  })
})
