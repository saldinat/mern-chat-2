import Chatkit from '@pusher/chatkit-client';

import * as React from 'react';
import axios from 'axios';

import './App.css';
import './normalize.css';
import './skeleton.css';

import Chat from './components/Chat';
import EventList from './components/Chat';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
} from 'react-router-dom';
import { join } from 'path';

class App extends React.Component {
  state = {
    username: '',
    userInput: '',
    messages: [],
    currentUser: null,
    users: [],
    currentRoom: [],
    joinableRooms: [],
    roomId: '',
    currentRoomName: '',
    newRoomName: '',
    invitedPerson: '',
    events: []
  };

  /*fetchEvents = () => {
    axios.get('http://localhost:5200/api/eventlog').then(response => {
      console.log('Data fetched', response)
      this.setState({
        events: response.data
      })
    })
  }

  componentDidMount() {
    this.fetchEvents();
    console.log(this.state.events)
  }*/

  updateInput = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  grantNotificationPermission = () => {
    if (!('Notification' in window)) {
      alert('This browser does not support system notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('You are already subscribed to web notifications');
      return;
    }

    if (
      Notification.permission !== 'denied'
    ) {
      Notification.requestPermission().then(result => {
        if (result === 'granted') {
          new Notification(
            'Awesome! You will start receiving notifications shortly'
          );
        }
      });
    }
  };

  sendMessage = (event) => {
    event.preventDefault();
    const { userInput, currentUser, roomId } = this.state;
    const messageObj = {
      text: userInput,
      roomId: roomId,
    };

    currentUser.sendMessage(messageObj);
    this.setState({
      userInput: '',
    });
  };

  showNotification = message => {
    const { username } = this.state;
    if (message.senderId !== username) {
      const title = message.text;
      const body = message.senderId;

      new Notification(title, { body });
    }
  };

  addUserToRoom = event => {
    event.preventDefault();
    const { username, newRoomName, roomId, invitedPerson } = this.state;
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: 'v1:us1:fd5d3507-3a44-4f59-905a-010e1d50ac01',
      userId: username,
      tokenProvider: new Chatkit.TokenProvider({
        url: 'http://localhost:5200/authenticate',
      }),
    });

    chatManager.connect().then(currentUser => {
      currentUser.addUserToRoom({
        userId: invitedPerson,
        roomId: roomId,
      }).then(room => {
        console.log(`Created room called ${room.name}`)
      })
      .catch(err => {
        console.log(`Error creating room ${err}`)
      })
    })
  }

  
  addUser = event => {
    event.preventDefault();
    const { username } = this.state;
    
    axios
      .post('http://localhost:5200/users', { username })
      .then(() => {
        const tokenProvider = new Chatkit.TokenProvider({
          url: 'http://localhost:5200/authenticate',
        });

        const chatManager = new Chatkit.ChatManager({
          instanceLocator: 'v1:us1:fd5d3507-3a44-4f59-905a-010e1d50ac01',
          userId: username,
          tokenProvider,
        });
        
        return chatManager.connect().then(currentUser => {
          this.setState(
            {
              currentUser,
              users: currentUser.users,
              joinableRooms: currentUser.rooms,
            },
            () => this.grantNotificationPermission()
          );
        });
      })
      .catch(error => console.error(error));
  };

  addRoom = event => {  
    event.preventDefault();
    const { username, newRoomName } = this.state;
    this.setState({ joinableRooms: []})
    
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: 'v1:us1:fd5d3507-3a44-4f59-905a-010e1d50ac01',
      userId: username,
      tokenProvider: new Chatkit.TokenProvider({
        url: 'http://localhost:5200/authenticate',
      }),
    });

    chatManager.connect().then(currentUser => {
      currentUser.createRoom({
        name: newRoomName,
        private: false,
      })
      .then(room => {
        console.log(`Created room called ${room.name}`)
        console.log(room)
        axios.post('http://localhost:5200/rooms', {newRoomName})
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      })
      .catch(err => {
        console.log(`Error creating room ${err}`)
      })
      this.setState({
        joinableRooms: currentUser.rooms
      })
    })
  }

  clickRoom = roomid => {
    event.preventDefault();
    this.setState({ messages: []})
    const { username } = this.state;
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: 'v1:us1:fd5d3507-3a44-4f59-905a-010e1d50ac01',
      userId: username,
      tokenProvider: new Chatkit.TokenProvider({
        url: 'http://localhost:5200/authenticate',
      }),
    });

    chatManager.connect().then(currentUser => {
      currentUser.subscribeToRoom({
        roomId: roomid,
        hooks: {
          onMessage: message => {
            this.setState({messages: [...this.state.messages, message]}, 
              () => this.showNotification(message))
            console.log(this.state.messages);
          },
          onPresenceChanged: (state, user) => {
                const users = currentUser.users.sort((a, b) => {
                  if (a.presence.state === 'online') return -1;
                  return 1;
                });
                this.setState({
                  users,
                });
          },
        },
      })
      .then(room =>{
        this.setState({
          roomId: room.id,
          currentRoomName: room.name
        });
        let roomName = room.name
        let currUser = currentUser.name
        console.log("currentUser", currentUser)
        axios.post('http://localhost:5200/roomUsers', {roomName, currUser})
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      })
      this.setState({
        currentUser,
        users: currentUser.users,
        joinableRooms: currentUser.rooms,
      }, () => this.grantNotificationPermission());

    })
    .catch(error => console.error(error));
  };


  render() {
    const { username, users, currentUser, userInput, messages, joinableRooms, currentRoom, currentRoomName, newRoomName, invitedPerson, } = this.state;

    return (
      <div className="container">
        <Chat
          users={users}
          username={username}
          userInput={userInput}
          messages={messages}
          currentUser={currentUser}
          updateInput={this.updateInput}
          addUser={this.addUser}
          sendMessage={this.sendMessage}
          joinableRooms={joinableRooms}
          currentRoom={currentRoom}
          clickRoom={this.clickRoom}
          currentRoomName={currentRoomName}
          addRoom={this.addRoom}
          newRoomName={newRoomName}
          invitedPerson={invitedPerson}
          addUserToRoom={this.addUserToRoom}
        />
        
      </div>
    );
  }
}
export default App;
