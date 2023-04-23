import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import env from './env.js';

const socket = io(`http://${env.ip}:${env.portBackend}/`);

function Game() {
  const [users, setUsers] = useState([]);

  
  useEffect(() => {
    function getUsersInRoom(room) {
      console.log("room", room)
      const users = [];
      if (room !== undefined) {
        const socketsInRoom = io.sockets.adapter.rooms.get(room);
        if (socketsInRoom) {
          socketsInRoom.forEach(socketId => {
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
              users.push({ id: socket.id, username: socket.username });
            }
          });
        }
      }
      return users;
    }
    // Get initial users in the room
    const initialUsers = getUsersInRoom(socket.currentRoom);
    console.warn("--->", initialUsers);
    setUsers(initialUsers);

    // Listen for changes to the list of users in the room
    socket.on('usersInRoom', (users) => {
      setUsers(users);
    });
  }, []);

  return (
    <div>
      <h2>Users in Room</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default Game;