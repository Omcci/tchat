const app = require('express')();
const http = require('http').createServer(app);
const env = require('../env.js');
const PORT = env.portBackend;

var io = require('socket.io')(http, {
  cors: {
    origin: `http://${env.ip}:${env.portFront}`,
    methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    // credentials: true
}});


let players = [];
// const rooms = {};

// function getUsersInRoom(room) {
//   const users = [];
//   const socketsInRoom = io.sockets.adapter.rooms.get(room);
//   if (socketsInRoom) {
//     socketsInRoom.forEach(socketId => {
//       const socket = io.sockets.sockets.get(socketId);
//       if (socket) {
//         users.push({ id: socket.id, username: socket.username });
//       }
//     });
//   }
//   return users;
// }

// io.on('connection', (socket) => {
//   // ...
//   console.log('connexion..;')
//   // Join a specific room
//   const room = 'room1';
//   socket.join(room);
//   socket.currentRoom = room;

//   // Notify all users in the room of the updated list of users
//   const usersInRoom = getUsersInRoom(room);
//   io.to(room).emit('usersInRoom', usersInRoom);

//   // Listen for changes to the list of users in the room
//   socket.on('disconnect', () => {
//     const usersInRoom = getUsersInRoom(room);
//     io.to(room).emit('usersInRoom', usersInRoom);
//   });
// });

// const rooms = {};

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on("join", ({ username, room }) => {
//     console.log(`${username} joined ${room}`);
//     socket.join(room);
//     io.to(room).emit("user joined", `${username} joined the room`);
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

const usersByRoom = {};

// io.on("connection", (socket) => {
//   console.log("usersByRoom", usersByRoom)
//   socket.on("join", ({ username, room }) => {
//     socket.join(room);

//     if (!usersByRoom[room]) {
//       usersByRoom[room] = [];
//     }

//     usersByRoom[room].push({ id: socket.id, username });

//     io.to(room).emit("usersInRoom", usersByRoom[room]);
//   });

//   socket.on("disconnect", () => {
//     console.log("usersByRoom", usersByRoom)
//     const room = Object.keys(socket.rooms)[1];

//     if (usersByRoom[room]) {
//       usersByRoom[room] = usersByRoom[room].filter((user) => user.id !== socket.id);
//       io.to(room).emit("usersInRoom", usersByRoom[room]);
//     }
//   });
// });

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }) => {
    socket.join(room);
    if (!usersByRoom[room]) {
      usersByRoom[room] = [];
    }

    usersByRoom[room].push({ id: socket.id, username });
    
    io.to(room).emit("usersInRoom", usersByRoom[room]);
    console.log("usersByRoom", usersByRoom)
  });

  socket.on("newUsername", ({ username , room}) => {
    console.log("username", username);
    if (usersByRoom[room]) {
      usersByRoom[room] = usersByRoom[room].map((user) =>
        user.id === socket.id ? { ...user, username } : user
      );
      io.to(room).emit("usersInRoom", usersByRoom[room]);
    }
    console.log(usersByRoom[room]);
  });

  socket.on("disconnect", () => {
    Object.keys(usersByRoom).forEach((room) => {
      usersByRoom[room] = usersByRoom[room].filter((user) => user.id !== socket.id);
      io.to(room).emit("usersInRoom", usersByRoom[room]);
      // Suppression Room
      if (usersByRoom[room].length === 0) {
        delete usersByRoom[room];
      }
    });
  });
});


http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});