const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
// const app = require('express')();
// const http = require('http').createServer(app);
// const io = require('socket.io')(http);
const env = require('../env.js');
const port = env.portBackend;

// const http = require('http').createServer(app);

var io = require('socket.io')(http, {
  cors: {
    origin: `http://${env.ip}:${env.portFront}`,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }});

// io.on('connection', function(socket){
//     console.log("test")
//     socket.on('sendMessage', function(message) {
   
//         socket.emit('sendMessageFromBack', message);
      
//     });

//     socket.broadcast.emit('sendMessageFromBack', "New user connected");
// });

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.header('Access-Control-Allow-Credentials', true);
//   next();
// });
// const cors = require('cors');

// app.use(cors({
//   origin: 'http://localhost:5173/'
// }));

// io.on('connection', function(socket){
   
//  socket.on('sendMessage', function(message) {
   
//    socket.emit('sendMessageFromBack', message);
 
//  });

//  socket.broadcast.emit('sendMessageFromBack', "New user connected");

//    socket.on("test_polling", () => {
//     console.log("Polling test successful");
//   });
 
// });

//Gestion du CORS
// const cors = require('cors');
// app.use(cors())

// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.header('Access-Control-Allow-Credentials', true);
//     next();
// });

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.31:5173');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

// Système multi joueur 
const gameRooms = {};
const users = {};

