import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from './SocketContext';

function Game() {
  const socket = useContext(SocketContext);
  const [room, setRoom] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [players, setPlayers] = useState([]);

  const handleJoinRoom = () => {
    socket.emit('joinRoom', pseudo, room);
  };

  const handleRoomChange = (event) => {
    setRoom(event.target.value);
  };

  const handlePseudoChange = (event) => {
    setPseudo(event.target.value);
  };

  useEffect(() => {
    socket.on('playersUpdate', (data) => {
      setPlayers(data);
    });

    return () => {
      socket.off('playersUpdate');
    };
  }, [socket]);

  useEffect(() => {
    socket.emit('getPlayers');
  }, [socket]);

  return (
    <div>
      <div>
        <input type="text" value={pseudo} onChange={handlePseudoChange} />
        <input type="text" value={room} onChange={handleRoomChange} />
        <button onClick={handleJoinRoom}>Rejoindre une salle</button>
      </div>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{player.username}</li>
        ))}
      </ul>
    </div>
  )
}


export default Game;