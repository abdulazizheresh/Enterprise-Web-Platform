const request = require('supertest');
const { app } = require('../server');
const User = require('../src/models/User');

describe('Auth Routes', () => {
    beforeEach(async () => {
        await User.destroy({ where: {} });
    });

    describe('POST /api/auth/register', () => {
        it('should register new user', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                name: 'Test User',
                password: 'Password123'
            };

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

            expect(res.body.message).toBe('User created successfully');
            expect(res.body.token).toBeDefined();
        });

        it('should not register duplicate user', async () => {
            await User.create({
                username: 'testuser',
                email: 'test@example.com',
                name: 'Test',
                password: 'Password123'
            });

            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    name: 'Test',
                    password: 'Password123'
                })
                .expect(400);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            const user = await User.create({
                username: 'testuser',
                email: 'test@example.com',
                name: 'Test',
                password: 'Password123'
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'testuser',
                    password: 'Password123'
                })
                .expect(200);

            expect(res.body.token).toBeDefined();
        });

        it('should reject invalid credentials', async () => {
            await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'invalid',
                    password: 'invalid'
                })
                .expect(401);
        });
    });
});