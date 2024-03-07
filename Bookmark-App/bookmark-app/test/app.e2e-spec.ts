import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);
    prisma = await app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3333/');
  });
  afterAll(async () => {
    await app.close();
  });
  it.todo('hello todo');

  describe('Auth', () => {
    describe('Sign-Up', () => {
      it('should throw an error if email empty', () => {
        const dto: AuthDto = { email: 'test1@yopmail.com', password: '123' };
        return pactum
          .spec()
          .post('auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw an error if password empty', () => {
        const dto: AuthDto = { email: 'test1@yopmail.com', password: '123' };
        return pactum
          .spec()
          .post('auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should sign-up', () => {
        const dto: AuthDto = { email: 'test1@yopmail.com', password: '123' };
        return pactum
          .spec()
          .post('auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Sign-In', () => {
      it('should throw if email empty', () => {
        const dto: AuthDto = { email: 'test1@yopmail.com', password: '123' };
        return pactum
          .spec()
          .post('auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        const dto: AuthDto = { email: 'test1@yopmail.com', password: '123' };
        return pactum
          .spec()
          .post('auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('should login', () => {
        const dto: AuthDto = { email: 'test1@yopmail.com', password: '123' };
        return pactum
          .spec()
          .post('auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAccessToken', 'access_token');
      });
    });
  });

  describe('Users', () => {
    describe('Get Me', () => {
      it('should give USER back', () => {
        return pactum
          .spec()
          .get('users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });
      it('should give an UNAUTHORIZED error', () => {
        return pactum
          .spec()
          .get('users/me')
          .withHeaders({ Authorization: 'Bearer $S{invalidToken}' })
          .expectStatus(401);
      });
      it('should give NOT FOUND error back', () => {
        return pactum
          .spec()
          .get('user/me')
          .withHeaders({ Authorization: 'Bearer $S{userAcceddssToken}' })
          .expectStatus(404);
      });
    });
  });
});
