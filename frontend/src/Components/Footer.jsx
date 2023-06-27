import React, { useState } from "react";
import Timer from "./Timer.jsx";
function Footer({
  typingMessage,
  setTypingMessage,
  username,
  setUsername,
  handleUpdateUsername,
  isAlert,
  alertMessage,
  message,
  setMessage,
  socket,
  setSocket,
  room,
}) {
  const [showMessage, setShowMessage] = useState(false);
  const [messageDupli, setMessageDupli] = useState("");
  const [counter, setCounter] = useState(0);
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    setTypingMessage(e.target.value); // Update the typing message state
  };

  const handleClickNewMessage = () => {
    console.log("message", message);
    if (message !== "" && counter === 0) {
      // Envoyer le message au serveur via l'événement "chatMessage"
      socket.emit("chatMessage", { username, room, message });
      setTypingMessage(""); // Clear the typing message state after sending the message
      // setMessageDupli("");
      // setShowMessage(true);
      setCounter(5);
    }

    // setTimeout(() => {
    //   setShowMessage(false);
    //   setMessageDupli("");
    // }, 3000);
  };

  // Function Déconnexion Button
  const handleClickDisconnect = () => {
    // button déconnexion
    socket.disconnect();
    setSocket(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // console.log("message", message);
      if (message !== "" && counter === 0) {
        handleClickNewMessage();
      }
    }
  };

  return (
    <div className="footer">
      <div className="footer-home">
        <p>Soon</p>
      </div>
      <div className="footer-message">
        <input
          type="text"
          placeholder="Type your message ..."
          value={typingMessage}
          onChange={(e) => handleInputChange(e)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleClickNewMessage}>Send</button>
        {/* {showMessage && <p>{messageDupli}</p>} */}
        {counter != 0 ? <Timer time={counter} setCounter={setCounter} /> : ""}
      </div>
      <div className="footer-param">
        <div className="footer-input">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="buttons-param">
          <button onClick={handleUpdateUsername}>Change Username</button>
          {/* {isAlert ? <p style={{ color: "red" }}>{alertMessage}</p> : ""} */}
          {isAlert && <p style={{ color: "red" }}>{alertMessage}</p>}
          <button onClick={handleClickDisconnect}>Disconnect</button>
        </div>
      </div>
    </div>
  );
}

export default Footer;