io.on('connection', (socket) => {

  console.log('A user connected');
//   console.log('socket', socket)
//   socket.on('joinRoom', (room) => {
    // if (!gameRooms[room]) {
    //   gameRooms[room] = [socket.id];
    //   socket.join(room);
    //   socket.emit('roomJoined', room);
    // } else if (gameRooms[room].length === 1) {
    //   gameRooms[room].push(socket.id);
    //   socket.join(room);
    //   io.to(room).emit('roomJoined', room);
    // } else {
    //   socket.emit('roomFull');
    // }
//   });

socket.on('getPlayers', (room) => {
    console.log("getPlayers")
    // const room = socket.rooms.values().next().value;
    // const players = io.sockets.adapter.rooms.get(room).size;
    // console.log("players", players)
    // socket.emit('getPlayers', players);
    const players = io.sockets.adapter.rooms.get(room);
    if (players) {
      return Array.from(players).map(socketId =>  {
        console.log("socketId", socketId)
        io.sockets.sockets.get(socketId).username
      });
    }
    return [];
});

socket.on("test_polling", () => {
    console.log("Polling test successful");
});

socket.on('joinRoom', (username, room) => {

    // console.log("username", username)
    // if (!gameRooms[room]) {
    //     gameRooms[room] = [{ id: socket.id, username }];
    //     socket.join(room);
    //     socket.emit('roomJoined', room);
    //   } else if (gameRooms[room].length >= 1) {
    //     let etatJoinRoom = false;
    //     for (let i = 0; i < gameRooms[room].length; i++) {
    //       console.log("gameRooms[room][i].id", gameRooms[room][i].id);
    //       console.log("socket.id", socket.id);
    //       if (gameRooms[room][i].id !== socket.id) {
    //         etat = true;
    //       } 
    //     }
    //     console.log(gameRooms[room].indexOf(""));
    //     if (etatJoinRoom) {
    //       gameRooms[room].push({ id: socket.id, username });
    //       socket.join(room);
    //       io.to(room).emit('roomJoined', room);
    //       etat = false;
    //     }
    //   } else {
    //     socket.emit('roomFull');
    // }

    // if (!gameRooms[room]) {
    //   gameRooms[room] = [{ id: socket.id, username }];
    //   socket.join(room);
    //   socket.emit('roomJoined', room);
    // } else if (gameRooms[room].length >= 1 && gameRooms[room].includes(socket.id)) {
    //   // console.log("gameRooms[room]", gameRooms[room][0].id)
    //   // for (let i = 0; i < gameRooms[room].length; i++) {
    //   //   console.log(gameRooms[room][i])
    //   // }
    //   gameRooms[room].push({ id: socket.id, username });
    //   socket.join(room);
    //   io.to(room).emit('roomJoined', room);
    // } else {
    //   socket.emit('roomFull');
    // }

    // __________________________________________________
    // if (!gameRooms[room]) {
    //   gameRooms[room] = [{ id: socket.id, username }];
    //   playerIds.push(socket.id);
    //   socket.join(room);
    //   socket.emit('roomJoined', room);
    // } else if (gameRooms[room].length >= 1 && !playerIds.includes(socket.id)) {
    //   console.log("playerIds.includes(socket.id)", playerIds.includes(socket.id))
    //   gameRooms[room].push({ id: socket.id, username });
    //   playerIds.push(socket.id);
    //   socket.join(room);
    //   io.to(room).emit('roomJoined', room);
    // } else {
    //   socket.emit('roomFull');
    // }

    // console.log("gameRooms[room]", gameRooms)
    // console.log(`User ${socket.id} joined room ${room}, user : ${username}`);
    // __________________________________________________



    const userId = socket.id;

    // console.log('Users : ', users);
      // Vérifier si l'utilisateur n'est pas déjà dans une room
      if (users[userId]) {
        users[userId].username = username;
        users[userId].room = room;
        socket.emit('alreadyInRoom', { roomId: users[userId].room });
        return;
      }

      // Vérifier si la room existe et si elle n'est pas pleine
      // if (!gameRooms[room]) {
      //   socket.emit('roomNotFound');
      //   return;
      // if (gameRooms[room].length === 2) {
      //   socket.emit('roomFull');
      //   return;
      // }

      if (!gameRooms[room]) {
        // gameRooms[room] = userId;
        // socket.join(room);
        // users[userId] = { username, room };
        // gameRooms[room] = [{ id: socket.id, username }];
        // socket.join(room);
        // socket.emit('roomJoined', room);
        gameRooms[room] = [userId];
        socket.join(room);
        users[userId] = { username, room };
      } else if (gameRooms[room].length >= 1) {
        // gameRooms[room].push(userId);
        // socket.join(room);
        // users[userId] = { username, room };
        // gameRooms[room].push([{ id: socket.id, username }]);
        // socket.join(room);
        // io.to(room).emit('roomJoined', room);
        gameRooms[room].push(userId);
        socket.join(room);
        users[userId] = { username, room };
      } else {
        socket.emit('roomFull');
      }

      // Ajouter l'utilisateur dans la room
      // gameRooms[room].push(userId);
      // socket.join(room);
      // users[userId] = { username, room };

      console.log("gameRooms[room]", gameRooms)
      console.log(`User ${socket.id} joined room ${room}, user : ${username}`);
      // Envoyer les informations de la room au client
      io.to(room).emit('roomJoined', { roomId: room, players: gameRooms[room] });

      // console.log("gameRooms[room]", gameRooms)
      // console.log(`User ${socket.id} joined room ${room}, user : ${username}`);
    // console.log(io.sockets.sockets);
    // // Récupérer la liste des joueurs dans la room
    // console.log('room', room)
    // const players = io.sockets.adapter.rooms.get(room).size;
    // const sockets = io.sockets.adapter.rooms.get(room).sockets;
    // console.log(players)
    // console.log(sockets)
    // io.to(room).emit('playerList', players);


    // const players = [];
    // const sockets = io.sockets.adapter.rooms.get(room).sockets;
    // console.log(sockets)
    // if (sockets !== undefined) {
    //     for (const socketId of sockets) {
    //         const playerSocket = io.sockets.sockets.get(socketId);
    //         const player = {
    //           id: playerSocket.id,
    //           name: playerSocket.data.name, // supposons que chaque socket a un champ "name" qui contient le nom du joueur
    //         };
    //         players.push(player);
    //     }
    // }

    // io.to(room).emit('playerList', players);

    // console.log(`Players in room ${room}: ${JSON.stringify(players)}`);
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
    // for (let room in gameRooms) {
    //   for (let i = 0; i < gameRooms[room].length; i++) {
    //     if (gameRooms[room][i].id === socket.id) {
    //       gameRooms[room].splice(i, 1);
  
    //       if (gameRooms[room].length === 0) {
    //         delete gameRooms[room];
    //       } else {
    //         io.to(room).emit('playerLeft');
    //       }
  
    //       break;
    //     }
    //   }
    // }
    const userId = socket.id;

    // Vérifier si l'utilisateur est dans une room
    if (!users[userId]) {
      return;
    }

    const { room } = users[userId];

    // Retirer l'utilisateur de la room
    gameRooms[room] = gameRooms[room].filter((id) => id !== userId);
    socket.leave(room);
    delete users[userId];

    console.log("gameRooms[room]", gameRooms);
    console.log(`User ${socket.id}, room : ${room}`);

    // Envoyer les informations de la room au client
    io.to(room).emit('roomLeft', { roomId: room, players: gameRooms[room] });

    // console.log('room', room)
    // const room = socket.rooms.values().next().value;
    // if (room !== undefined) {
    //     const players = io.sockets.adapter.rooms.get(room).size;
    //     io.to(room).emit('playerList', players);
    // }
  });
});


app.get('/', (req, res) => {
    res.send("test");
  });

app.get('/socket.io/', (req, res) => {
    res.send("Data socket");
});

http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});