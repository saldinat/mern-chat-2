import React from 'react';
import PropTypes from 'prop-types';

const RoomUsers = props => {
  const { users } = props;

  return (
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
  );
};

RoomUsers.propTypes = {
  users: PropTypes.array.isRequired,
};

export default RoomUsers;
