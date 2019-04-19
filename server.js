
/*
import Chatkit from "@pusher/chatkit-server";

import cors from "cors";

import express from "express";

import bodyParser from "body-parser";
*/


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Chatkit = require('@pusher/chatkit-server');
var mongoose = require('mongoose');
const PORT = process.env.PORT || 5200;

var Schema = mongoose.Schema;
var userSchema = new Schema({ name : String,
    room : String})
var User = mongoose.model('User', userSchema)
module.exports = mongoose.model('users', userSchema);

var eventSchema = new Schema({ event : String })
var Event = mongoose.model('Event', eventSchema)
module.exports = mongoose.model('events', eventSchema);

var dbUrl = 'mongodb://admin:Hobotom2018@ds159263.mlab.com:59263/chat'
mongoose.connect(dbUrl ,{useMongoClient : true} ,(err) => {
  console.log('mongodb connected',err);
})
const app = express();
//const bParser = bodyParser();
app.use(express.static(path.join(__dirname, 'frontend/build')))

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:fd5d3507-3a44-4f59-905a-010e1d50ac01",
  key: "f3765f45-893f-42a9-9ada-ad486470fe41:iVOiWSgCwYjUW9Hpp3DVEv+s/caG9itufE0MF48NRn0=",
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.post('/users', (req, res) => {
  const { username } = req.body;
  var user = new User({name: username, room: "test"});
  var event = new Event({event: "user "+username+" was added"});
  event.save((err) =>{
    if(err)
      console.log(err)
      //res.sendStatus(500);
    //res.sendStatus(200);
  });
  user.save((err) =>{
    if(err)
      console.log(err)
      //res.sendStatus(500);
    //res.sendStatus(200);
  });
  
  chatkit
    .createUser({
      id: username,
      name: username,
    })
    .then(() => {
      res.sendStatus(201);
    })
    .catch(err => {
      if (err.error === 'services/chatkit/user_already_exists') {
        console.log(`User already exists: ${username}`);
        res.sendStatus(200);
      } else {
        res.status(err.status).json(err);
      }
    });
});

app.post('/rooms', (req, res) => {
  const room  = req.body.newRoomName;
  //console.log("REQ BODY ", req.body)
  var event = new Event({event: "room  "+room+" was created"});
  event.save((err) =>{
    if(err)
      console.log(err)
      //res.sendStatus(500);
    //res.sendStatus(200);
  });
});
app.post('/roomUsers', (req, res) => {
  const data  = req.body;
  console.log("REQ BODY ", req.body)
  var event = new Event({event: data.currUser + " entered " + data.roomName + " room"});
  event.save((err) =>{
    if(err)
      console.log(err)
      //res.sendStatus(500);
    //res.sendStatus(200);
  });
});


app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({
    userId: req.query.user_id,
  });
  res.status(authData.status).send(authData.body);
});

app.set('port', 5200);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/api/eventlog', (req, res) => {
  Event.find({},(err, messages)=> {
    res.send(messages);
  })
});
app.get('/api/pRoom', (req, res) => {
  User.find({room:'pRoom'},(err, messages)=> {
    res.send(messages);
  })
});




