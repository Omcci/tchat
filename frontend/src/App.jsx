import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import env from './env.js';

const ENDPOINT = `http://${env.ip}:${env.portBackend}/`;

const App = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);

  // Connexion Socket.io + Join Room
  const handleConnect = () => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);
    newSocket.emit("join", { username, room });
  };

  // Function Changer Pseudo
  const handleClickNewPseudo = () => {
    if (socket) {
      socket.emit("newUsername", { username, room });
    }
  };

  // Function Déconnexion Button 
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

    // Vérification si l'tuilisateur force une déconnexion en ferment son navigator
    window.addEventListener("beforeunload", handleUnload);

    // Vérification si l'tuilisateur force une déconnexion en ferment son navigator
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