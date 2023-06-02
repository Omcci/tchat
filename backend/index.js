require("dotenv").config();

const app = require('express')();
const http = require('http').createServer(app);
// const jwt = require('jsonwebtoken');
var jwtAuth = require('socketio-jwt-auth');
const { SERVER_PORT, IP, PORT_FRONT, KEY_JWT } = process.env;

console.log("PORT", SERVER_PORT)

var io = require('socket.io')(http, {
  query: {
    token: KEY_JWT
  },
  cors: {
    origin: `http://${IP}:${PORT_FRONT}`,
    methods: ["GET", "POST"],
}});

http.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}`);
});

const tchatRoom = {};
const mpRoom = {};

console.log("tchatRoom", tchatRoom)
console.log("mpRoom", mpRoom);

// using middleware
// io.use(jwtAuth.authenticate({
//   secret: KEY_JWT,    // required, used to verify the token's signature
//   algorithm: 'HS256',        // optional, default to be HS256
//   succeedWithoutToken: true
// }, function(payload, done) {
//   // you done callback will not include any payload data now
//   console.log("playload", payload)
//   // if no token was supplied
//   if (payload && payload.sub) {
//     User.findOne({id: payload.sub}, function(err, user) {
//       if (err) {
//         // return error
//         return done(err);
//       }
//       if (!user) {
//         // return fail with an error message
//         return done(null, false, 'user does not exist');
//       }
//       // return success with a user info
//       return done(null, user);
//     });
//   } else {
//     return done() // in your connection handler user.logged_in will be false
//   }
// }));

// io.use((socket, next) => {
//   // console.log("socket --->", socket)
//   console.log("socket.handshake", socket.handshake.query)
//   const token = socket.handshake.query.t; // Récupérer le jeton JWT du client

//   console.log("token", token)
//   if (token) {
//     jwt.verify(token, KEY_JWT, (err, decoded) => {
//       if (err) {
//         return next(new Error('Authentication error'));
//       }

//       // Ajouter les informations d'authentification à l'objet socket pour une utilisation ultérieure
//       socket.auth = {
//         userId: decoded.userId,
//         username: decoded.username
//       };

//       next();
//     });
//   } else {
//     console.log("error token")
//     next(new Error('Authentication error'));
//   }
// });

// Server side
io.use((socket, next) => {
  const token = socket.handshake.query.token; // Récupérer le jeton JWT du client lors de la connexion

  console.log("token --->", token)
  if (token) {
    // Faites quelque chose avec le jeton JWT, par exemple, vérifiez sa validité ou extrayez des informations
    // Vous pouvez utiliser une bibliothèque JWT pour cela, comme `jsonwebtoken`

    // Exemple avec `jsonwebtoken`
    const jwt = require("jsonwebtoken");

    try {
      const decoded = jwt.verify(token, KEY_JWT); // Vérifier et décoder le jeton JWT
      console.log(decoded); // Afficher les informations extraites du jeton, par exemple, l'ID de l'utilisateur

      // Vous pouvez maintenant utiliser les informations du jeton comme vous le souhaitez
      // Par exemple, vous pouvez associer l'utilisateur au socket ou effectuer d'autres opérations d'authentification
    } catch (error) {
      console.log("Invalid token:", error);
      // Traitez l'erreur si le jeton n'est pas valide
    }
  } else {
    console.log("No token provided");
    // Traitez le cas où aucun jeton n'est fourni
  }

  next();
});


io.on("connection", (socket) => {

  console.log("socket.handshake.query", socket.handshake.query)
  // const token = socket.request.user.token; // Récupérer le jeton JWT du client connecté
  // console.log("'token :", token)
  // L'événement "join" qui est émis lorsque qu'un utilisateur rejoint une room.
  socket.on("join", ({ username, room }) => {
    // console.log("Votre Token de connexion :", (socket.request.user.token))
    socket.join(room);

    console.log("Debut join : tchatRoom[room]", tchatRoom[room]);

    // Si ce n'est pas le cas, il est créé en tant que tableau vide.
    if (!tchatRoom[room] || tchatRoom[room] === undefined) {
      tchatRoom[room] = { users: [], messages : [] };
    }

    // Vérifier si le pseudo existe déjà dans la room
    const userExists = tchatRoom[room]?.users?.find((user) => user.username === username);

    console.log("userExists", userExists);

    // Le pseudo existe déjà, renvoyer une erreur ou une notification appropriée
    if (userExists) {
      socket.emit("userExists", "errorPseudoDoublon");
      console.log("Ce pseudo est déjà utilisé dans la room");
      return;
    }

    // Ajout de owner quand il crée la room
    if (!tchatRoom[room].users || tchatRoom[room].users.length === 0) {
      tchatRoom[room].users = [{ id: socket.id, username, owner: true, token: socket.handshake.query.t }];
    } else {
      tchatRoom[room].users.push({ id: socket.id, username, owner: false, token: socket.handshake.query.t });
    }

    const owner = tchatRoom[room].users.filter((user) => user.owner);
    io.to(room).emit("searchOwner", owner);
    socket.emit("userExists", "ok");

    socket.emit("usersInRoom", tchatRoom[room].users);

    // Envoyer la liste des utilisateurs connectés dans la room à tous les autres utilisateurs déjà présents
    socket.to(room).emit("usersInRoom", tchatRoom[room].users);

    // Vérifiez si la salle de discussion contient des messages
    if (tchatRoom[room].messages && tchatRoom[room].messages.length > 0) {
      // Envoyer les messages existants à l'utilisateur qui rejoint
      socket.emit("existingMessages", tchatRoom[room].messages);
    }

    console.log("tchatRoom", tchatRoom);
    console.log("tchatRoom[room]", tchatRoom[room]);
    console.log("tchatRoom[room].users", tchatRoom[room].users);
  });

  // L'événement "chatMessage" est émis lorsque qu'un utilisateur envoie un message dans une salle de discussion.
  socket.on("chatMessage", ({ username, room, message }) => {
    if (!tchatRoom[room].messages || tchatRoom[room].messages === undefined) {
      tchatRoom[room].messages = [];
    }

    const searchUsername = tchatRoom[room].users.filter((user) => user.id === socket.id);
    // console.log("searchUsername", searchUsername[0].username);

    tchatRoom[room].messages.push({
      id: tchatRoom[room].messages.length+1,
      userid: socket.id,
      username : searchUsername[0].username,
      message: message,
      time: new Date().toLocaleTimeString() // Ajoutez l'heure actuelle au message
    });

    console.log("tchatRoom[room]", tchatRoom[room]);
    // Envoyer le message à tous les utilisateurs dans la salle de discussion
    io.to(room).emit("chatMessage", { messages : tchatRoom[room].messages});
  });

  socket.on("newUsername", ({ username, room }) => {
    console.log("newUsername")
    console.log("username --->", username);
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
          
          if (tchatRoom[room].messages) {
            tchatRoom[room].messages = tchatRoom[room].messages.map((user) =>
            (user.userid === socket.id) ? { ...user, username } : user
            );
          }

          socket.emit("newUserExists", { success: true }); // Envoyer la confirmation de succès
          console.log("tchatRoom[room].users", tchatRoom[room].users)
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

  socket.on("updateListMessage", ({ room }) => {
    console.log("updateListMessage --->", room);
    console.log("tchatRoom[room]?.messages", tchatRoom[room].messages)
    io.to(room).emit("chatMessage", { messages : tchatRoom[room].messages});
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