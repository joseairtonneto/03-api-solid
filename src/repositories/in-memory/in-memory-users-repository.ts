import { randomUUID } from 'node:crypto'
import { User, Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find(item => item.id === id)

    return user ?? null
  }

  async findByEmail(email: string) {
    const user = this.items.find(item => item.email === email)

    return user ?? null
  }
  
  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }
}
