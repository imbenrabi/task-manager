const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        unique: true,
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Invalid password - cannot contain "password"');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer,
    },
    age: {
        type: Number,
        default: null,
        validate(value) {
            if (value < 0 || value === 0) {
                throw new Error('Age must be a positive number');
            }
        }
    }
}, {
    timestamps: true
})

/**virtual is data relationship management, not actual field in the schema */
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

/**userSchema.methods house instance methods */

/**toJSON is used by express behind the scenes to send JSON data to the client
 I can manipulate it as seen below to hide certain user object data*/
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject()

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return (token)
}

/**userSchema.statics house static methods */
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

/**creating a middleware prior to the save of a new user, do not use arrow function
 *since we want to preserve 'this' binding*/

/**hash the plain text password before saving*/
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

/**delete user tasks when user is removed */
userSchema.pre('remove', async function (next) {
    const user = this;

    await Task.deleteMany({ owner: user._id })
    next();
})


const User = mongoose.model('user', userSchema)

module.exports = User;