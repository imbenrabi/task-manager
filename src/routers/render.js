const express = require('express');

const router = new express.Router();

router.get('/todolist', (req, res) => {
    res.render('index');
})

module.exports = router;