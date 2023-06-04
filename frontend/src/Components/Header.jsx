import React from 'react'

function Header({room, owner}) {
  return (
    <div className="home-header">
      <p>Connected to tchat : {room}</p>
      <p>{owner ? "Tchat King" : "Tchat Guest"}</p>
      </div>
  )
}

export default Header