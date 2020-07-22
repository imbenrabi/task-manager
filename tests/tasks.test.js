const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
    testUserId,
    testUser,
    testUserTwoId,
    testUserTwo,
    testTaskOne,
    testTaskTwo,
    testTaskThree,
    configureDatabase
} = require('./fixtures/db');

beforeEach(configureDatabase);

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            description: 'get your back into it'
        })
        .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
})

test('Should get tasks for authenticated user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body).toHaveLength(2);
})

test('Should get specific task for authenticated user', async () => {
    const response = await request(app)
        .get(`/tasks/${testTaskTwo._id}`)
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)

    const task = await Task.findById(testTaskTwo._id);
    expect(response.body.description).toEqual(task.description);
})

test('Should not allow user to delete other users tasks', async () => {
    await request(app)
        .delete(`/tasks/${testTaskOne._id}`)
        .set('Authorization', `Bearer ${testUserTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = Task.findById(testTaskOne._id);
    expect(task).not.toBeNull();
})

test('Should allow user to delete task', async () => {
    await request(app)
        .delete(`/tasks/${testTaskOne._id}`)
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)

    const task = await Task.findById(testTaskOne._id);
    expect(task).toBeNull();
})