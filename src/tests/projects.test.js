const request = require('supertest');
const app = require('../app');
const dbHandler = require('./setup');
const User = require('../models/User');
const Project = require('../models/Project');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clear());
afterAll(async () => await dbHandler.close());

describe('Projects API', () => {
    let token1, token2, user1, user2;

    beforeEach(async () => {
        // Create 2 users in different tenants
        user1 = await User.create({
            name: 'User One',
            email: 'user1@example.com',
            password: 'password123',
            tenantId: 'tenant-1'
        });

        user2 = await User.create({
            name: 'User Two',
            email: 'user2@example.com',
            password: 'password123',
            tenantId: 'tenant-2'
        });

        const login1 = await request(app).post('/api/v1/auth/login').send({
            email: 'user1@example.com',
            password: 'password123'
        });
        token1 = login1.body.token;

        const login2 = await request(app).post('/api/v1/auth/login').send({
            email: 'user2@example.com',
            password: 'password123'
        });
        token2 = login2.body.token;
    });

    it('should create a new project', async () => {
        const res = await request(app)
            .post('/api/v1/projects')
            .set('Authorization', `Bearer ${token1}`)
            .send({
                title: 'Project 1',
                description: 'Test project description'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('Project 1');
        expect(res.body.data.tenantId).toBe('tenant-1');
    });

    it('should list only projects for the users tenant', async () => {
        // Create projects for different tenants
        await Project.create({
            title: 'T1 Project',
            description: 'Desc',
            owner: user1._id,
            tenantId: 'tenant-1'
        });

        await Project.create({
            title: 'T2 Project',
            description: 'Desc',
            owner: user2._id,
            tenantId: 'tenant-2'
        });

        const res = await request(app)
            .get('/api/v1/projects')
            .set('Authorization', `Bearer ${token1}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.count).toBe(1);
        expect(res.body.data[0].title).toBe('T1 Project');
    });

    it('should not allow user to access project from another tenant', async () => {
        const project2 = await Project.create({
            title: 'T2 Project',
            description: 'Desc',
            owner: user2._id,
            tenantId: 'tenant-2'
        });

        const res = await request(app)
            .get(`/api/v1/projects/${project2._id}`)
            .set('Authorization', `Bearer ${token1}`);

        expect(res.statusCode).toEqual(404);
    });

    it('should only allow owner to update their project', async () => {
        const project1 = await Project.create({
            title: 'P1',
            description: 'Desc',
            owner: user1._id,
            tenantId: 'tenant-1'
        });

        // User 2 (different tenant) tries to update - should be 404 because of tenant isolation in service
        const res2 = await request(app)
            .put(`/api/v1/projects/${project1._id}`)
            .set('Authorization', `Bearer ${token2}`)
            .send({
                title: 'Hacked',
                description: 'Attempted hack'
            });
        expect(res2.statusCode).toEqual(404);


        // User 1 updates their own
        const res1 = await request(app)
            .put(`/api/v1/projects/${project1._id}`)
            .set('Authorization', `Bearer ${token1}`)
            .send({
                title: 'Updated',
                description: 'Updated correctly'
            });
        expect(res1.statusCode).toEqual(200);
        expect(res1.body.data.title).toBe('Updated');

    });

    it('should handle validation errors for project creation', async () => {
        const res = await request(app)
            .post('/api/v1/projects')
            .set('Authorization', `Bearer ${token1}`)
            .send({ title: '' }); // Missing description and empty title

        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toBeDefined();
    });
});
