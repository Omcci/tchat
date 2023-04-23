const app = require('express')();
const http = require('http').createServer(app);
const env = require('../env.js');
const PORT = env.portBackend;

var io = require('socket.io')(http, {
  cors: {
    origin: `http://${env.ip}:${env.portFront}`,
    methods: ["GET", "POST"],
}});

const usersByRoom = {};

io.on("connection", (socket) => {

  // l'événement "join" qui est émis lorsque qu'un utilisateur rejoint une room.
  socket.on("join", ({ username, room }) => {

    socket.join(room);

    // Si ce n'est pas le cas, il est créé en tant que tableau vide.
    if (!usersByRoom[room]) {
      usersByRoom[room] = [];
    }

    // On push les infod 
    usersByRoom[room].push({ id: socket.id, username });
    
    // Et on r'envoie dans le frontend
    io.to(room).emit("usersInRoom", usersByRoom[room]);
    console.log("usersByRoom", usersByRoom)

  });

   // l'événement "join" qui est émis lorsque qu'un utilisateur change son pseudo.
  socket.on("newUsername", ({ username , room}) => {
    console.log("username", username);

    if (usersByRoom[room]) {
      
      // créer un nouveau tableau en itérant sur chaque élément du tableau usersByRoom[room]
      usersByRoom[room] = usersByRoom[room].map((user) =>
        user.id === socket.id ? { ...user, username } : user
      );

      // Réponse au front 
      io.to(room).emit("usersInRoom", usersByRoom[room]);
    
    }

    console.log(usersByRoom[room]);
    
  });

  // Ecoute dans un utilisateur ce déconnecte
  socket.on("disconnect", () => {
    Object.keys(usersByRoom).forEach((room) => {
      usersByRoom[room] = usersByRoom[room].filter((user) => user.id !== socket.id);
      io.to(room).emit("usersInRoom", usersByRoom[room]);
      // Suppression Room si il n'ya plus de joueurs dans la room
      if (usersByRoom[room].length === 0) {
        delete usersByRoom[room];
      }
    });
  });
});


http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});