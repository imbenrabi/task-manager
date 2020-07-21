const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');
const { findById } = require('../src/models/user');

const testUserId = new mongoose.Types.ObjectId();
const testUser = {
    _id: testUserId,
    name: 'Meta World-Peace',
    email: 'peace@testing.com',
    password: 'peaceAndLove!!',
    tokens: [{
        token: jwt.sign({ _id: testUserId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany({});
    await new User(testUser).save();
})

test('Should sign up a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Test Testy',
            email: 'test@testing.com',
            password: 'testyTesties753'
        })
        .expect(201);

        // assert the db was changed correctly
        const user = await User.findById(response.body.user._id);
        expect(user).not.toBeNull();

        // assertions about the response
        expect(response.body).toMatchObject({
            user: {
                name: 'Test Testy',
                email: 'test@testing.com'
            },
            token: user.tokens[0].token
        })

        expect(user.password).not.toBe('testyTesties753');
})

test('Should login existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: testUser.email,
            password: testUser.password
        })
        .expect(200);
    
    const user = await User.findById(testUserId);
    expect(response.body.token).toBe(user.tokens[1].token);    
})

test('Should reject login nonexsistent user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: testUser.email,
            password: 'kingBbRulez!'
        })
        .expect(400);
})

test('Should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200);
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer rrrgtye4567$`)
        .send()
        .expect(401);
})

test('Should delete user account', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(testUserId);
    expect(user).toBeNull();
})

test('Should not delete unauthenticated user account', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer `)
        .send()
        .expect(401);
})