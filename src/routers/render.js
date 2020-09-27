const express = require('express');

const router = new express.Router();

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/account', (req, res) => {
    res.render('account');
})

module.exports = router;