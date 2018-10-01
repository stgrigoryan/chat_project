const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const WebSocket = require('ws');
const fs = require('fs');

const expressLayouts = require('express-ejs-layouts');

const indexRouter = require('./routes/index');

const mongoose = require('mongoose');
const db = mongoose.createConnection('mongodb://localhost:27017/chat');
const MessagesSchema = require('./models/message');
const UsersSchema = require('./models/users');
const Messages = db.model('messages', MessagesSchema);
const Users = db.model('users', UsersSchema);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const  server = app.listen(3030, () => {
    console.log (`Server started on port 3030`);
});


const wss = new WebSocket.Server({ server});

// messages = [];

function findOrCreateUser(username, cb) {
    Users.findOne({username: username}, user => {
        if (!user) {
            Users.create({username: username}, (err, user) => {
                console.log(user);
                cb(user._id);
            });
        } else {
            cb(user._id);
        }
    })
}

wss.on('connection', function (ws) {
    Messages.find()
        .populate('user')
        .exec((err, msgs) => {
        (msgs || []).forEach(msg => {
            console.log('message == ', msg);
            ws.send(JSON.stringify({text: msg.text, user: msg.user.username}))
        });
        ws.on('message', function (data) {
            let dataObj = JSON.parse(data);
            console.log(dataObj);
            if (data.includes('typing') ) {
                wss.clients.forEach(function (conn) {
                    conn.send(data);
                });
            } else {
                findOrCreateUser(dataObj.user, (user_id) => {
                    Messages.create({text: dataObj.text, user: user_id});
                });
            }

            // zugaher ashxarh
            // jnjel heto
            // console.log(1);
            // Users.findOne({username: dataObj.user}, (user_doc) => {
            //     console.log(2);
            //     if (!user) {
            //         console.log(3);
            //         Users.create({username: dataObj.user}, (new_user_doc) => {
            //             console.log(4);
            //             Messages.create({text: dataObj.text, user: new_user_doc._id});
            //         })
            //     } else {
            //         console.log(5);
            //         Messages.create({text: dataObj.text, user: user_doc._id});
            //     }
            //     console.log(6)
            // });
            // console.log(7);


            //messages.push(data);
            console.log('Message Received: %s', data);
            wss.clients.forEach( conn => {
                conn.send(data);
            });
        });
    });
});