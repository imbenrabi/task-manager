const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');


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

const testUserTwoId = new mongoose.Types.ObjectId();
const testUserTwo = {
    _id: testUserTwoId,
    name: 'James Sroussi',
    email: 'james@testing.com',
    password: 'mabrukYaHaiti1!!',
    tokens: [{
        token: jwt.sign({ _id: testUserTwoId }, process.env.JWT_SECRET)
    }]
}

const testTaskOne = {
    _id: new mongoose.Types.ObjectId,
    description: 'test the 1st testies',
    completed: false,
    owner: testUser._id
}

const testTaskTwo = {
    _id: new mongoose.Types.ObjectId,
    description: 'test the 2nd testies',
    completed: true,
    owner: testUser._id
}

const testTaskThree = {
    _id: new mongoose.Types.ObjectId,
    description: 'test the 3rd testies',
    completed: false,
    owner: testUserTwo._id
}

const configureDatabase = async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await new User(testUser).save();
    await new User(testUserTwo).save();
    await new Task(testTaskOne).save();
    await new Task(testTaskTwo).save();
    await new Task(testTaskThree).save();
}

module.exports = {
    testUserId,
    testUser,
    testUserTwoId,
    testUserTwo,
    testTaskOne,
    testTaskTwo,
    testTaskThree,
    configureDatabase
}