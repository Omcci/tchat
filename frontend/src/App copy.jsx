// import React from 'react';
// import { SocketProvider } from './SocketContext.jsx';
// import Game from './Game.jsx';

// function App() {
//   return (
//     <SocketProvider>
//       <Game />
//     </SocketProvider>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'
import env from './env.js';

const ipBackend = `http://${env.ip}:${env.portBackend}/`;
const socketOpen = io(ipBackend);

function App() {
  const [room, setRoom] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [players, setPlayers] = useState(false);

  const handleJoinRoom = (username, room) => {
    // socketOpen.emit('joinRoom', username, room);
    // socketOpen.emit('joinRoom', username, room, () => {
    //   socketOpen.emit('getPlayers', (data) => {
    //     console.log("data", data);
    //     setPlayers(data);
    //   });
    // });
    // socketOpen.emit('roomJoined', console.log());
    socketOpen.emit('joinRoom', username, room, () => {
      socketOpen.emit('getPlayers', (data) => {
        console.log("data", data);
        setPlayers(data);
      });
    });
    socketOpen.emit('roomJoined', console.log());
    socketOpen.emit('getPlayers', (data) => {
      console.log("data", data);
      setPlayers(data);
    });
  }

  const handleRoomChange = (event) => {
    setRoom(event.target.value);
  }                                   

  const handlePseudoChange = (event) => {
    setPseudo(event.target.value);
  }
  
  const handleConnect = () => {
    console.log("socketOpen", socketOpen)
  }
  
  const handleClick = () => {
    // socketOpen.emit('getPlayers', (data) => {
    //   console.log("data", data);
    //   setPlayers(data);
    // });
    // console.log("")
    if (pseudo === "" && room === "") {
      handleJoinRoom(pseudo, room);
    }
  }

  useEffect(() => {
    socketOpen.on('playersUpdate', (data) => {
      console.log("---> use", data)
      setPlayers([]);
      setPlayers(data);
    });
  
    socketOpen.on('getPlayers', (data) => {
      setPlayers([]);
      setPlayers(data);
    });
  
    socketOpen.on("roomLeft", (data) => {
      console.log("data roomleft",data)
      setPlayers([]);
      setPLayers(data);
    });
    // Écoute de l'événement "playerDisconnect" pour la mise à jour de la liste des joueurs dans la salle
    // socketOpen.on('playerDisconnect', (data) => {
    //   setPlayers(players => players.filter(player => player.id !== data.id));
    // });

    // if (checkCo) {
    //   socketOpen.on('playerLeft', (data) => {
    //     setPlayers(data);
    //   })
    // }


    return () => {
      socketOpen.off('playersUpdate');
      socketOpen.off('getPlayers');
      socketOpen.off('roomLeft');
      // socketOpen.off('playerDisconnect');
      // socketOpen.off('playerLeft');
    };
  }, []);
  
  // useEffect(() => {
  //   socketOpen.on('getPlayers', (data) => {
  //     console.log("data", data);
  //     setPlayers(data);
  //   });
  // }, []);
  // useEffect(() => {
  //   socketOpen.on('playersUpdate', (data) => {
  //     setPlayers(data);
  //   });
  
  //   return () => {
  //     socketOpen.off('playersUpdate');
  //   };
  // }, []);

  return (
    <div className="App">
      <h1>Application multi-joueur</h1>
      <button onClick={handleConnect}>Connecter au serveur Socket.io</button>
      {socketOpen && (
        <>
          <p>Connecté au serveur Socket.io avec l'ID : {socketOpen.id}</p>
          <div>
            <p>Votre Pseudo :</p>
            <input type="text" value={pseudo} onChange={handlePseudoChange} />
          </div>
          <div>
            <input type="text" value={room} onChange={handleRoomChange} />
            <button onClick={() => handleJoinRoom(pseudo , room)}>Rejoindre une salle</button>
          </div>
          <button onClick={handleClick}>liste joueur</button>
          {console.log("backend ---> frontend ", players)}
          {players && players.length > 0 ?
            <div>
              {console.log("backend ---> frontend ", players)}
              <ul>
                {players.map((player) => (
                  <li key={player.id}>{player.username}</li>
                ))}
              </ul>
            </div>
          :
          "No players"
          }
        </>
      )}
    </div>
  )
}

export default App
