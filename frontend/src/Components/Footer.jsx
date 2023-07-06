import React, { useState } from "react";
import Timer from "./Timer.jsx";
import EmojiPicker from "emoji-picker-react";
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
  setVisibleEmoji,
  visibleEmoji,
  setChosenEmoji,
}) {
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
      setCounter(5);
    }
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

  const handleClickEmoji = () => {
    setVisibleEmoji(!visibleEmoji);
  };

  return (
    <div className="footer">
      <div className="footer-home">
        <p>Soon</p>
      </div>
      <div className="footer-message">
        <div className="button-emoji">
          <div className="emoji"></div>
        </div>
        <input
          type="text"
          placeholder="Type your message ..."
          value={typingMessage}
          onChange={(e) => handleInputChange(e)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleClickNewMessage}>Send</button>
        <button onClick={handleClickEmoji}>Emoji</button>
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
