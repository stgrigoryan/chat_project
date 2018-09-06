var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const WebSocket = require('ws');
const fs = require('fs');

var expressLayouts = require('express-ejs-layouts');

var indexRouter = require('./routes/index');

var app = express();

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

let messages = [];

wss.on('connection', function (ws) {
    messages.forEach(function(message){
        console.log(message);
        ws.send(message);
    });

    ws.on('message', function (data) {
        let dataObj = JSON.parse(data);
        console.log(dataObj);
        if (data.includes('typing') ) {
            wss.clients.forEach(function (conn) {
                    conn.send(data);
            });
        }
        messages.push(data);
        console.log('Message Received: %s', data);
        wss.clients.forEach(function (conn) {
            conn.send(data);
        });
    });
});


