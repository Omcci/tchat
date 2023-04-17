import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'
import env from './env.js';

var ipBackend = `http://${env.ip}:${env.portBackend}/`;

function App() {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [players, setPlayers] = useState(false);

  // useEffect(() => {
    // console.log('environement', environement)
  //   const newSocket = io(ipBackend, { transports: ["polling"] });
  //   setSocket(newSocket);

  //   return () => newSocket.close();
  // }, []);

  // function handleJoinRoom() {
  //   socket.emit('joinRoom', room);
  // }

  const handleJoinRoom = (username, room) => {
    socket.emit('joinRoom', username, room);
    socket.emit('roomJoined', console.log());
  }


  function handleRoomChange(event) {
    setRoom(event.target.value);
  }

  function handlePseudoChange(event) {
    setPseudo(event.target.value);
  }


  function handleConnect() {
    const newSocket = io(ipBackend, { transports: ["polling"] });
    setSocket(newSocket);
    console.log("socket", socket)
  }

  function handleListPlayer () {
    console.log(socket.emit('getPlayers', setPlayers()))
    socket.emit('getPlayers', console.log());
  }

  return (
    <div className="App">
      <h1>Application multi-joueur</h1>
      {!socket ? (
        <button onClick={handleConnect}>Connecter au serveur Socket.io</button>
      ) : (
        <>
          <p>Connecté au serveur Socket.io avec l'ID : {socket.id}</p>
          <div>
            <p>Votre Pseudo :</p>
            <input type="text" value={pseudo} onChange={handlePseudoChange} />
          </div>
          <div>
          <input type="text" value={room} onChange={handleRoomChange} />
            <button onClick={() => handleJoinRoom(pseudo , room)}>Rejoindre une salle</button>
          </div>
          {/* {console.log(socket)} */}
          <button onClick={() => handleListPlayer()}>liste joueur</button>
          {players ?
            <div>
              {console.log("backend ---> frontend ", players)}
              <p>        
                - {players}
              </p>
            </div>
          :
          ""
          }
        </>
      )}
      {/* Le reste du contenu de votre application */}
    </div>
  )
}

export default App
