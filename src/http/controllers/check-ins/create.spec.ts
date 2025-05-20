import request from 'supertest'
import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create Check-In (e2e)', () => {
  beforeAll(async () => await app.ready())
  afterAll(async () => await app.close())

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'Example gym',
        description: 'Gym example to test e2e',
        phone: '4002-8922',
        latitude: -9.6099249,
        longitude: -35.7181854,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -9.6099249,
        longitude: -35.7181854,
      })

    expect(response.statusCode).toEqual(201)
  })
})
