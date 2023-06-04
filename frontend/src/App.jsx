import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Home from "./Pages/Home.jsx";
import './index.scss'
import './App.scss'
import './Components/ListMessages.scss'
import './Pages/Home.scss'
import './Components/Footer.scss'
import './Components/Header.scss'


const ENDPOINT = `http://${import.meta.env.VITE_IP_BACKEND}:${
  import.meta.env.VITE_PORT_BACKEND
}/`;

const App = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleConnect = async () => {
    const newSocket = io(ENDPOINT, {
      query: {
        token: "", // incluez le JWT dans les paramètres de connexion
      },
    });
    const newSocketRef = { current: newSocket }; // Variable de référence pour conserver la référence au socket

    newSocket.emit("join", { username, room });

    try {
      await new Promise((resolve, reject) => {
        console.log("try");
        console.log("newSocketRef", newSocketRef);
        console.log("resolve", resolve);
        newSocketRef.current.on("userExists", (message) => {
          console.log("message", message);
          if (message === "errorPseudoDoublon") {
            setAlertMessage("Ce pseudo est déjà utilisé dans la room !");
            setIsAlert(true);
            newSocketRef.current.disconnect();
            reject();
          } else {
            setAlertMessage("");
            setIsAlert(false);
            resolve();
          }
        });
      });

      setSocket(newSocketRef.current); // Met à jour le socket seulement si la connexion est réussie
    } catch (error) {
      console.log("error", error);
      // Catch the error if the socket was disconnected
      return;
    }
  };

  useEffect(() => {
    console.log("socket", socket);
  }, [socket]);

  return (
    <div>
      {socket ? (
        <Home
          socket={socket}
          setSocket={setSocket}
          username={username}
          setUsername={setUsername}
          room={room}
          setRoom={setRoom}
        />
      ) : (
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {/* <input
            type="text"
            placeholder="Room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          /> */}
          <button onClick={handleConnect}>Connect</button>
          {isAlert ? <p style={{ color: "red" }}>{alertMessage}</p> : ""}
        </div>
      )}
    </div>
  );
};

export default App;
