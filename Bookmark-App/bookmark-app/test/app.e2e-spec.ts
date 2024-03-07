import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';
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
    describe('Edit User', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          email: 'bobby@yopmail.com',
          firstName: 'Bobb',
          lastName: 'TestBobb',
        };
        return pactum
          .spec()
          .patch('users/edit')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.firstName);
      });
    });
  });

  describe('Bookmark', () => {
    describe('Get Empty Bookmark', () => {
      it('should return empty []', () => {
        return pactum
          .spec()
          .get('bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create Bookmark', () => {
      it('should create new bookmark', () => {
        const createPayload: CreateBookmarkDto = {
          link: '/',
          title: 'New Bookmark',
          description: 'Some description',
        };
        return pactum
          .spec()
          .post('bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(createPayload)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });

      it('should create one more bookmark', () => {
        const createPayload: CreateBookmarkDto = {
          link: 'www.youtube.com',
          title: 'New Bookmark Updated',
          description: 'Some description.....',
        };
        return pactum
          .spec()
          .post('bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(createPayload)
          .expectStatus(201);
      });
    });

    describe('Get All Bookmark', () => {
      it('should give all bookmarks', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .get('bookmarks')
          .expectStatus(200)
          .expectJsonLength(2);
      });
    });

    describe('Get Bookmark by Id', () => {
      it('should give bookmark by Id', () => {
        return (
          pactum
            .spec()
            .withHeaders({
              Authorization: 'Bearer $S{userAccessToken}',
            })
            // .get('bookmarks/$S{bookmarkId}') one way doing it
            .get('bookmarks/{id}')
            .withPathParams('id', '$S{bookmarkId}')
            .expectStatus(200)
            .expectJsonSchema({ type: 'object' })
        );
      });
    });

    describe('Edit Bookmark by Id', () => {
      it('should edit bookmark by Id', () => {
        const editedBookmark: EditBookmarkDto = {
          link: 'www.google.com',
          title: 'New Update Bookmark',
          description: 'Some old description',
        };
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .patch('bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(editedBookmark)
          .expectStatus(200)
          .expectJsonSchema({ type: 'object' });
      });
    });

    describe('Delete Bookmark by Id', () => {
      it('should Delete bookmark by Id', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .delete('bookmarks/$S{bookmarkId}')
          .expectStatus(204)
          .inspect();
      });
    });

    describe('Get All Bookmark After Delete', () => {
      it('should give all bookmarks', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .get('bookmarks')
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
  });
});
