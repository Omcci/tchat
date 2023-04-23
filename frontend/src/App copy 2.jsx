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
import ListUser from './components/ListUser';


const ipBackend = `http://${env.ip}:${env.portBackend}/`;
const socketOpen = io(ipBackend);

function App() {
  const [room, setRoom] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [players, setPlayers] = useState(false);
  const [idUser, setIdUser] = useState(false);

  // setIdUser(localStorage.setItem("userID", socketOpen.id));
  const handleJoinRoom = (username, room) => {
    // socketOpen.emit('joinRoom', username, room);
    // socketOpen.emit('joinRoom', username, room, () => {
    //   socketOpen.emit('getPlayers', (data) => {
    //     console.log("data", data);
    //     setPlayers(data);
    //   });
    // });
    // socketOpen.emit('roomJoined', console.log());


    // socketOpen.emit('joinRoom', username, room, () => {
    //   socketOpen.emit('getPlayers', (data) => {
    //     console.log("data", data);
    //     setPlayers([]);
    //     setPlayers(data);
    //   });
    // });
    console.warn("username", username);
    console.warn("room", room);
    if (username !== "" || room !== "") {
      socketOpen.emit('joinRoom', username, room);
      socketOpen.emit('roomJoined', console.log());
      // socketOpen.emit('getPlayers', (data) => {
      //   console.log("data", data);
      //   setPlayers(data);
      // });
      socketOpen.emit('getPlayers', room, (data) => {
        console.log("data", data);
        // setPlayers(data);
        localStorage.setItem("playerList", JSON.stringify(data));
      });
    } else {
      console.error("test");
    }
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
    // if (pseudo === "" && room === "") {
    //   handleJoinRoom(pseudo, room);
    // }
  }

  const handleClickRefresh = () => {
    socketOpen.emit('getPlayers', (data) => {
      console.log("data", data);
      // setPlayers(data);
      localStorage.setItem("playerList", JSON.stringify(data));
    });
  }

  useEffect(() => {

    const handleBeforeUnload = () => {
      socket.emit('disconnect');
    }
  
    window.addEventListener('beforeunload', handleBeforeUnload);

    socketOpen.on('playersUpdate', (data) => {
      console.log("---> use", data)
      // setPlayers(data);
      localStorage.setItem("playerList", JSON.stringify(data));
    });
  
    // socketOpen.on('getPlayers', (data) => {
    //   setPlayers(data);
    // });

    socketOpen.emit('getPlayers', room, (data) => {
      console.log("data", data);
      // setPlayers(data);
      localStorage.setItem("playerList", JSON.stringify(data));
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
      window.removeEventListener('beforeunload', handleBeforeUnload);
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
          <button onClick={handleClickRefresh}>liste joueur</button>
          {console.log("backend ---> frontend ", players)}
          {/* {localStorage.getItem('playerList').map((user, index) => (
              <li key={user.id}>{user.id} - {user.username}</li>
            ))} */}
            {/* <ListUser users={players}/> */}
        </>
      )}
    </div>
  )
}

export default App
