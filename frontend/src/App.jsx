import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'
import env from './env.js';

var ipBackend = `http://${env.ip}:${env.portBackend}/`;
const socketOpen = io(ipBackend);

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
    // socketOpen.on('joinRoom', username, room);
    socketOpen.emit('joinRoom', username, room);
    socketOpen.emit('roomJoined', console.log());
  }


  const  handleRoomChange = (event) => {
    setRoom(event.target.value);
  }

  const handlePseudoChange = (event) => {
    setPseudo(event.target.value);
  }


  const handleConnect = () => {
    const newSocket = io(ipBackend, { transports: ["polling"] });
    setSocket(newSocket);
    console.log("socket", socket)
  }

   const handleClick = () => {
    console.log("test");
  //   // console.log(socket.emit('getPlayers', setPlayers()))
  //   socket.emit('getPlayers', (data) => {
  //     console.log("data --->", data)
  //     setPlayers(data)
  //   });
  //   // socketOpen.on('getPlayers', (data) => {
  //   //   console.log("data --->", data)
  //   //   setPlayers(data)
  //   // });
  }

  // useEffect(() => {
  //   // // Requête pour récupérer les joueurs de la room
  //   // socketOpen.on('getPlayers', (data) => {
  //   //   console.log('data Open composent', data); 
  //   //   setPlayers(data);
  //   // });

  //   // // Écouteur pour mettre à jour la liste des joueurs lorsqu'elle change
  //   // socketOpen.on('playersUpdate', (data) => {
  //   //   setPlayers(data);
  //   // });

  //   // // Nettoyage du composant lorsqu'il est démonté
  //   // return () => {
  //   //   socketOpen.off('playersUpdate');
  //   // }

  //   socket.on('getPlayers', (players) => {
  //     setPlayers(players);
  //   });

  //   // getPlayers();

  //   // return () => {
  //   //   socket.off('playersUpdate');
  //   // };
  // }, []);

  useEffect(() => {
    // Écouteur pour mettre à jour la liste des joueurs lorsqu'elle change
    socketOpen.on('playersUpdate', (data) => {
      setPlayers(data);
    });
  
    // Nettoyage du composant lorsqu'il est démonté
    return () => {
      socketOpen.off('playersUpdate');
    };
  }, []);
  
  // Envoie une demande pour récupérer les joueurs
  useEffect(() => {
    // socket.emit('getPlayers', (data) => {
    //   console.log('data received from server', data);
    //   setPlayers(data);
    // });
    socketOpen.on('getPlayers', (data) => {
      console.log("data", data);
      setPlayers(data);
    });
  }, [socket]);

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
          <button onClick={handleClick}>liste joueur</button>
          {console.log("backend ---> frontend ", players)}
          {/* {players} */}
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
      {/* Le reste du contenu de votre application */}
    </div>
  )
}

export default App
