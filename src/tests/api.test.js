const request = require('supertest');
const app = require('../app');
const dbHandler = require('./setup');
const User = require('../models/User');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clear());
afterAll(async () => await dbHandler.close());

describe('Auth API', () => {
    const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        tenantId: 'tenant-1'
    };

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send(userData);

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
    });

    it('should login an existing user', async () => {
        await User.create(userData);

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: userData.email,
                password: userData.password
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
    });

    it('should not register user with duplicate email', async () => {
        await User.create(userData);

        const res = await request(app)
            .post('/api/v1/auth/register')
            .send(userData);

        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
    });

    it('should fail with invalid credentials', async () => {
        await User.create(userData);

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: userData.email,
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });

    it('should get current user profile', async () => {
        await request(app).post('/api/v1/auth/register').send(userData);
        const loginRes = await request(app).post('/api/v1/auth/login').send({
            email: userData.email,
            password: userData.password
        });

        const token = loginRes.body.token;

        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toEqual(userData.email);
    });
});
