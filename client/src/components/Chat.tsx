import * as React from 'react';

import PropTypes from 'prop-types';

const Chat = props => {
  const {
    username,
    updateInput,
    users,
    addUser,
    currentUser,
    userInput,
    messages,
    sendMessage,
    joinableRooms,
    clickRoom,
    currentRoomName,
    addRoom,
    newRoomName,
    addUserToRoom,
    invitedPerson,
  } = props;

  return (
    <div className="App">
      <aside className="sidebar">
        {!currentUser ? (
          <section className="join-chat">
            <h3>Join Chat</h3>
            <form onSubmit={addUser}>
              <input
                placeholder="Enter your username"
                type="text"
                name="username"
                value={username}
                onChange={updateInput}
              />
            </form>
          </section>
        ) : null}

        <section className="online-members">
          <h3>Room Users</h3>
          <ul className="user-list">
            {users.map((user, index) => (
              <li key={`${user}-${index}`}>
                <span className={`presence ${user.presence.state}`} />
                <span>{user.name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className='online-members'>
            <h3>Room List</h3>
            <ul className="user-list">
              {joinableRooms.map((room, index) => (
                <li key={`${room.id}-${index}`}>
                  <button onClick={()=> clickRoom(room.id)}>#{room.name}</button>
                </li>
              ))}
            </ul>
        </section>
        
        <section className='online-members'>
            <h3>Add Another Room</h3>
            <form className="message-form" onSubmit={addRoom}>
            <input
              placeholder="Enter Room Name"
              type="text"
              value={newRoomName}
              name="newRoomName"
              onChange={updateInput}
            />
            <button type="submit">Create</button>
          </form>
        </section>

        <section className='online-members'>
            <h3>Add User To Room</h3>
            <form className="message-form" onSubmit={addUserToRoom}>
            <input
              placeholder="Enter User's Name"
              type="text"
              value={invitedPerson}
              name="invitedPerson"
              onChange={updateInput}
            />
            <button type="submit">Invite</button>
          </form>
        </section>
      </aside>

      <main className="chat-window">
        <header className="chat-header">
          <h3>{currentRoomName}</h3>
          <span className="participants" />
        </header>
        <section className="chat-session">
          <ul className="message-list">
            {messages.map((message, index) => (
              <li key={index} className="user-message">
                <span className="user-id">{message.senderId}</span>
                <span>{message.text}</span>
              </li>
            ))}
          </ul>
        </section>
        <footer className="chat-footer">
          <form className="message-form" onSubmit={sendMessage}>
            <input
              placeholder="Type a message. Hit Enter to send"
              type="text"
              value={userInput}
              name="userInput"
              onChange={updateInput}
            />
            <button type="submit">Send</button>
          </form>
        </footer>
      </main>
    </div>
  );
};

Chat.propTypes = {
  username: PropTypes.string.isRequired,
  updateInput: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  addUser: PropTypes.func.isRequired,
  userInput: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  sendMessage: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  joinableRooms: PropTypes.array.isRequired,
  currentRoom: PropTypes.array.isRequired,
  clickRoom: PropTypes.func.isRequired,
  sendMessage2: PropTypes.func.isRequired,
  currentRoomName: PropTypes.string.isRequired,
  addRoom: PropTypes.func.isRequired,
  newRoomName: PropTypes.string.isRequired,
  addUserToRoom: PropTypes.func.isRequired,
  invitedPerson: PropTypes.string.isRequired,
};

export default Chat;
