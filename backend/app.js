var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

// Système multi joueur 
const gameRooms = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (room) => {
    if (!gameRooms[room]) {
      gameRooms[room] = [socket.id];
      socket.join(room);
      socket.emit('roomJoined', room);
    } else if (gameRooms[room].length === 1) {
      gameRooms[room].push(socket.id);
      socket.join(room);
      io.to(room).emit('roomJoined', room);
    } else {
      socket.emit('roomFull');
    }
  });

  socket.on('submitAnswer', (data) => {
    const { room, answer } = data;
    const correctAnswer = 'B'; // Remplacez avec la réponse correcte pour votre quizz
    let isCorrect = answer === correctAnswer;

    if (isCorrect) {
      io.to(room).emit('answerResult', {
        message: 'Bonne réponse!',
        isCorrect: true,
      });
    } else {
      io.to(room).emit('answerResult', {
        message: 'Mauvaise réponse.',
        isCorrect: false,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');

    for (let room in gameRooms) {
      if (gameRooms[room].indexOf(socket.id) !== -1) {
        gameRooms[room].splice(gameRooms[room].indexOf(socket.id), 1);

        if (gameRooms[room].length === 0) {
          delete gameRooms[room];
        } else {
          io.to(room).emit('playerLeft');
        }

        break;
      }
    }
  });
});

module.exports = app;
