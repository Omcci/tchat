import React, { useState, useEffect } from "react";

const ListMessages = ({ messages }) => {
  console.log("messages", messages);
  return (
    <ul>
      {/* {console.log("messages", messages)} */}
      {messages.map((message) => (
        <li key={message.id}>
          {message.username} - {message.message} - {message.time}
        </li>
      ))}
    </ul>
  );
};

export default ListMessages;
