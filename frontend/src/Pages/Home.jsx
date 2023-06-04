import React, { useState, useEffect } from "react";
import ListUsers from "../Components/ListUsers";
import ListMessages from "../Components/ListMessages";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

const Home = ({ socket, setSocket, username, setUsername, room, setRoom }) => {
  console.log("socket", socket);
  const [users, setUsers] = useState([]);
  const [owner, setOwner] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [message, setMessage] = useState("");
  const [listMessages, setListMessages] = useState([]);
  const [typingMessage, setTypingMessage] = useState(""); // State for storing the typing message
 
  // Function Changer Pseudo
  const handleClickNewPseudo = (callback) => {
    socket.emit("newUsername", { username, room });
    console.log("username -->", username);

    socket.once("newUserExists", (message) => {
      console.log("message", message);
      if (message.message === "errorPseudoDoublon") {
        setAlertMessage("Ce pseudo est déjà utilisé dans la room !");
        setIsAlert(true);
        setTimeout(() => {
          setIsAlert(false);
        }, 5000);
        callback(false); // Appel du callback avec false pour indiquer l'échec

      } else {
        setAlertMessage("");
        setIsAlert(false);
        callback(true); // Appel du callback avec true pour indiquer la réussite
      }
    });
  };

  // Utilisation de la fonction handleClickNewPseudo avec un callback
  const handleUpdateUsername = () => {
    handleClickNewPseudo((success) => {
      console.log("success", success);
      if (success) {
        setAlertMessage("Pseudo modifié");
        setIsAlert(true);
        socket.emit("updateListMessage", { room });
        setTimeout(() => {
          setIsAlert(false);
        }, 5000);
      } else {
        console.log("Le pseudo existe déjà dans la room");
        // Traitez l'échec de la mise à jour de l'username
      }
    });
  };

  useEffect(() => {
    // Load the typing message from localStorage on component mount
    const typingMessageFromStorage = localStorage.getItem("typingMessage");
    if (typingMessageFromStorage) {
      setTypingMessage(typingMessageFromStorage);
    }

    socket.on("usersInRoom", (users) => {
      console.log("users", users);
      const checkOwner = users.filter((user) => user.owner);
      if (checkOwner[0].id === socket.id) {
        setUsers(users);
        setOwner(true);
      } else {
        setUsers(users);
        setOwner(false);
      }
    });

    socket.on("updateListUser", (users) => {
      console.log("users", users);
      const checkOwner = users.filter((user) => user.owner);
      if (checkOwner[0].id === socket.id) {
        setUsers(users);
        setOwner(true);
      } else {
        setUsers(users);
        setOwner(false);
      }
    });

    // Écouter l'événement "chatMessage" pour recevoir les nouveaux messages
    socket.on("chatMessage", ({ messages }) => {
      // Ajouter le nouveau message à la liste des messages existants
      console.log("chatMessage - message", messages);
      setListMessages(messages);
      setMessage("");
    });

    setTimeout(() => {
      console.log("updateListUser");
      socket.emit("updateListUser", { username, room });
      socket.emit("updateListMessage", { room });
    }, 300);
  }, [socket]);

  useEffect(() => {
    const handleUnload = (event) => {
      event.preventDefault();
      if (socket) {
        socket.emit("leave", { username, room });
        socket.disconnect();
      }
    };

    // Save the typing message to localStorage when it changes
    localStorage.setItem("typingMessage", typingMessage);

    // Vérification si l'tuilisateur force une déconnexion en fermant son navigateur
    window.addEventListener("beforeunload", handleUnload);

    // Vérification si l'utilisateur force une déconnexion en fermant son navigateur
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [socket, username, room, typingMessage]);

  useEffect(() => {
    localStorage.setItem("dataSocket", socket.id);
  }, []);

  return (
    <div>
      {console.log("sokcet --->", socket)}
      {/* <p>Votre ID : {socket.id}</p> */}
      <Header room={room} owner={owner} />
      
      <div className="home">
        <div className="home-room">
          {/* <ListMessages socket={socket} messages={messages} />
           */}
          <p>List room</p>
        </div>
        <div className="home-tchat">
          <ListMessages
            socket={socket}
            messages={listMessages}
            username={username}
          />
        </div>
        <div className="home-listplayer">
          <ListUsers users={users} />
        </div>
      </div>
     <Footer 
      typingMessage={typingMessage} 
      setTypingMessage={setTypingMessage} 
      username={username} 
      setUsername={setUsername} 
      message={message}
      setMessage={setMessage}
      handleUpdateUsername={handleUpdateUsername} 
      isAlert={isAlert}
      alertMessage={alertMessage}
      socket={socket} 
      setSocket={setSocket}
      room={room}
      />
      
    </div>
  );
};

export default Home;
