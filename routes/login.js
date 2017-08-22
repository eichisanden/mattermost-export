const express = require('express');
const router = express.Router();
const client = require('../mattermost-client');
const result = {};

router.post('/', (req, res, next) => {
  login().then(getMe).then(getAllTeams).then(getChannels).then(() => {console.log("end all"); console.log(result);res.render('top', result);});  
});

function login() {
  const p = new Promise((resolve, reject) => {
    console.log("start login");
    client.login('eichisanden', 'redking', '', () => {console.log("end login"); resolve();}, error);
  });
  return p;
}

function getMe() {
  const p = new Promise((resolve, reject) => {
    console.log("start getMe");
    client.getMe((resbody, res) => {
        result.id = resbody.id;
        result.username = resbody.username;
        result.email = resbody.email;
        result.nickname = resbody.nickname;    
        console.log("end getMe");
        resolve();
      },
      error);
  });
  return p;
}

function getAllTeams() {
  result.teams = [];
  const p = new Promise((resolve, reject) => {
    console.log("start getAllTeams");
    client.getAllTeams((resbody, res) => {
        for (const teamId in resbody) {
          const obj = {};
          obj.id = resbody[teamId].id;
          obj.name = resbody[teamId].display_name;
          result.teams.push(obj);
        }
        console.log("end getAllTeams");
        resolve(result.teams[0].id);
      },
      error);
  });
  return p;
}

function getChannels(teamId) {
  result.channels = [];  
  client.setTeamId(teamId);  
  const p = new Promise((resolve, reject) => {
    client.getChannels((resbody, res) => {
      console.log("start getChannels");
      for (const channel of resbody) {
        const obj = {};
        obj.id = channel.id;
        obj.name = channel.display_name;
        result.channels.push(obj);
      }
      console.log("end getChannels");
      resolve();
    }, error);
  });
  return p;
}

let error = (e, err, res) => {
  console.log("===============================")
  console.log("Error")
  console.log("===============================")
  console.log(`status_code:${e.status_code}`);
  console.log(`detailed_error:${e.detailed_error}`);
  console.log(`message:${e.message}`);
};

module.exports = router;
