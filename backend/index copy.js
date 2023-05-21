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

  // l'événement "join" qui est émis lorsque qu'un utilisateur rejoint une room.
  socket.on("join", ({ username, room }) => {

    socket.join(room);

    console.log("Debut join : tchatRoom[room]", tchatRoom[room]);

    // Si ce n'est pas le cas, il est créé en tant que tableau vide.
    if (!tchatRoom[room] || tchatRoom[room] == undefined) {
      tchatRoom[room] = { users : [] };
    }

    // Vérifier si le pseudo existe déjà dans la room
    const userExists = tchatRoom[room]?.users?.filter(
      (user) => user.username === username
    );

    console.log("userExists", userExists);
    
    // Le pseudo existe déjà, renvoyer une erreur ou une notification appropriée
    if (userExists && userExists.length > 0) {
      socket.emit("userExists", "errorPseudoDoublon");
      console.log("Ce pseudo est déjà utilisé dans la room")
      return;
    }
    
    // Ajout de owner quand il créer la room
    if (!tchatRoom[room].users || tchatRoom[room].users.length === 0) {
      tchatRoom[room].users = [{ id: socket.id, username, owner: true }];
    } else {
      tchatRoom[room].users.push({ id: socket.id, username, owner: false });
    }

    const owner = tchatRoom[room].users.filter((user) => user.owner);
    io.to(room).emit("searchOwner", owner);

    // Et on r'envoie dans le frontend
    socket.emit("userExists", "");
    io.to(room).emit("usersInRoom", tchatRoom[room].users);
    console.log("tchatRoom", tchatRoom)
    console.log("tchatRoom[room]", tchatRoom[room])
    console.log("tchatRoom[room].users", tchatRoom[room].users)
  });

   // l'événement "join" qui est émis lorsque qu'un utilisateur change son pseudo.
  socket.on("newUsername", ({ username , room}) => {
    console.log("username", username);

    if (tchatRoom[room]) {
      
      // créer un nouveau tableau en itérant sur chaque élément du tableau tchatRoom[room]
      tchatRoom[room].users = tchatRoom[room].users.map((user) =>
        user.id === socket.id ? { ...user, username } : user
      );

      // Réponse au front 
      io.to(room).emit("usersInRoom", tchatRoom[room].users);
    
    }

    console.log(tchatRoom[room]);
    console.log("tchatRoom[room]", tchatRoom[room])
  });

  // Ecoute dans un utilisateur ce déconnecte
  socket.on("disconnect", () => {

    Object.keys(tchatRoom).forEach((room) => {
      // if (tchatRoom[room].users) {
      //   tchatRoom[room].users = tchatRoom[room].users.filter(
      //     (user) => user.id !== socket.id
      //   );

      //   const disconnectOwner = tchatRoom[room].users.filter(
      //     (user) => user.owner
      //   );

      //   if (tchatRoom[room].users.length === 0) {
      //     delete tchatRoom[room].users;

      //     // Vérifier si la room est complètement vide
      //     if (Object.keys(tchatRoom[room]).length === 0) {
      //       delete tchatRoom[room];
      //     }

      //   } else if (disconnectOwner.length === 0) {
      //     tchatRoom[room].users[0].owner = true;
      //     console.log("tchatRoom Switch --", tchatRoom);
      //   }
      // }
      // console.log("tchatRoom[room]", tchatRoom[room]?.users);
      // io.to(room).emit("usersInRoom", tchatRoom[room]?.users);
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
      console.log("tchatRoom[room]", tchatRoom[room]?.users);
      io.to(room).emit("usersInRoom", tchatRoom[room]?.users);
    });
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});