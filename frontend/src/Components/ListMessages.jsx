import React, { useState, useEffect } from "react";

const ListMessages = ({ socket, messages }) => {
  console.log("messages", messages);
  // console.log("socket", socket.id);
  return (
    <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
      {/* {console.log("messages", messages)} */}
      {messages.map((message) => (
        <li key={message.id}>
          <p
            style={{
              color: message.userid === socket.id ? "blanc" : "blanc",
              fontWeight: message.userid === socket.id ? "bold" : "normal",
              marginLeft: message.userid === socket.id ? "85vh" : "3vh",
              backgroundColor: message.userid === socket.id ? "blue" : "gray",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
              maxWidth: "30%",
              wordWrap: "break-word",
            }}
          >
            {message.username} - {message.message} - {message.time}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default ListMessages;
