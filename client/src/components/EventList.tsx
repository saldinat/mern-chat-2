

import * as React from 'react';
import axios from 'axios';

import PropTypes from 'prop-types';

const EventList = props => {
  const { users } = props;
  
  return (
    <section className="">
      <h3>Events</h3>
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



export default EventList;
EventList.propTypes = {
  users: PropTypes.array.isRequired,
}; 