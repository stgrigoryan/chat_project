const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('login', {
        title: 'Web chat'
    });
});

// router.get('/chat-room', function (req, res, next) {
//     res.render('chat-room', {
//         title: 'Chat room',
//         nickname: req.query.nickname
//     });
// });


module.exports = router;
