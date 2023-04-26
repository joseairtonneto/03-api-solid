import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'

export const app = fastify()

export const prisma = new PrismaClient()
