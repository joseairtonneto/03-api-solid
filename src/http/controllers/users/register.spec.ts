import request from 'supertest'
import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'

describe('Register (e2e)', () => {
  beforeAll(async () => await app.ready())
  afterAll(async () => await app.close())

  it('should be able to register', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@example.com', password: 'doe123' })

    expect(response.statusCode).toEqual(201)
  })
})
