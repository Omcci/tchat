import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import env from './env.js';

const ipBackend = `http://${env.ip}:${env.portBackend}/`;

export const SocketContext = React.createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(ipBackend, { transports: ["polling"] });
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

