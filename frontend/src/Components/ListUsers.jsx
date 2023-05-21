import React, { useState, useEffect } from "react";

const ListUsers = ({ users }) => {
  console.log("users", users);
  return (
    <ul>
      {/* {console.log("users", users)} */}
      {users.map((user) => (
        // <li key={user.id}>{user.username} {user.owner ? "(owner)" : ""}</li>
        <li key={user.id}>
          {user.username} {user.owner ? "👑" : ""}
        </li>
      ))}
    </ul>
  );
};

export default ListUsers;
