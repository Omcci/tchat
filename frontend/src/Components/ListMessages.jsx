import React, { useEffect, useRef } from "react";

const ListMessages = ({ socket, messages, username }) => {
  console.log("messages", messages);
  const listRef = useRef(null);

  useEffect(() => {
    // Faire défiler la liste vers le bas lors du chargement de la page
    if (listRef.current.lastElementChild) {
      listRef.current.lastElementChild.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ul ref={listRef} style={{ listStyleType: "none", padding: 0, margin: 0 }}>
      {/* {console.log("messages", messages)} */}
      {messages.map((message) => (
        <li key={message.id}>
          <p
            className={
              message.userid === socket.id ? "message_send" : "message_received"
            }
          >
            {message.username} - {message.message} - {message.time}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default ListMessages;
