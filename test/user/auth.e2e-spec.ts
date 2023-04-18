import { UserModule } from "@/user/user.module";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        // 组装
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UserModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('/auth/login (POST)', () => {
        it('should return token when username and password are corret', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ phoneNumber: '18888888888', password: '888888' })
                .expect(201)

            expect(response.body.data.token).toBeDefined()

        })

        it('should return 401 when username and password are incorret', async () => {
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({ phoneNumber: '18888888888', password: '888881' })
                .expect(404)
        })

        afterEach(async () => {
            await app.close()
        })

    })
})