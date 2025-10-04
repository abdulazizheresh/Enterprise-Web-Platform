const request = require('supertest');
const { app } = require('../server');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

describe('User Routes', () => {
    let token;
    let userId;

    beforeEach(async () => {
        await User.destroy({ where: {} });

        const user = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            name: 'Test User',
            password: 'Password123'
        });

        userId = user.id;
        token = jwt.sign({ userId }, process.env.JWT_SECRET);
    });

    describe('GET /api/user/profile', () => {
        it('should get user profile', async () => {
            const res = await request(app)
                .get('/api/user/profile')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body.user.email).toBe('test@example.com');
            expect(res.body.user.password).toBeUndefined();
        });

        it('should reject without token', async () => {
            await request(app)
                .get('/api/user/profile')
                .expect(401);
        });
    });

    describe('PUT /api/user/profile', () => {
        it('should update profile', async () => {
            const res = await request(app)
                .put('/api/user/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Updated Name',
                    email: 'updated@example.com'
                })
                .expect(200);

            expect(res.body.user.name).toBe('Updated Name');
        });
    });
});