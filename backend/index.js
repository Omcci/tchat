const app = require('express')();
const http = require('http').createServer(app);
const env = require('../env.js');
const PORT = env.portBackend;

var io = require('socket.io')(http, {
  cors: {
    origin: `http://${env.ip}:${env.portFront}`,
    methods: ["GET", "POST"],
}});

const tchatRoom = {};
console.log("tchatRoom", tchatRoom)

io.on("connection", (socket) => {
  // L'événement "join" qui est émis lorsque qu'un utilisateur rejoint une room.
  socket.on("join", ({ username, room }) => {
    socket.join(room);

    console.log("Debut join : tchatRoom[room]", tchatRoom[room]);

    // Si ce n'est pas le cas, il est créé en tant que tableau vide.
    if (!tchatRoom[room] || tchatRoom[room] === undefined) {
      tchatRoom[room] = { users: [] };
    }

    // Vérifier si le pseudo existe déjà dans la room
    const userExists = tchatRoom[room].users.find((user) => user.username === username);

    console.log("userExists", userExists);

    // Le pseudo existe déjà, renvoyer une erreur ou une notification appropriée
    if (userExists) {
      socket.emit("userExists", "errorPseudoDoublon");
      console.log("Ce pseudo est déjà utilisé dans la room");
      return;
    }

    // Ajout de owner quand il crée la room
    if (!tchatRoom[room].users || tchatRoom[room].users.length === 0) {
      tchatRoom[room].users = [{ id: socket.id, username, owner: true }];
    } else {
      tchatRoom[room].users.push({ id: socket.id, username, owner: false });
    }

    const owner = tchatRoom[room].users.filter((user) => user.owner);
    io.to(room).emit("searchOwner", owner);
    socket.emit("userExists", "ok");

    socket.emit("usersInRoom", tchatRoom[room].users);

    // Envoyer la liste des utilisateurs connectés dans la room à tous les autres utilisateurs déjà présents
    socket.to(room).emit("usersInRoom", tchatRoom[room].users);

    console.log("tchatRoom", tchatRoom);
    console.log("tchatRoom[room]", tchatRoom[room]);
    console.log("tchatRoom[room].users", tchatRoom[room].users);
  });

  socket.on("newUsername", ({ username, room }) => {
    console.log("newUsername")
    const checkUsernameExiste = tchatRoom[room]?.users?.filter(
       (user) => user.username === username
    );
    if (checkUsernameExiste !== undefined) {
      if (checkUsernameExiste.length === 0) {
        if (tchatRoom[room]) {
          // Modifier le pseudo de l'utilisateur dans la room
          tchatRoom[room].users = tchatRoom[room].users.map((user) =>
            user.id === socket.id ? { ...user, username } : user
          );
      
          socket.emit("newUserExists", { success: true }); // Envoyer la confirmation de succès
          io.to(room).emit("usersInRoom", tchatRoom[room].users);
        }
      } else {
        socket.emit("newUserExists", { success: false, message: "errorPseudoDoublon" });
      }
    }
    
    io.to(room).emit("usersInRoom", tchatRoom[room]?.users);
  });
  
  socket.on("updateListUser", ({ username, room }) => {
    io.to(room).emit("usersInRoom", tchatRoom[room]?.users);
  });

  // Ecoute quand un utilisateur se déconnecte
  socket.on("disconnect", () => {
    Object.keys(tchatRoom).forEach((room) => {
      if (tchatRoom[room].users) {
        tchatRoom[room].users = tchatRoom[room].users.filter(
          (user) => user.id !== socket.id
        );

        const disconnectOwner = tchatRoom[room].users.filter(
          (user) => user.owner
        );

        if (tchatRoom[room].users.length === 0) {
          delete tchatRoom[room].users;

          // Vérifier si la room est complètement vide
          if (Object.keys(tchatRoom[room]).length === 0) {
            delete tchatRoom[room];
          }
        } else if (disconnectOwner.length === 0) {
          tchatRoom[room].users[0].owner = true;
          console.log("tchatRoom Switch --", tchatRoom);
        }
      }
      console.log("tchatRoom[room].users", tchatRoom[room]?.users);
      io.to(room).emit("usersInRoom", tchatRoom[room]?.users);
    });
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});