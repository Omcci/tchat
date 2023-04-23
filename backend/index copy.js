const express = require('express');
const app = express();
const http = require('http').createServer(app);
const env = require('../env.js');
const port = env.portBackend;

var io = require('socket.io')(http, {
  cors: {
    origin: `http://${env.ip}:${env.portFront}`,
    methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    // credentials: true
}});

// Système multi joueur 
const gameRooms = {};
const users = {};

io.on('connection', (socket) => {

  console.log("users list :", users)
  console.log('A user connected');

socket.on('getPlayers', (nameRoom) => {
    // const players = io.sockets.adapter.rooms.get(room)?.size || 0;
    // console.log("players", players);
    // io.to(room).emit('getPlayers', ["test"]);
    // const players = Object.values(users).map(({ username, room }) => ({ id: socket.id, username, room }));
    // socket.emit('getPlayers', players);
    // io.to(room).emit('getPlayers', players);
    // const room = socket.rooms.values().next().value;
    // const players = io.sockets.adapter.rooms.get(room).size;
    // console.log("players", players)
    // socket.emit('getPlayers', players);
    // const players = io.sockets.adapter.rooms.get(room);
    // if (players) {
    //   return Array.from(players).map(socketId =>  {
    //     console.log("socketId", socketId)
    //     io.sockets.sockets.get(socketId).username
    //   });
    // }
    // return [];
    // socket.emit('getPlayers', "{ roomId: users[userId].room }");
    // io.to(room).emit('getPlayers', "1");
    // const players = gameRooms[room];
    // socket.emit('playersList', { roomId: room, players: players });
    // io.to(room).emit('getPlayers', { roomId: room, players: gameRooms[room] });
    // const players = Object.values(users).map(({ username, room }) => ({ id: socket.id, username, room }));
    // socket.emit('getPlayers', players);
    // console.log("getPlayer");
    // socket.emit('getPlayers', "test");
    // const players = Object.values(users).map(({ username, room }) => ({ id: socket.id, username, room }));
    console.log('nameRoom', typeof nameRoom)
    if (typeof nameRoom === "string") {
      let players = Object.values(users)
      .filter(({ room }) => room === nameRoom) // on filtre uniquement les joueurs de la salle spécifiée
      .map(({ username, room }, index) => (
        console.log("-->", username, room, index)
        ,{
        id: Object.keys(users)[index],
        username,
        room,
      }));
      io.emit('playersUpdate', players);
    }
    // io.emit('playersUpdate', players);
    // const players = io.sockets.adapter.rooms.get(room).size;
    // io.emit('getPlayers', ["test"]);
    // const players = Object.values(users).map(({ username, room }) => ({ id: socket.id, username, room }));
    // console.log('players Map', players)
    // const players = io.sockets.adapter.rooms.get(room).size;
    // Object.values(users).map(({ id ,username, room }) => (console.log(id, username, room)));
    // io.emit('playersUpdate', players);
  });

socket.on("test_polling", () => {
    console.log("Polling test successful");
});

socket.on('joinRoom', (username, room) => {

    // // Émettre un événement 'playersUpdate' pour informer les clients que la liste a été mise à jour
    // const players = Object.values(users).map(({ username, room }, index) => ({ 
    //   id: Object.keys(users)[index],
    //   username,
    //   room 
    // }));
    // // const players = io.sockets.adapter.rooms.get(room).size;
    // // io.emit('playersUpdate', [users]);
    // io.emit('playersUpdate', players);

    // if (typeof nameRoom === "string") {
    // const players = Object.values(users)
    //   .filter(({ roomFil }) => roomFil === room) // on filtre uniquement les joueurs de la salle spécifiée
    //   .map(({ username, room }, index) => (
    //     console.log("-->", username, room, index)
    //     ,{
    //     id: Object.keys(users)[index],
    //     username,
    //     room,
    //   }));
    //   io.emit('playersUpdate', players);
    // }

    const userId = socket.id;

      // Si l'utilisateur est déjà dans une room, on le déconnecte de celle-ci
      if (users[userId] && users[userId].room !== room) {
        const oldRoom = users[userId].room;
        gameRooms[oldRoom] = gameRooms[oldRoom].filter((id) => id !== userId);
        socket.leave(oldRoom);
        io.to(oldRoom).emit('playerLeft', { playerId: userId });
        delete users[userId];
        if (gameRooms[oldRoom].length === 0) {
          delete gameRooms[oldRoom];
        }
        // Si l'utilisateur est déjà dans la room qu'il essaie de rejoindre, on l'en informe
      } else if (users[userId] && users[userId].room === room) {
        users[userId].username = username;
        users[userId].room = room;
        socket.emit('alreadyInRoom', { roomId: users[userId].room });
        // return;
      } else {
        if (!gameRooms[room]) {
          gameRooms[room] = [userId];
          socket.join(room);
          users[userId] = { username, room };
        } else if (gameRooms[room].length >= 1) {
          gameRooms[room].push(userId);
          socket.join(room);
          users[userId] = { username, room };
        } else {
          socket.emit('roomFull');
        }
      }

      // Vérifier si l'utilisateur n'est pas déjà dans une room
      if (users[userId]) {
        users[userId].username = username;
        users[userId].room = room;
        socket.emit('alreadyInRoom', { roomId: users[userId].room });
        return;
      }

      // Si l'utilisateur est déjà dans la room qu'il essaie de rejoindre, on l'en informe
      // if (users[userId] && users[userId].room === room) {
        // users[userId].username = username;
        // users[userId].room = room;
        // socket.emit('alreadyInRoom', { roomId: users[userId].room });
        // return;
      // }

      console.log("gameRooms[room]", gameRooms)
      console.log('list user', users);
      console.log(`User ${socket.id} joined room ${room}, user : ${username}`);
      io.to(room).emit('roomJoined', { roomId: room, players: gameRooms[room] });
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

  socket.on('disconnect', (rooms) => {
    const userId = socket.id;

    // Vérifier si l'utilisateur est dans une room
    if (!users[userId]) {
      return;
    }

    // récupération de la room 
    const { room } = users[userId];

    
    // Retirer l'utilisateur de la room
    gameRooms[room] = gameRooms[room].filter((id) => id !== userId);
    console.log("room -->",room)
    socket.leave(room);
    delete users[userId];

    if (gameRooms[room].length === 0) {
      delete gameRooms[room];
    }

    // gameRooms[room] = gameRooms[room].filter((nameRoom) => console.log("--->", nameRoom))
    // if (gameRooms[room].length === 0) {
    //   console.log("test")
    //   delete gameRooms[room];
    // }
    // if (gameRooms[room].length === 0) {
    //   console.log("test delete room ");
        // delete gameRooms[room];
    // }
    
    // console.log("gameRooms[room]", gameRooms);
    console.log(`User ${socket.id}, room : ${room}`);

    // Supprimer l'utilisateur de la liste des utilisateurs de toutes les salles
    // for (let toto in rooms) {
    //   console.log("room", rooms[toto])
      // const users = gameRooms[room].filter((id) => id !== userId);
      // rooms[toto].users = users;
      // io.to(room).emit('playersUpdate', users);
    // }

    io.to(socket.room).emit('playersUpdate', socket.username);
    
    // Envoyer les informations de la room au client
    io.to(room).emit('roomLeft', { roomId: room, players: gameRooms[room] });
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