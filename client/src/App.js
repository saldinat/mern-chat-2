import React, { Component } from 'react';
import axios from 'axios';
import Chatkit from '@pusher/chatkit-client';
import Chat from './Chat';

import './normalize.css';
import './skeleton.css';
import './App.css';

class App extends Component {
  state = {
    username: '',
    userInput: '',
    messages: [],
    currentUser: null,
    users: [],
  };

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
      Notification.permission !== 'denied' ||
      Notification.permission === 'default'
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

  sendMessage = event => {
    event.preventDefault();

    const { userInput, currentUser } = this.state;
    const messageObj = {
      text: userInput,
      roomId: '<your room id>',
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
          instanceLocator: '<your instance locator>',
          userId: username,
          tokenProvider,
        });

        return chatManager.connect().then(currentUser => {
          currentUser.subscribeToRoom({
            roomId: '<your room id>',
            messageLimit: 0,
            hooks: {
              onMessage: message => {
                const { messages } = this.state;
                messages.push(message);
                console.log(messages);
                this.setState(
                  {
                    messages,
                  },
                  () => this.showNotification(message)
                );
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
          });

          this.setState(
            {
              currentUser,
              users: currentUser.users,
            },
            () => this.grantNotificationPermission()
          );
        });
      })
      .catch(error => console.error(error));
  };

  render() {
    const { username, users, currentUser, userInput, messages } = this.state;

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
        />
      </div>
    );
  }
}

export default App;
