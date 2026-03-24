import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { prisma } from '../src/infra/prisma/prisma.provider.js'

beforeEach(async () => {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "TaskHistory", "Task", "User" CASCADE;
  `);
});

describe('Task E2E', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register and login', async () => {
    const email = `test${Date.now()}@test.com`;
    const password = '123456';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(201);

    expect(res.body.accessToken).toBeDefined();

    accessToken = res.body.accessToken;
  });

  let taskId: string;

  it('should create a task', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Task E2E',
        description: 'testing',
      })
      .expect(201);

    expect(res.body.id).toBeDefined();

    taskId = res.body.id;
  });

  it('should list tasks', async () => {
    const res = await request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update task status', async () => {
    await request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: 'DONE',
      })
      .expect(200);
  });

  it('should block unauthorized access', async () => {
    await request(app.getHttpServer())
      .get('/tasks')
      .expect(401);
  });
});


