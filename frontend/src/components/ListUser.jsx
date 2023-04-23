
import React, {useState, useEffect} from 'react';

function ListUser(props) {
  console.log('props', props)
  const { users } = props;
  console.log("localStorage.getItem('playerList')", localStorage.getItem('playerList'))
  useEffect(() => {
    socketOpen.on('playersUpdate', (data) => {
      console.log("---> use", data)
      // setPlayers(data);
      localStorage.setItem("playerList", JSON.stringify(data));
    });


    return () => {
      socketOpen.off('playersUpdate');
    };
  }, []);

  return (
    <div>
      <h2>Liste des utilisateurs :</h2>
      <ul>
        {localStorage.getItem('playerList').map((user, index) => (
           <li key={user.id}>{user.id} - {user.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default ListUser;

// import React , {useState, useEffect} from 'react'
// import io from 'socket.io-client';
// import env from '../env.js';

// const ipBackend = `http://${env.ip}:${env.portBackend}/`;
// const socketOpen = io(ipBackend);

// function ListUser() {
//   const [players, setPlayers] = useState(false);

//   useEffect(() => {

//     // const handleBeforeUnload = () => {
//     //   socket.emit('disconnect');
//     // }
  
//     // window.addEventListener('beforeunload', handleBeforeUnload);

//     socketOpen.on('playersUpdate', (data) => {
//       console.log("---> use", data)
//       setPlayers(data);
//     });
  
//     // socketOpen.on('getPlayers', (data) => {
//     //   setPlayers(data);
//     // });

//     // socketOpen.emit('getPlayers', room, (data) => {
//     //   console.log("data", data);
//     //   setPlayers(data);
//     // });
  
//     // socketOpen.on("roomLeft", (data) => {
//     //   console.log("data roomleft",data)
//     //   setPLayers(data);
//     // });
//     // Écoute de l'événement "playerDisconnect" pour la mise à jour de la liste des joueurs dans la salle
//     // socketOpen.on('playerDisconnect', (data) => {
//     //   setPlayers(players => players.filter(player => player.id !== data.id));
//     // });

//     // if (checkCo) {
//     //   socketOpen.on('playerLeft', (data) => {
//     //     setPlayers(data);
//     //   })
//     // }


//     return () => {
//       socketOpen.off('playersUpdate');
//       // socketOpen.off('playerDisconnect');
//       // socketOpen.off('playerLeft');
//     };
//   }, []);

//   return (
//     <div>
//     {players && players.length > 0 ?
//       <div>
//         {console.log("backend ---> frontend ", players)}
//         <ul>
//           {players.map((player) => (
//             // console.log("player")
//             <li key={player.id}>{player.id} - {player.username}</li>
//           ))}
//         </ul>
//       </div>
//     :
//     "No players"
//     }
//     </div>
//   )
// }

// export default ListUser;
