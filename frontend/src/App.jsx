// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import env from './env.js';
// import Game from './Games'
// const socket = io(`http://${env.ip}:${env.portBackend}/`);

// function App() {
//   const [playerName, setPlayerName] = useState('');
//   const [players, setPlayers] = useState([]);

//   useEffect(() => {
    // socket.on('connect', () => {
    //   console.log(`Connected to server with socket id: ${socket.id}`);
    // });

//     socket.on('playerJoined', (players) => {
//       setPlayers(players);
//     });

//     socket.on('playerLeft', (players) => {
//       setPlayers(players);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const handleNameChange = (event) => {
//     setPlayerName(event.target.value);
//   };

//   const handleJoinGame = () => {
//     socket.emit('joinGame', playerName);
//   };

//   return (
//     <div>
//       <h1>Multiplayer Game</h1>
//       <div>
//         <input type="text" value={playerName} onChange={handleNameChange} />
//         <button onClick={handleJoinGame}>Join Game</button>
//       </div>
//       <Game/>
//     </div>
//   );
// }

// export default App;

// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import env from './env.js';
// import Game from './Game.jsx';

// function App() {

//   return (
//     <div>
//       <Game/>
//     </div>
//   );
// }


// export default App;




// import React, { useState, useEffect} from "react";
// import io from "socket.io-client";
// import env from './env.js';
// // import Game from './Games'
// const ipBackend = `http://${env.ip}:${env.portBackend}/`;
// const socketOpen = io(ipBackend);

// const App = () => {
//   const [username, setUsername] = useState("");
//   const [room, setRoom] = useState("");

//   const handleConnect = () => {
//     // const newSocket = ENDPOINT
//     socketOpen.emit("join", { username, room });
//     console.log('socketOpen', socketOpen.id);
//   };

//   const handleDisconnect = () => {
//     socketOpen.disconnect();
//   };

//   //   useEffect(() => {
//   //   setSocket(ENDPOINT)
//   //   socket.on('connect', () => {
//   //     console.log(`Connected to server with socket id: ${socket.id}`);
//   //   });

//   //   return () => {
//   //     socket.disconnect();
//   //   };
//   // }, []);

//   return (
//     <div>
//       <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
//       <input type="text" placeholder="Room" value={room} onChange={(e) => setRoom(e.target.value)} />
//       {socketOpen ? (
//         <div>
//           <p>Connecter : {socketOpen.id}</p>
//           <p>Connected to room: {room}</p>
//           <button onClick={handleDisconnect}>Disconnect</button>
//         </div>
//       ) : (
//         <button onClick={handleConnect}>Connect</button>
//       )}
//     </div>
//   );
// };

// export default App;



import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import env from './env.js';
// const ENDPOINT = io(`http://${env.ip}:${env.portBackend}/`);

const ENDPOINT = `http://${env.ip}:${env.portBackend}/`;


const App = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);

  const handleConnect = () => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);
    newSocket.emit("join", { username, room });
  };

  const handleClickNewPseudo = () => {
    if (socket) {
      socket.emit("newUsername", { username, room });
    }
  };

  const handleClickDisconnect = () => {
    // button déconnexion
    socket.disconnect();
    setSocket(null);
  };

  useEffect(() => {
    if (socket) {
      socket.on("usersInRoom", (users) => {
        setUsers(users);
      });
    }
  }, [socket]);

  useEffect(() => {
    const handleUnload = (event) => {
      event.preventDefault();
      if (socket) {
        socket.emit("leave", { username, room });
        socket.disconnect();
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [socket, username, room]);

  return (
    <div>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      {socket ? (
        <div>
          <button onClick={handleClickNewPseudo}>Changer de Pseudo</button>
          <button onClick={handleClickDisconnect}>Déconnexion</button>
          {console.log("sokcet --->", socket)}
          <p>--- {socket.id}</p>
          <p>Connected to room: {room}</p>
          <ul>
            {console.log("users", users)}
            {users.map((user) => (
              <li key={user.id}>{user.username}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <input type="text" placeholder="Room" value={room} onChange={(e) => setRoom(e.target.value)} />
          <button onClick={handleConnect}>Connect</button>
        </div>
      )}
    </div>
  );
};

export default App;

