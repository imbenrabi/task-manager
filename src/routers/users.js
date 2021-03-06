const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeMail, sendCancellationMail } = require('../emails/account');
const log = console.log;

const router = new express.Router();

// when I dont provide 'dest' to multer it will return the file
const upload = multer({
    //dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return callback(new Error('Please upload an image'));
        }

        callback(undefined, true);
    }
});

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        sendWelcomeMail(user.email, user.name);
        const token = await user.generateAuthToken()

        log(`user created successfully`);
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch (error) {

        res.status(400).send(error);
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();

        res.send();
    } catch (error) {
        log(error);
        res.status(500).send(error);
    }

})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        log(error);
        res.status(500).send(error);
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})

/**findByIdAndUpdate  bypass mongoose middleware so we will have to seperate the operations*/
router.patch('/users/me', auth, async (req, res) => {
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const updates = Object.keys(req.body);
    const isAllowed = updates.every((update) => allowedUpdates.includes(update));

    if (!isAllowed) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();

        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);

    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancellationMail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);

    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ height: 250, width: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = null;
        await req.user.save();
        res.send()
    } catch (error) {
        log(error);
        res.status(500).send();
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user.avatar || !user) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (error) {
        log(error);
        res.status(404).send(error)
    }
})


module.exports = router;