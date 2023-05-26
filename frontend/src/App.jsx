import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import env from "./env.js";
import Home from "./Pages/Home.jsx";

const ENDPOINT = `http://${env.ip}:${env.portBackend}/`;

const App = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleConnect = () => {
    const serializedSocket = localStorage.getItem("dataSocket");
    let newSocket;

    if (!serializedSocket) {
      newSocket = io(ENDPOINT);
      console.log("newSocket", newSocket);
      console.log("newSocket.id", newSocket.id);

      localStorage.setItem("dataSocket", JSON.stringify(newSocket));
      newSocket.emit("join", { username, room });
    } else {
      console.log("serializedSocket", serializedSocket);
      // newSocket = JSON.parse(serializedSocket);
      newSocket = serializedSocket;

      const test = JSON.stringify(serializedSocket);
      console.log("retrievedSocket", test);

      newSocket.on("connect", () => {
        console.log("Socket reconnected successfully!");
        newSocket.emit("join", { username, room });
      });
    }

    newSocket.on("userExists", (message) => {
      console.log("message", message);
      if (message === "errorPseudoDoublon") {
        setAlertMessage("Ce pseudo est déjà utilisé dans la room !");
        setIsAlert(true);
        newSocket.disconnect();
      } else {
        setAlertMessage("");
        setIsAlert(false);
        setSocket(newSocket);
      }
    });
  };

  // const handleConnect = () => {
  //   const dataSocket = localStorage.getItem("dataSocket");

  //   if (!dataSocket) {
  //     const newSocket = io(ENDPOINT);
  //     newSocket.emit("join", { username, room });

  //     newSocket.on("userExists", (message) => {
  //       console.log("message", message);
  //       if (message === "errorPseudoDoublon") {
  //         setAlertMessage("Ce pseudo est déjà utilisé dans la room !");
  //         setIsAlert(true);
  //         newSocket.disconnect();
  //       } else {
  //         setAlertMessage("");
  //         setIsAlert(false);
  //         setSocket(newSocket);
  //       }
  //     });
  //   } else {
  //     // const socketId = localStorage.getItem("dataSocket");
  //     // console.log("socketId Récupération --> ", socketId);
  //     // const savedSocket = io(ENDPOINT, { query: `socketId=${socketId}` });
  //     // console.log("savedSocket", savedSocket);
  //     // savedSocket.emit("join", { username, room });
  //     // savedSocket.on("userExists", (message) => {
  //     //   console.log("message", message);
  //     //   if (message === "errorPseudoDoublon") {
  //     //     setAlertMessage("Ce pseudo est déjà utilisé dans la room !");
  //     //     setIsAlert(true);
  //     //     savedSocket.disconnect();
  //     //   } else {
  //     //     setAlertMessage("");
  //     //     setIsAlert(false);
  //     //     setSocket(savedSocket);
  //     //   }
  //     // });
  //     const socketId = localStorage.getItem("dataSocket");
  //     console.log("socketId Récupération --> ", socketId);

  //     if (socketId) {
  //       const savedSocket = io(ENDPOINT, { query: `socketId=${socketId}` });
  //       console.log("savedSocket", savedSocket);

  //       savedSocket.on("connect", () => {
  //         console.log("Socket reconnecté avec succès !");
  //         savedSocket.emit("join", { username, room });
  //       });

  //       savedSocket.on("userExists", (message) => {
  //         console.log("message", message);
  //         if (message === "errorPseudoDoublon") {
  //           setAlertMessage("Ce pseudo est déjà utilisé dans la room !");
  //           setIsAlert(true);
  //           savedSocket.disconnect();
  //         } else {
  //           setAlertMessage("");
  //           setIsAlert(false);
  //           setSocket(savedSocket);
  //         }
  //       });
  //     }
  //   }
  // };

  // const handleConnect = () => {
  //   const dataSocket = localStorage.getItem("dataSocket");

  //   if (!dataSocket) {
  //     const newSocket = io(ENDPOINT);
  //     console.log("newSocket", newSocket);
  //     console.log("newSocket.id", newSocket.id);
  //     localStorage.setItem("dataSocketId", newSocket.id);
  //     newSocket.emit("join", { username, room });

  //     newSocket.on("userExists", (message) => {
  //       console.log("message", message);
  //       if (message === "errorPseudoDoublon") {
  //         setAlertMessage("Ce pseudo est déjà utilisé dans la room !");
  //         setIsAlert(true);
  //         newSocket.disconnect();
  //       } else {
  //         setAlertMessage("");
  //         setIsAlert(false);
  //         setSocket(newSocket);
  //       }
  //     });
  //   } else {
  //     const socketId = localStorage.getItem("dataSocketId");
  //     const savedSocket = io(ENDPOINT, { query: `socketId=${socketId}` });
  //     console.log("savedSocket", savedSocket);
  //     savedSocket.emit("join", { username, room });

  //     savedSocket.on("userExists", (message) => {
  //       console.log("message", message);
  //       if (message === "errorPseudoDoublon") {
  //         setAlertMessage("Ce pseudo est déjà utilisé dans la room !");
  //         setIsAlert(true);
  //         savedSocket.disconnect();
  //       } else {
  //         setAlertMessage("");
  //         setIsAlert(false);
  //         setSocket(savedSocket);
  //       }
  //     });
  //   }
  // };

  useEffect(() => {
    console.log("socket", socket);
    // if (socket) {
    //   localStorage.setItem("dataSocketId", socket.id);
    // }
  }, [socket]);

  useEffect(() => {
    // console.log("socket", socket);
    // if (socket) {
    //   localStorage.setItem("dataSocketId", socket.id);
    // }
    // localStorage.removeItem("dataSocket");
  }, []);

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
          <button onClick={handleConnect}>Connect</button>
          {isAlert ? <p style={{ color: "red" }}>{alertMessage}</p> : ""}
        </div>
      )}
    </div>
  );
};

export default App;
